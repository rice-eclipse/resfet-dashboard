// Modules for config management.
let config = require("electron").remote.require("./modules/config")

// Module for network hook calls.
const { ipcRenderer, remote } = require('electron');

// Retrieving server connection buttons.
const btnConnect = document.getElementById('serverConnect')
const btnDisconnect = document.getElementById('serverDisconnect')

// Retrieving reinit logs button.
const btnToggleLogs = document.getElementById('toggleLogging')

// Retrieving ignition buttons.
const btnIgnition = document.getElementById('btnIgnition')
const btnStopIgnition = document.getElementById('btnStopIgnition')

// BTN: Connect
btnConnect.addEventListener('click', function (event) {
  ipcRenderer.send('connectTCP', {
    port: config.config.network.tcp.port,
    ip: config.config.network.tcp.ip
  });
})

// BTN: Disconnect
btnDisconnect.addEventListener('click', function (event) {
  ipcRenderer.send('destroyTCP', {});
})

// BTN: Reinit Logs
btnToggleLogs.addEventListener('click', function (event) {
  ipcRenderer.send('toggleLogging', {});
})

// BTN: Ignition
btnIgnition.addEventListener('click', function (event) {

  var buffer = Buffer.alloc(1);
  buffer.fill(config.config.commands[config.config.maincontrols.ignition.action]);

  if(!remote.getGlobal('sensor_logger').enabled) {
    Swal.fire({
      title: 'Logging is not enabled.',
      text: 'You are about to ignite the engine, but the logging is currently not enabled. Do you still want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, ignite!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        ipcRenderer.send('sendTCP', buffer);
      }
    });
  } else {
    ipcRenderer.send('sendTCP', buffer);
  }
})

// BTN: Anti-Ignition
btnStopIgnition.addEventListener('click', function (event) {
  var buffer = Buffer.alloc(1);
  buffer.fill(config.config.commands[config.config.maincontrols["anti-ignition"].action]);

  ipcRenderer.send('sendTCP', buffer);
})