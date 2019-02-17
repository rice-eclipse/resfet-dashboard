/******************************************************************************
 * This file deals with reading data from TCP packets received from the Pi.
 *
 * Each packet consists of an 8-byte header, which contains the type and
 * number of data payloads being sent, followed by a series of 16-byte
 * payloads, which each contains a datapoint and a timestamp. The datapoint is
 * the actual numeric reading (e.g. from a load cell), while the timestamp is
 * the time at which the data was sent.
 * 
 * On the local server created by final_mocked (see the engine controller
 * code), these numbers are slightly different. The header, for example, is 16
 * bytes long instead. Other details are explained in the code itself.
 * 
 * Note that byte order is always little endian throughout the code.
 *****************************************************************************/

/**
 * Bytes indicating the type of payload. Found as the first byte of the header.
 */
var payload_types = {
    ACK_VALUE: 1, // acknowledgement from the Pi that it received something
    PAYLOAD: 2,
    TEXT: 3,
    UNSET_VALVE: 4, // command to close a specified valve
    SET_VALVE: 5, // command to open a specified valve
    UNSET_IGNITION: 6,
    SET_IGNITION: 7,
    NORM_IGNITE: 8,

    ///// For now, we only make use of the following 10 types of data: \\\\\
    LC_MAIN_SEND: 9, // datapoint from the main load cell
    LC1_SEND: 10, // datapoint from load cell 1
    LC2_SEND: 11, // datapoint from load cell 2
    LC3_SEND: 12, // datapoint from load cell 3
    PT_FEED_SEND: 13, // datapoint from the feed pressure transducer
    PT_INJE_SEND: 14, // datapoint from the injector pressure transducer
    PT_COMB_SEND: 15, // datapoint from the combination (?) pressure transducer
    TC1_SEND: 16, // datapoint from thermocouple 1
    TC2_SEND: 17, // datapoint from thermocouple 2
    TC3_SEND: 18, // datapoint from thermocouple 3
    ///// End useful data types \\\\\

    SET_WATER: 19,
    UNSET_WATER: 20,
    SET_GITVC: 21,
    UNSET_GITVC: 22
}

/**
 * Values that are used to calibrate raw sensor data.
 */
var calibrations = {
    LC_MAIN_SEND: [-0.3159, 105],
    LC1_SEND: [0.0093895, 0],
    LC2_SEND: [-0.0092222, 0],
    LC3_SEND: [0.0097715, 0],
    PT_FEED_SEND: [-0.275787487, 1069],
    PT_COMB_SEND: [-0.2810327855, 1068],
    PT_INJE_SEND: [-0.2782331275, 1045],
    TC1_SEND: [0.1611, -250],
    TC2_SEND: [0.1611, -250],
    TC3_SEND: [0.1611, -250]
}

/**
 * Formats the input microsecond timestamp nicely (hours:minutes:seconds).
 * Seconds is truncated to 3 decimal places.
 * 
 * @param {number} timestamp a numeric timestamp in microseconds
 * @return {string} a string with the formatted time
 */
function formatTimestamp(timestamp) {
    let hours = Math.floor(timestamp / 3600000000);
    let minutes = Math.floor(timestamp / 60000000) - hours * 60;
    let seconds = timestamp / 1000000.0 - hours * 3600 - minutes * 60;
    return (hours < 10 ? "0" + hours : hours.toString()) + ":" +
           (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" +
           (seconds < 10 ? "0" + seconds.toFixed(3) : seconds.toFixed(3));
}

/**
 * Reads the header (payload type and number) from a packet.
 * 
 * @param {Buffer} packet the packet to be read
 * @return {array} if successful, an array of the form [type, number];
 *                 otherwise, an empty array
 */
function readHeader(packet) {
    // Header format: type (1 byte), padding (3 bytes), number (4 bytes)
    if (packet.length < 8) {
        console.log("ERROR: packet is too short to read header!");
        return [];
    }
    let type = packet.readUInt8(0);
    let number = packet.readUInt32LE(4);
    return [type, number];
}

/**
 * Reads the payload data (datapoints and timestamps) from a packet.
 * 
 * @param {Buffer} packet the packet to be read
 * @param {number} number the number of payloads to be read
 * @return {array} if successful, an array of the form
 *                 [[data1, time1], [data2, time2], ...]; otherwise, an empty
 *                 array
 */
function readPayloads(packet, number) {
    // Payload format: data (4 bytes), time (4 bytes)
    if (packet.length < 16) {
        console.log("ERROR: packet is too short to read any payloads!");
        return [];
    } else if ((packet.length - 8) % 16 !== 0) {
        console.log("ERROR: payloads are truncated/malformed!");
        return [];
    } else if ((packet.length - 8) < number * 16) {
        console.log("ERROR: not enough payloads in packet!");
        return [];
    }
    let payloads = [];
    for (let i = 0; i < number; i++) {
        let payload = [];
        let data = packet.readUInt32LE(8 + i * 16);
        let time = packet.readUInt32LE(12 + i * 16);
        payloads.push([data, time]);
    }
    return payloads;
}
