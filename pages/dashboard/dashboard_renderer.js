// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

const btnIgnition = document.getElementById('btnIgnition')
const btnStopIgnition = document.getElementById('btnStopIgnition')

const bannerTCP = document.getElementById("bannerTCP");


btnIgnition.addEventListener('click', function (event) {
  ipcRenderer.send('sendTCP', 'ignition');
})

btnStopIgnition.addEventListener('click', function (event) {
  ipcRenderer.send('sendTCP', 'stop-ignition');
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
