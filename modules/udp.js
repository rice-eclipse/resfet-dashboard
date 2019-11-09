/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse

Creates a class for UDP protocol, which is used to receive data from the engine controller.
Engine does not receive any data using TCP protocol; therefore, this is a one way communication.
*/

const dgram = require('dgram');
const EventEmitter = require('events');
const packets = require('./packets');
const logger = require("./logging");

var udp_server = dgram.createSocket('udp4');

module.exports = {
  udp_started: false,
  emitter: new EventEmitter(),
  startUDP: function(port) {
    /*
		Starts to the server.
    */
    
    // If UDP is running, then skip.
    if(module.exports.udp_started === true) {
      return;
    }

    // Bind UDP server to `port`.
    udp_server.bind(port);

    // Catch if there is an error.
    udp_server.on('error', (err) => {
      udp_server.close();
      console.log(`[UDP] Server Error:\n${err.stack}`);
    });
    
    // Process the retrieved package.
    udp_server.on('message', (msg, rinfo) => {
        let decoded = packets.decode(msg, rinfo);
        let source = global.config.config.sources_inv[decoded[0][0]]

        if (source in global.recentdata) {
            global.recentdata[source] = decoded[1][decoded[1].length-1][0]
        }
        //console.log(`[UDP] Received ${packets.formatDecode(decoded)} from ${rinfo.address}:${rinfo.port}.`);
    });
    
    // Catch if the server is closed.
    udp_server.on('close', (msg, rinfo) => {
      console.log(`[UDP] Server closed.`);
      module.exports.udp_started = false;
      module.exports.emitter.emit("status", module.exports.udp_started);

      // Reassign the server.
      udp_server = dgram.createSocket('udp4');
    });

    // Catch when the server starts listening.
    udp_server.on('listening', () => {
      let address = udp_server.address();
      module.exports.udp_started = true;
      module.exports.emitter.emit("status", module.exports.udp_started);
      console.log(`[UDP] Server initialized on ${address.address}:${address.port}.`);
    });
  },
  destroyUDP: function(port) {
    /*
		Destroys the server.
    */

    // If UDP is not running, then skip.
    if(module.exports.udp_started === false) {
      return;
    }

    udp_server.close();
  }
};