// Modules for config management.

// Module for network hook calls.
const { ipcRenderer, remote } = require('electron');
const interface = require("electron").remote.require("./modules/interface.js");

// Retrieving server connection buttons.
const btnConnect = document.getElementById('serverConnect');
const btnDisconnect = document.getElementById('serverDisconnect');
const ipInput = document.getElementById("ipInput");
const portInput = document.getElementById("portInput");

// Retrieving ignition buttons.
const btnIgnition = document.getElementById('btnIgnition');
const btnStopIgnition = document.getElementById('btnStopIgnition');

// Iterval variable
let interval;
let currentTimer = null;

// BTN: Connect
btnConnect.addEventListener('click', function (event) {
  ipcRenderer.send('connectTcp', {
    port: portInput.value,
    ip: ipInput.value
  });
});

// BTN: Disconnect
btnDisconnect.addEventListener('click', function (event) {
  ipcRenderer.send('destroyTcp', {});
});

// BTN: Ignition
btnIgnition.addEventListener('click', function (event) {
  stageIgnition();
});

// BTN: Anti-Ignition
btnStopIgnition.addEventListener('click', function (event) {
  unstageIgnition();

  ipcRenderer.send('sendTcp', { "type": "EmergencyStop" });
});

function startInterval() {
  if (currentTimer != config.config.test.starttime) {
    return false;
  }

  interval = setInterval(function () {
    if (currentTimer < 0) {
      livelog.log("", "", `<span style="color:yellow;">` + currentTimer + ` seconds until ignition.</span>`);
    }
    if (currentTimer > 0) {
      livelog.log("", "", `<span style="color:yellow;">` + currentTimer + ` seconds elapsed since ignition.</span>`);
    }

    if (currentTimer == 0) {
      var buffer = Buffer.alloc(1);
      buffer.fill(config.config.commands[config.config.maincontrols.ignition.action]);
      ipcRenderer.send('sendTcp', buffer);
    }

    if (currentTimer >= config.config.test.finishtime) {
      unstageIgnition();
      return false;
    }

    currentTimer += 1;
  }, 1000);
}

// Start countdown delay and send buffer
function stageIgnition() {
  startInterval();
}

function unstageIgnition() {
  clearInterval(interval);
  currentTimer = config.config.test.starttime;
}