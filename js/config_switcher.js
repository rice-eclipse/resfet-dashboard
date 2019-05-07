// Modules for config management.
let config = require("electron").remote.require("./modules/config")

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
}

function updatePanelSelection() {
    /**
     * Updates the UI panel selection with the information from config.
     */

    var select1 = document.getElementById("panelSelect1");
    var select2 = document.getElementById("panelSelect2");
    var select3 = document.getElementById("panelSelect3");
    var select4 = document.getElementById("panelSelect4");

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
}

// Watch the 'configSelect' object in HTML and look for any change.
document.getElementById('configSelect').addEventListener('change', function() {
    config.applyConfig(this.value)
    updateConfigUI()
});

// Update the UI with the initial config on boot.
updateConfigUI()
