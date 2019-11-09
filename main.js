/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse
*/

// Modules to control application life and create native browser window.
const {app, ipcMain, ipcRenderer, BrowserWindow} = require('electron');

// Module for logging.
let logger = require("./modules/runtime_logging");

logger.log.info("Initializing RESFET Dashboard.");

// Modules for config management.
let config = require("./modules/config");
global.config = config

// Initializing the window.
let mainWindow
global.mainWindow = mainWindow

// Modules to control UDP & TCP communication with the box.
let tcp = require("./modules/tcp");
let udp = require("./modules/udp");

function createWindow () {
  global.mainWindow = new BrowserWindow({width: 1200, height: 900, minWidth: 1200, minHeight: 900});
  global.mainWindow.loadFile('application.html');

  global.mainWindow.webContents.openDevTools()

  global.mainWindow.on('closed', function () {
    /*
    Emitted when the window is closed.
    */
   global.mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  /*
  Emitted when all windows are closed.
  */

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (global.mainWindow === null) {
    createWindow();
  }
})

// Reading the default configuration file, and setting it globally.
config.fetchConfigs().then((pathContent) => {
  config.applyConfig(pathContent[0]);
})

// The following are the hooks for TCP & UDP connection.
// These are accessible from all pages.

ipcMain.on('connectTCP', (event, arg) => {
    tcp.connectTCP(arg.port, arg.ip);
});

ipcMain.on('destroyTCP', (event, arg) => {
    tcp.destroyTCP();
});

ipcMain.on('sendTCP', (event, arg) => {
    tcp.sendTCP(arg);
});

tcp.emitter.on('status', function(data) {
  global.mainWindow.send('statusTCP', tcp.tcp_connected);

  if (data === true) {
    udp.startUDP({port: config.config.network.udp.port})
  } else {
    udp.destroyUDP();
  }
});

udp.emitter.on('status', function(data) {
  global.mainWindow.send('statusUDP', udp.udp_started);
});

ipcMain.on('reformatChart', (event, arg) => {
  global.mainWindow.send('reformatChart', arg);
});

logger.emitter.on('log', function (data) {
  if (global.mainWindow) {
    global.mainWindow.send('log', data);
  }
})