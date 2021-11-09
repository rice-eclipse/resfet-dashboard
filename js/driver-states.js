// Module for network hook calls.
const { ipcRenderer } = require('electron');

ipcRenderer.on('driverUpdate', (event, arg) => {
    for (let i = 1; i <=6; i++) { 
      currentDriver = document.getElementById("driver" + i + "-ind");
      currentDriver.classList.remove("badge-warning");
      currentDriver.classList.remove("badge-danger");
      currentDriver.classList.remove("badge-success");
      if(arg && (arg & (1 << i)) != 0) {
        currentDriver.classList.add("badge-success");
      } else {
        currentDriver.classList.add("badge-danger");
      }
    }
});