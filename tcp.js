var net = require('net');

var tcp_client = new net.Socket();
tcp_client.connect(1337, '127.0.0.1', function() {
	console.log('Connected to TCP server.');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
