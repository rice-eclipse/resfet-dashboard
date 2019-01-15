// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

const btnConnect = document.getElementById('btnConnect');
const btnKill = document.getElementById('btnKill');

const valIP = document.getElementById("inputIP").value;
const valTCP = document.getElementById("inputTCP").value;
const valUDP = document.getElementById("inputUDP").value;

btnConnect.addEventListener('click', function (event) {
  let Data = {
      port: valTCP,
      ip: valIP
  };
  ipcRenderer.send('connectTCP', Data);
})

btnKill.addEventListener('click', function (event) {
  ipcRenderer.send('destroyTCP', {});
})
