const { ipcRenderer } = require('electron');
let config = require("electron").remote.require("./modules/config")

const btnConnect = document.getElementById('serverConnect')
const btnDisconnect = document.getElementById('serverDisconnect')

const btnIgnition = document.getElementById('btnIgnition')
const btnStopIgnition = document.getElementById('btnStopIgnition')

const bannerTCP = document.getElementById("bannerTCP");

btnConnect.addEventListener('click', function (event) {
  ipcRenderer.send('connectTCP', {
    port: config.config.network.tcp.port,
    ip: config.config.network.tcp.ip
  });
  ipcRenderer.send('startUDP', {port: config.config.network.udp.port});
})

btnDisconnect.addEventListener('click', function (event) {
  ipcRenderer.send('destroyTCP', {});
  ipcRenderer.send('destroyUDP', {});
})

btnIgnition.addEventListener('click', function (event) {
  var buffer = Buffer.alloc(1);

  buffer.fill(7);

  ipcRenderer.send('sendTCP', buffer);
})

btnStopIgnition.addEventListener('click', function (event) {
  var buffer = Buffer.alloc(1);

  buffer.fill(6);

  ipcRenderer.send('sendTCP', buffer);
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