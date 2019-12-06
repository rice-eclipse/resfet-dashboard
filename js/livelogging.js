// Module for network hook calls.
const { ipcRenderer } = require('electron');

module.exports = {
    log: function(timestamp, level, message) {
        const logs = document.getElementById("logs");
        if (timestamp != "" && level != "") {
            logs.innerHTML += `${timestamp} : [${level}] ${message}<br>`;
        } else {
            logs.innerHTML += `${message}<br>`;
        }
        logs.scrollTop = logs.scrollHeight;
    }
}

ipcRenderer.on('log', (event, arg) => {

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

    module.exports.log(arg.timestamp, level, arg.message);
});