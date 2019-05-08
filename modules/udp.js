/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse

Creates a class for UDP protocol, which is used to receive data from the engine controller.
Engine does not receive any data using TCP protocol; therefore, this is a one way communication.
*/

const dgram = require('dgram');
const packets = require('./packets');

var udp_server = dgram.createSocket('udp4');

module.exports = {
  startUDP: function(port) {
    /*
		Starts to the server.
		*/
    udp_server.bind(port);

    udp_server.on('error', (err) => {
      console.log(`[UDP] Server Error:\n${err.stack}`);
      udp_server.close();
    });
    
    udp_server.on('message', (msg, rinfo) => {
        // console.log(`[UDP] Received ${msg} from ${rinfo.address}:${rinfo.port}.`);
        let decoded = packets.decode(msg, rinfo, config.config.network.udp["64-bit"]);
        global.mainWindow.send("plotData", {
            type: decoded[0][0],
            values: decoded.slice(1)
        })
        console.log(packets.formatDecode(decoded));
    });
    
    udp_server.on('close', (msg, rinfo) => {
      console.log(`[UDP] Server closed.`);
      udp_server = dgram.createSocket('udp4');
    });
    
    udp_server.on('listening', () => {
      let address = udp_server.address();
      console.log(`[UDP] Server initialized on ${address.address}:${address.port}.`);
    });
  },
  destroyUDP: function(port) {
    /*
		Destroys the server.
		*/
    udp_server.close();
  }
};