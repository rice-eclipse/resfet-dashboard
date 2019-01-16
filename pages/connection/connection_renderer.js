// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

const btnConnect = document.getElementById('btnConnect');
const btnKill = document.getElementById('btnKill');

const valIP = document.getElementById("inputIP").value;
const valTCP = document.getElementById("inputTCP").value;
const valUDP = document.getElementById("inputUDP").value;

const bannerTCP = document.getElementById("bannerTCP");


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

ipcRenderer.on('statusTCP-response', (event, arg) => {
    bannerTCP.classList.remove("badge-warning");
    bannerTCP.classList.remove("badge-danger");
    bannerTCP.classList.remove("badge-success");

    if(arg) {
      bannerTCP.classList.add("badge-success");
    } else {
      bannerTCP.classList.add("badge-danger");
    }
});

setInterval( function() {
  ipcRenderer.send('statusTCP-request', {});
}, 200);
ipcRenderer.send('statusTCP-request', {});
