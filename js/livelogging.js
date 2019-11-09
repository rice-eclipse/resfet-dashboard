// Module for network hook calls.
const { ipcRenderer } = require('electron');

ipcRenderer.on('log', (event, arg) => {
    const logs = document.getElementById("logs");

    let level = ""

    if (arg.level == "info") {
        level = `<span style="color:green;">INFO</span>`
    } else if (arg.level == "error") {
        level = `<span style="color:red;">ERROR</span>`
    } else if (arg.level == "warn") {
        level = `<span style="color:yellow;">WARN</span>`
    } else {
        level = arg.level
    }

    logs.innerHTML += `${arg.timestamp} : [${level}] ${arg.message}<br>`;
    
    logs.scrollTop = logs.scrollHeight;

});