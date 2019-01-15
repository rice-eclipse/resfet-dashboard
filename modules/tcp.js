var net = require('net');

var tcp_client = new net.Socket();

module.exports = {
  connectTCP: function(port, ip) {
		/*
		Connects to the server.
		*/
		tcp_client.connect(port, ip, function() {
			console.log('[TCP] Connecting to server.');
			tcp_client.write('connection:newclient');
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
		console.log('[TCP] Connetion closed.');
	}
};

tcp_client.on('data', function(data) {
	console.log('[TCP] Received message ('+data+').');

	if(data == "connection:newclient") {
		console.log('[TCP] Connected to server.');
	}
});
