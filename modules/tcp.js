/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse

Creates a class for TCP protocol, which is used to send commands to the engine controller.
Engine does not send any data using TCP protocol; therefore, this is a one way communication.
*/

const net = require('net');
const packets = require('./configs/packets.js')

const tcp_client = new net.Socket();

module.exports = {
  tcp_connected: false,
  connectTCP: function(port, ip) {
		/*
		Connects to the server.
		*/
		tcp_client.connect(port, ip, function() {
			console.log('[TCP] Connecting to server...');
		});
	},
	sendTCP: function(data) {
		/*
		Sends a message to the server.
		*/
		tcp_client.write(data);
		console.log('[TCP] Sent message ('+data+').');

	},
	destroyTCP: function() {
		/*
		Destroys the connection.
		*/
		tcp_client.destroy();
	}
};

tcp_client.on('data', function(data) {
	/*
	Emitted when TCP client receives data from the server.
	*/
	console.log("[TCP] Received data.");
	console.log("[TCP] Receiving data is unsupported in RESFET, please make sure that the server is in the right version. Refer to GitHub if necessary.");
});

tcp_client.on('close', function(data) {
	/*
	Emitted when TCP client is disconnected.
	*/
	console.log('[TCP] Connection closed. ('+data+').');
  module.exports.tcp_connected = false;
});

tcp_client.on('connect', function() {
	/*
	Emitted when TCP client connects to the server.
	*/
	console.log('[TCP] Connection established.');
  module.exports.tcp_connected = true;
});
