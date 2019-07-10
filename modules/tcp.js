/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse

Creates a class for TCP protocol, which is used to send commands to the engine controller.
Engine does not send any data using TCP protocol; therefore, this is a one way communication.
*/

const net = require('net');
const EventEmitter = require('events');

const tcp_client = new net.Socket();

module.exports = {
	tcp_connected: false,
	emitter: new EventEmitter(),
	connectTCP: function(port, ip) {
		/*
		Connects to the server.
		*/

		// If TCP is running, then skip.
		if(module.exports.tcp_connected === true) {
			return;
		}

		console.log('[TCP] Connecting to '+ip+":"+port+"...");
		tcp_client.connect(port, ip);
	},
	sendTCP: function(data) {
		/*
		Sends a message to the server.
		*/

		console.log('[TCP] Sent message.');
		tcp_client.write(data);
	},
	destroyTCP: function() {
		/*
		Destroys the connection.
		*/

		if(module.exports.tcp_connected === false) {
			return;
		}

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
	console.log('[TCP] Connection closed.');
	module.exports.tcp_connected = false;

	// Emit TCP status.
	module.exports.emitter.emit("status", module.exports.tcp_connected);
});

tcp_client.on('connect', function() {
	/*
	Emitted when TCP client connects to the server.
	*/
	console.log(`[TCP] Connection established.`);
	module.exports.tcp_connected = true;

	// Emit TCP status.
	module.exports.emitter.emit("status", module.exports.tcp_connected);
});

tcp_client.on('error', function(err) {
	if(err.code == 'ECONNREFUSED') {
		console.log(`[TCP] Server could not be reached on ${err.address}:${err.port}.`);
	}
});