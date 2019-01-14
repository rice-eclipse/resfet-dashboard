var net = require('net');

var tcp_client = new net.Socket();


function connectTCP(port, ip) {
	/*
	*/
	tcp_client.connect(port, ip, function() {
		console.log('Connected to TCP server.');
		client.write('Hello, server! Love, Client.');
	});
}


client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
