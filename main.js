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

logger.log.info("Initializing slonkboard");

// Initializing the window.
let mainWindow
global.mainWindow = mainWindow

function createWindow() {
    global.mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1200,
        height: 900,
        minWidth: 1200,
        minHeight: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });
    global.mainWindow.webContents.openDevTools();
    global.mainWindow.loadFile('application.html');

    //global.mainWindow.webContents.openDevTools()

    global.mainWindow.on('closed', function () {
        /*
        Emitted when the window is closed.
        */
        global.mainWindow = null
    });
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
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (global.mainWindow === null) {
        createWindow();
    }
});

// The following are the hooks for TCP connections.
// These are accessible from all pages.

ipcMain.on('connectTcp', (_event, arg) => {
    interface.connectTcp(arg.port, arg.ip);
});

ipcMain.on('destroyTcp', (_event, _arg) => {
    interface.destroyTcp();
});

ipcMain.on('sendTcp', (_event, arg) => {
    interface.sendTcp(arg);
});

interface.emitter.on('status', function (data) {
    global.mainWindow.send('tcp_status', data);
});

interface.emitter.on("config", (new_config) => {
    global.mainWindow.send("config", new_config);
});

interface.emitter.on("sensorValue", (message) => {
    global.mainWindow.send("sensorValue", message);
});

interface.emitter.on("driverValue", (message) => {
    global.mainWindow.send("driverValue", message);
});

ipcMain.on('applySensorGroup', (_event, arg) => {
    global.mainWindow.send('applySensorGroup', arg);
});

logger.emitter.on('log', function (data) {
    if (global.mainWindow) {
        global.mainWindow.send('log', data);
    }
})