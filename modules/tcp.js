var net = require('net');

var tcp_client = new net.Socket();

module.exports = {
  tcp_connected: false,
  connectTCP: function(port, ip) {
		/*
		Connects to the server.
		*/
		tcp_client.connect(port, ip, function() {
      console.log(port+" "+ip)
			//console.log('[TCP] Connecting to server.');
			//tcp_client.write('connection:newclient');
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
	console.log('[TCP] Received message ('+data+').');
});

tcp_client.on('close', function(data) {
	console.log('[TCP] Connection closed. ('+data+').');
  module.exports.tcp_connected = false;
});

tcp_client.on('connect', function() {
	console.log('[TCP] Connection established.');
  module.exports.tcp_connected = true;
});
