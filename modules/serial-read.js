/**
 * Simple test to confirm the ability of Node to interact with the RTR Arduino
 * prototype receiver.
 */

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
const altSources = ["ALT_SEND"];
const gpsSources = ["GPS_X_SEND", "GPS_Y_SEND"];
const imuSources = ["ACCL_X_SEND", "ACCL_Y_SEND", "ACCL_Z_SEND",
                    "GYRO_X_SEND","GYRO_Y_SEND", "GYRO_Z_SEND", 
                    "MAGN_X_SEND", "MAGN_Y_SEND", "MAGN_Z_SEND"];

/**
 * Print out a list of SerialInfos in a readable manner.
 * 
 * @param {SerialPort.PortInfo[]} arrInfos the list to print
 */

// List available serial ports
let serials = SerialPort.list();
module.exports = {
    startSerialRead: function () {
        serials.then(
            arrInfos => {
                if (arrInfos.length > 0) {
                    let sp = new SerialPort(arrInfos[0].comName);
                    const parser = sp.pipe(new Readline());
                    parser.on('data', data => {
                        let line = data.substring(data.indexOf('[') + 1, data.indexOf("]")).split(",");
                        if (data.substring(0, 3) == 'alt') {
                            for (var i = 0; i < altSources.length; i++) {
                                let source = altSources[i];
                                let value = parseFloat(line[i]);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }

                        else if (data.substring(0, 3) == 'gps') {
                            for (var i = 0; i < gpsSources.length; i++) {
                                let source = gpsSources[i];
                                let value = parseFloat(line[i]);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }

                        else if (data.substring(0, 3) == 'imu') {
                            for (var i = 0; i < imuSources.length; i++) {
                                let source = imuSources[i];
                                let value = parseFloat(line[i]);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }
                    });
                }
            },
            fail => console.log("Failed! Reason: ", fail)
        );
    }
}