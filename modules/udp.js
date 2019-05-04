/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse

Creates a class for UDP protocol, which is used to receive data from the engine controller.
Engine does not receive any data using TCP protocol; therefore, this is a one way communication.
*/

const dgram = require('dgram');
const packets = require('./configs/packets.js')

const udp_server = dgram.createSocket('udp4');

module.exports = {
  startUDP: function(port) {
    udp_server.bind(port);
  }
};
  
udp_server.on('error', (err) => {
  console.log(`[UDP] Server Error:\n${err.stack}`);
  udp_server.close();
});

udp_server.on('message', (msg, rinfo) => {
  console.log(`[UDP] Received ${msg} from ${rinfo.address}:${rinfo.port}.`);
});

udp_server.on('listening', () => {
  const address = udp_server.address();
  console.log(`[UDP] Server initialized on ${address.address}:${address.port}.`);
});