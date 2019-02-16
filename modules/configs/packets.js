/******************************************************************************
 * This file deals with reading data from TCP packets received from the Pi.
 *
 * Each packet consists of an 8-byte header, which contains the type and
 * number of data being sent, followed by a string of 16-byte payloads, which
 * each contains a datapoint and a timestamp. The datapoint is the actual
 * reading from the Pi, while the timestamp is the time at which the data was
 * sent.
 * 
 * On the local server created by final_mocked (see the engine controller
 * code), these numbers are slightly different. The header, for example, is 16
 * bytes long instead. Other details are explained in the code itself.
 * 
 * Note that byte order is always little endian throughout the code.
 *****************************************************************************/

/*
 * Bytes indicating the type of payload. Found as the first byte of the header.
 */
var payload_types = {
    ACK_VALUE: 1,
    PAYLOAD: 2,
    TEXT: 3,
    UNSET_VALVE: 4, 
    SET_VALVE: 5,
    UNSET_IGNITION: 6,
    SET_IGNITION: 7,
    NORM_IGNITE: 8,
    LC_MAIN_SEND: 9,
    LC1_SEND: 10,
    LC2_SEND: 11,
    LC3_SEND: 12,
    PT_FEED_SEND: 13,
    PT_INJE_SEND: 14,
    PT_COMB_SEND: 15,
    TC1_SEND: 16,
    TC2_SEND: 17,
    TC3_SEND: 18,
    SET_WATER: 19,
    UNSET_WATER: 20,
    SET_GITVC: 21,
    UNSET_GITVC: 22
}

/*
 * Formats the input microsecond timestamp nicely (hours:minutes:seconds), then
 * returns it as a string. Seconds is truncated to 3 decimal places.
 */
function formatTimestamp(timestamp) {
    var hours = Math.floor(timestamp / 3600000000);
    var minutes = Math.floor(timestamp / 60000000) - hours * 60;
    var seconds = timestamp / 1000000.0 - hours * 3600 - minutes * 60;
    return (hours < 10 ? "0" + hours : hours.toString()) + ":" +
           (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" +
           (seconds < 10 ? "0" + seconds.toFixed(3) : seconds.toFixed(3));
}
