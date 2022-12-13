// Modules for config management.
let config = require("electron").remote.require("./modules/config")

// Module for network hook calls.
const { ipcRenderer, remote } = require('electron');

// Retrieving server connection buttons.
const btnConnect = document.getElementById('serverConnect')
const btnDisconnect = document.getElementById('serverDisconnect')

// Retrieving ignition buttons.
const btnIgnition = document.getElementById('btnIgnition')
const btnStopIgnition = document.getElementById('btnStopIgnition')

// Iterval variable
let interval;
let currentTimer = config.config.test.starttime;

// BTN: Connect
btnConnect.addEventListener('click', function (event) {
  ipcRenderer.send('connectTCP', {
    port: config.config.network.tcp.port,
    ip: config.config.network.tcp.ip
  });
});

// BTN: Disconnect
btnDisconnect.addEventListener('click', function (event) {
  ipcRenderer.send('destroyTCP', {});
});

// BTN: Reinit Logs
btnToggleLogs.addEventListener('click', function (event) {
  ipcRenderer.send('toggleLogging', {});
});

// BTN: Ignition
btnIgnition.addEventListener('click', function (event) {
  if (!remote.getGlobal('sensor_logger').enabled) {
    Swal.fire({
      title: 'Logging is not enabled.',
      text: 'You are about to ignite the engine, but the logging is currently not enabled. Do you still want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, ignite!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        stageIgnition();
      }
    });
  } else {
    stageIgnition();
  }
});

// BTN: Anti-Ignition
btnStopIgnition.addEventListener('click', function (event) {
  unstageIgnition();

  var buffer = Buffer.alloc(1);
  buffer.fill(config.config.commands[config.config.maincontrols["anti-ignition"].action]);

  ipcRenderer.send('sendTCP', buffer);
})

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
      ipcRenderer.send('sendTCP', buffer);
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