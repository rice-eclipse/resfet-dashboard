// Module for network hook calls.
const { ipcRenderer } = require('electron');

const driverInd = document.getElementsByClassName("driver-ind");

ipcRenderer.on('driverUpdate', (event, arg) => {
    
    driverInd.classList.remove("badge-warning");
    driverInd.classList.remove("badge-danger");
    driverInd.classList.remove("badge-success");

    for (let i = 1; i <=6; i++) { 
      currentDriver = document.getElementById("driver" + i + "-ind");
      if(arg && (arg & (1 << i)) != 0) {
        currentDriver.classList.add("badge-success");
      } else {
        currentDriver.classList.add("badge-danger");
      }
    }
});