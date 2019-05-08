// Module for network hook calls.
const { ipcRenderer } = require('electron');

const bannerTCP = document.getElementById("bannerTCP");

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