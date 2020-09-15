/**
 * Simple test to confirm the ability of Node to interact with the RTR Arduino
 * prototype receiver.
 */

const SerialPort = require('serialport');
const fs = require('fs');
const path = require('path');
const Readline = require('@serialport/parser-readline')
const altSources = ["ALT_SEND"];
const gpsSources = ["GPS_X_SEND", "GPS_Y_SEND"];
const aclSources = ["ACCL_X_SEND", "ACCL_Y_SEND", "ACCL_Z_SEND"];
const gyrSources = ["GYRO_X_SEND", "GYRO_Y_SEND", "GYRO_Z_SEND"]; 
const magSources = ["MAGN_X_SEND", "MAGN_Y_SEND", "MAGN_Z_SEND"];

/**
 * Print out a list of SerialInfos in a readable manner.
 * 
 * @param {SerialPort.PortInfo[]} arrInfos the list to print
 */

// List available serial ports
let serials = SerialPort.list();
module.exports = {
    startSerialRead: function () {
        let file = '../logs/' + new Date().getTime() + '.txt';
        const filePath = path.join(__dirname, file);
        serials.then(
            arrInfos => {
                if (arrInfos.length > 0) {
                    let sp = new SerialPort(arrInfos[0].comName);
                    const parser = sp.pipe(new Readline());
                    parser.on('data', data => {
                        fs.open(filePath, 'a', function(err, fd) {
                            if (err) {
                                throw 'could not open file: ' + err;
                            }
                            fs.appendFile(fd, '\n' + data , (err) => {
                                fs.close(fd, (err) => {
                                    if (err) throw err;
                                });
                                if (err) throw err;
                            });
                        });
                        let endIndex = Math.min(data.indexOf("}"), data.indexOf("--"));
                        let line = data.substring(data.indexOf('{') + 1, endIndex).split(",");
                        if (data.substring(1, 4) == 'alt') {
                            for (var i = 0; i < altSources.length; i++) {
                                let source = altSources[i];
                                let value = parseFloat(line[i]);
                                console.log(source, value);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }

                        else if (data.substring(1, 4) == 'gps') {
                            for (var i = 0; i < gpsSources.length; i++) {
                                let source = gpsSources[i];
                                let value = parseFloat(line[i]);
                                console.log(source, value);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }

                        else if (data.substring(1, 4) == 'gyr') {
                            for (var i = 0; i < gyrSources.length; i++) {
                                let source = gyrSources[i];
                                let value = parseFloat(line[i]);
                                console.log(source, value);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }

                        else if (data.substring(1, 4) == 'mag') {
                            for (var i = 0; i < magSources.length; i++) {
                                let source = magSources[i];
                                let value = parseFloat(line[i]);
                                console.log(source, value);
                                if (source in global.recentdata) {
                                    global.recentdata[source] = value;
                                }
                            }
                        }

                        else if (data.substring(1, 4) == 'acl') {
                            for (var i = 0; i < aclSources.length; i++) {
                                let source = aclSources[i];
                                let value = parseFloat(line[i]);
                                console.log(source, value);
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