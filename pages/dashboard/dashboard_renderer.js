// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

const btnIgnition = document.getElementById('btnIgnition')
const btnStopIgnition = document.getElementById('btnStopIgnition')

btnIgnition.addEventListener('click', function (event) {
  ipcRenderer.send('sendTCP', 'ignition');
})

btnStopIgnition.addEventListener('click', function (event) {
  ipcRenderer.send('sendTCP', 'stop-ignition');
})
