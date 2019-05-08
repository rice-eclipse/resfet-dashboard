// Modules for config management.
let config = require("electron").remote.require("./modules/config")

// Module for network hook calls.
const { ipcRenderer } = require('electron');

// Retrieving server connection buttons.
const btnConnect = document.getElementById('serverConnect')
const btnDisconnect = document.getElementById('serverDisconnect')

// Retrieving ignition buttons.
const btnIgnition = document.getElementById('btnIgnition')
const btnStopIgnition = document.getElementById('btnStopIgnition')

// BTN: Connect
btnConnect.addEventListener('click', function (event) {
  ipcRenderer.send('connectTCP', {
    port: config.config.network.tcp.port,
    ip: config.config.network.tcp.ip
  });
  ipcRenderer.send('startUDP', {port: config.config.network.udp.port});
})

// BTN: Disconnect
btnDisconnect.addEventListener('click', function (event) {
  ipcRenderer.send('destroyTCP', {});
  ipcRenderer.send('destroyUDP', {});
})

// BTN: Ignition
btnIgnition.addEventListener('click', function (event) {
  var buffer = Buffer.alloc(1);
  buffer.fill(config.config.commands[config.config.maincontrols.ignition.action]);

  ipcRenderer.send('sendTCP', buffer);
})

// BTN: Anti-Ignition
btnStopIgnition.addEventListener('click', function (event) {
  var buffer = Buffer.alloc(1);
  buffer.fill(config.config.commands[config.config.maincontrols["anti-ignition"].action]);

  ipcRenderer.send('sendTCP', buffer);
})