// Module for network hook calls.
const { ipcRenderer } = require('electron');

const bannerTCP = document.getElementById("bannerTCP");
const bannerUDP = document.getElementById("bannerUDP");

ipcRenderer.on('statusTCP', (event, arg) => {
    bannerTCP.classList.remove("badge-warning");
    bannerTCP.classList.remove("badge-danger");
    bannerTCP.classList.remove("badge-success");

    if(arg) {
      bannerTCP.classList.add("badge-success");
    } else {
      bannerTCP.classList.add("badge-danger");
    }
});

ipcRenderer.on('statusUDP', (event, arg) => {
  bannerUDP.classList.remove("badge-warning");
  bannerUDP.classList.remove("badge-danger");
  bannerUDP.classList.remove("badge-success");

  if(arg) {
    bannerUDP.classList.add("badge-success");
  } else {
    bannerUDP.classList.add("badge-danger");
  }
});