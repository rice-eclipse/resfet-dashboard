/**
 * Simple test to confirm the ability of Node to interact with the RTR Arduino
 * prototype receiver.
 */

const SerialPort = require('serialport');

/**
 * Print out a list of SerialInfos in a readable manner.
 * 
 * @param {SerialPort.PortInfo[]} arrInfos the list to print
 */
function printSerialInfo(arrInfos) {
    if (arrInfos.length === 0) {
        console.log("No serials found!");
        return;
    }
    arrInfos.forEach(info => {
        console.log("==========================");
        console.log("comName: ", info.comName);
        console.log("manufacturer: ", info.manufacturer);
        console.log("serialNumber: ", info.serialNumber);
        console.log("pnpId: ", info.pnpId);
        console.log("locationId: ", info.locationId);
        console.log("productId: ", info.productId);
        console.log("vendorId: ", info.vendorId);
        console.log("==========================");
    });
}

// List available serial ports
let serials = SerialPort.list();

serials.then(
    arrInfos => {
        printSerialInfo(arrInfos);
        if (arrInfos.length > 0) {
            let sp = new SerialPort(arrInfos[0].comName);
            sp.on('data', data => process.stdout.write(data.toString('ascii')));
        }
    },
    fail => console.log("Failed! Reason: ", fail)
);
