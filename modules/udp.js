/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse

Creates a class for UDP protocol, which is used to receive data from the engine controller.
Engine does not receive any data using TCP protocol; therefore, this is a one way communication.
*/

const dgram = require('dgram');
const EventEmitter = require('events');
const packets = require('./packets');
const logger = require("./runtime_logging");

var udp_server = dgram.createSocket('udp4');

let idletime = {};
let timeout = 100;

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
      logger.log.info(`UDP server error:\n${err.stack}`);
    });
    
    // Process the retrieved package.
    udp_server.on('message', (msg, rinfo) => {
        let decoded = packets.decode(msg, rinfo);
        let source = global.config.config.sources_inv[decoded[0][0]];
        let message = decoded[1][decoded[1].length-1][0];
        let lambda = global.config.lambda[source];
        let value = lambda(message);
        let plot = false;

        if (source in idletime) {
          if(Date.now() - idletime[source] > timeout) {
            plot = true;
          }
        } else {
          plot = true;
        }

        // Log the value.
        global.sensor_logger.log(source, Date.now(), value);

        if (plot) {
          idletime[source] = Date.now();

          // Plot data on Graph.
          global.mainWindow.webContents.executeJavaScript(`charts.plotData(${Date.now()}, '${source}', ${value});`);
        }

        //console.log(`[UDP] Received ${packets.formatDecode(decoded)} from ${rinfo.address}:${rinfo.port}.`);
    });
    
    // Catch if the server is closed.
    udp_server.on('close', (msg, rinfo) => {
      logger.log.info(`UDP server closed.`);
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
      logger.log.info(`UDP server initialized on ${address.address}:${address.port}.`);
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