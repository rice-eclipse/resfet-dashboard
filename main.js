/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse
*/

// Modules to control application life and create native browser window.
const { app, ipcMain, dialog, BrowserWindow } = require('electron');

// Module for runtime charting if 
const logger = require("./modules/runtime_logging");
const sensor_logger = require("./modules/sensor_logging");
const interface = require("./modules/interface")
global.sensor_logger = sensor_logger;

logger.log.info("Initializing RESFET Dashboard.");

// Initializing the window.
let mainWindow
global.mainWindow = mainWindow

function createWindow() {
  global.mainWindow = new BrowserWindow({
    width: 1200,
    height: 940,
    minWidth: 1200,
    minHeight: 940,
    webPreferences: {
      nodeIntegration: true
    }
  });
  global.mainWindow.loadFile('application.html');

  //global.mainWindow.webContents.openDevTools()

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

// The following are the hooks for TCP & UDP connection.
// These are accessible from all pages.

ipcMain.on('connectTCP', (event, arg) => {
  interface.connectTCP(arg.port, arg.ip);
});

ipcMain.on('destroyTCP', (event, arg) => {
  interface.destroyTCP();
});

ipcMain.on('sendTCP', (event, arg) => {
  interface.sendTCP(arg);
});

interface.emitter.on('status', function (data) {
  global.mainWindow.send('statusTCP', interface.tcp_connected);
});

ipcMain.on('reformatChart', (event, arg) => {
  global.mainWindow.send('reformatChart', arg);
});

logger.emitter.on('log', function (data) {
  if (global.mainWindow) {
    global.mainWindow.send('log', data);
  }
})