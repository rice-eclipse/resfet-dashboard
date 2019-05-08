// Modules for config management.
let config = require("electron").remote.require("./modules/config")

// Module for network hook calls.
const { ipcRenderer } = require('electron');

config.fetchConfigs().then((pathContent) => {
    /**
    * Fills the config selector with the available options from configs/ directory.
    */
    var selectElement = document.getElementById("configSelect");
    for (var i = 0; i < pathContent.length; i++) {
        var option = document.createElement("option");
        option.value = pathContent[i];
        option.text = pathContent[i];
        selectElement.appendChild(option);
    }
}, (err) => {
    console.log(err);
});

function updateConfigUI() {
    /**
    * Updates the UI elements with values from the config.
    */
    document.getElementById('currentConfig').innerHTML = config.configPath;
    document.getElementById('tcpAddress').innerHTML = config.config.network.tcp.ip+":"+config.config.network.tcp.port;
    document.getElementById('udpAddress').innerHTML = "0.0.0.0:"+config.config.network.udp.port;

    updatePanelButtons();
    updatePanelSelection();
}

function updatePanelButtons() {
    /**
    * Updates the UI buttons with the information from the config.
    */
    var panelButtons = document.getElementById("panelButtons");

    panelButtons.innerHTML = "";

    for (var i = 0; i < config.config.controls.length; i++) {
        var label = document.createElement("h6");
        label.className = "text-muted";
        label.innerHTML = config.config.controls[i].label
        panelButtons.appendChild(label);

        var btngroup = document.createElement("div");
        btngroup.className = "btn-group btn-block mb-3";
        btngroup.role = "group";

        for (var j = 0; j < config.config.controls[i].buttons.length; j++) {
            var btn = document.createElement("button");
            btn.className = "btn btn-"+config.config.controls[i].buttons[j].style;
            btn.innerHTML = config.config.controls[i].buttons[j].label;
            btn.dataset.action = config.config.controls[i].buttons[j].action;

            btngroup.appendChild(btn);
        }

        panelButtons.appendChild(btngroup);
    }

    // When buttons are clicked, a new TCP call is being made.
    var panelButtonsList = panelButtons.getElementsByTagName('button');
    for (var i = 0, len = panelButtonsList.length; i < len; i++) {
        panelButtonsList[i].onclick = function (){
            var buffer = Buffer.alloc(1);
            buffer.fill(config.config.commands[this.dataset.action]);
            ipcRenderer.send('sendTCP', buffer);
        }
    }
}

function updatePanelSelection() {
    /**
    * Updates the UI panel selection with the information from config.
    */

    // Initializing all the variables.

    var select1 = document.getElementById("panelSelect1");
    var select2 = document.getElementById("panelSelect2");
    var select3 = document.getElementById("panelSelect3");
    var select4 = document.getElementById("panelSelect4");

    // Clearing the select options.
    select1.innerHTML = "";
    select2.innerHTML = "";
    select3.innerHTML = "";
    select4.innerHTML = "";

    // Loop through all the panel options and fill each select with the options.
    // Also sets the default panel based on the order of the panels in json.
    for (var i = 0; i < config.config.panels.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = config.config.panels[i].label;
        if(i == 0) { option.selected = true; }
        select1.appendChild(option);

        var option = document.createElement("option");
        option.value = i;
        option.text = config.config.panels[i].label;
        if(i == 1) { option.selected = true; }
        select2.appendChild(option);

        var option = document.createElement("option");
        option.value = i;
        option.text = config.config.panels[i].label;
        if(i == 2) { option.selected = true; }
        select3.appendChild(option);

        var option = document.createElement("option");
        option.value = i;
        option.text = config.config.panels[i].label;
        if(i == 3) { option.selected = true; }
        select4.appendChild(option);
    }

    // Calls the reformatChart hook to update charts accordingly.
    ipcRenderer.send("reformatChart", {chartid: 0, panel: select1.value})
    ipcRenderer.send("reformatChart", {chartid: 1, panel: select2.value})
    ipcRenderer.send("reformatChart", {chartid: 2, panel: select3.value})
    ipcRenderer.send("reformatChart", {chartid: 3, panel: select4.value})
}

// Watch the 'configSelect' object in HTML and look for any change.
document.getElementById('configSelect').addEventListener('change', function() {
    config.applyConfig(this.value)
    updateConfigUI()
});

// Update the UI with the initial config on boot.
updateConfigUI()
