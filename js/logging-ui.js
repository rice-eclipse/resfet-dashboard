// Modules for sensor logging.
let sensor_logging = require("electron").remote.require("./modules/sensor_logging")

// Module for network hook calls.
const { ipcRenderer } = require('electron');

const sourceLogging = document.getElementById("sourceLogging");

function updateLoggingUI() {
    if (sensor_logging.directory != "") {
        document.getElementById('currentLogDir').innerHTML = "logs/"+sensor_logging.directory+"/";
    } else {
        document.getElementById('currentLogDir').innerHTML = "N/A";
    }
}

updateLoggingUI()

ipcRenderer.on('statusLogging', (event, arg) => {
    updateLoggingUI();

    sourceLogging.classList.remove("badge-warning");
    sourceLogging.classList.remove("badge-danger");
    sourceLogging.classList.remove("badge-success");
  
    if(arg) {
        sourceLogging.classList.add("badge-success");
    } else {
        sourceLogging.classList.add("badge-danger");
    }
});