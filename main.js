/*
Written by Alp Yakici and Andrew Obler for Rice Eclipse
*/

// Modules to control application life and create native browser window.
const {app, ipcMain, ipcRenderer, BrowserWindow} = require('electron')

// Modules to control UDP & TCP communication with the box.
let tcp = require("./modules/tcp")
let udp = require("./modules/udp")

// Modules for config management.
let config = require("./modules/config")

// Initializing the window.
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800, minWidth: 1200, minHeight: 800})
  mainWindow.loadFile('application.html')

  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    /*
    Emitted when the window is closed.
    */
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  /*
  Emitted when all windows are closed.
  */

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Reading the default configuration file, and setting it globally.
config.fetchConfigs().then((pathContent) => {
  config.applyConfig(pathContent[0]);
})

// The following are the hooks for TCP & UDP connection.
// These are accessible from all pages.

ipcMain.on('connectTCP', (event, arg) => {
    tcp.connectTCP(arg.port, arg.ip)
});

ipcMain.on('startUDP', (event, arg) => {
  udp.startUDP(arg.port)
});

ipcMain.on('destroyTCP', (event, arg) => {
    tcp.destroyTCP()
});

ipcMain.on('destroyUDP', (event, arg) => {
  udp.destroyUDP(arg.port)
});

ipcMain.on('sendTCP', (event, arg) => {
    tcp.sendTCP(arg)
});

ipcMain.on('statusTCP-request', (event, arg) => {
  event.sender.send('statusTCP-response', tcp.tcp_connected);
});

ipcMain.on('reformatChart', (event, arg) => {
    mainWindow.send('reformatChart', arg);
});