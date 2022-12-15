// Modules for config management.


// Module for network hook calls.
const { ipcRenderer } = require('electron');
const { config } = require("winston");
const interface = require("electron").remote.require("./modules/interface.js");

/**
 * Update the control panel buttons based on the current configuration.
 * 
 * If this current configuration hasn't changed since the last time this was called, this will be a 
 * no-op.
 */
function updatePanelButtons() {
    let panelButtons = document.getElementById("panelButtons");

    // Clear out the pannel so we can overwrite it with some new buttons.
    panelButtons.innerHTML = "";

    for (let i = 0; i < interface.config.drivers.length; i++) {
        let driver = interface.config.drivers[i];

        // Label for the driver
        let label = document.createElement("h6");
        label.className = "text-muted";

        // add badge for driver state
        let badge = document.createElement("span");
        badge.className = "badge badge-danger";
        badge.id = "driver-state-badge-" + i;
        badge.style = "font-family: 'Courier New', Courier, monospace;"
        badge.innerHTML = "" + i;
        interface.emitter.on("driverValue", (message) => {
            // Register that badge color changes upon driver status messages
            badge.class = "badge ";
            if (message.values[i]) {
                badge.className += "badge-success";
            } else {
                badge.className += "badge-danger";
            }
        })
        label.appendChild(badge);

        // add driver name
        label.innerHTML += " " + driver.label;
        panelButtons.appendChild(label);

        if (!driver.protected) {
            // unprotected drivers get manual actuation controls

            // Group containing the buttons
            let group = document.createElement("div");
            group.className = "btn-group";
            group.role = "group";

            // Add actuate and deactuate buttons
            group.appendChild(make_driver_button("Actuate", i, true));
            group.appendChild(make_driver_button("Deactuate", i, false));

            panelButtons.appendChild(group);
        }

    }
}

/**
 * Helper function to create a button for actuating drivers.
 * @param {string} label The label of the button. 
 * @param {int} id The ID of the driver to be actuated.
 * @param {bool} direction The direction of the button to be actuated (true for active, false for 
 *  inactive).
 * 
 * @return {Node} a newly-made button.
 */
function make_driver_button(label, id, direction) {
    let button = document.createElement("button");
    button.className = "btn btn-primary";
    button.innerHTML = label;
    button.onclick = (_) => {
        interface.sendTcp({
            "type": "Actuate",
            "driver_id": id,
            "value": direction,
        });
    };

    return button;
}

/**
 * Update the chart-panel graphs with new configuration information.
 * The chart-panel graphs are little dropdowns that let the user choose which graph has which data.
 */
function updateChartSelectorList() {

    // all the dropdowns
    let selectionDropdowns = [];

    // remove previous dropdown options and collect the selection panels
    for (let i = 0; i < 4; i++) {
        let selectionDropdown = document.getElementById("panelSelect" + i);
        selectionDropdowns.push(selectionDropdown);
        selectionDropdown.innerHTML = "";
    }

    // collect new sources of chart-able data
    let source_id = 0;
    for (group of interface.config.sensor_groups) {
        // need a new option for each selector
        for (let i = 0; i < 4; i++) {
            let option = document.createElement("option");
            option.value = source_id;
            option.text = group.label;
            if (i == source_id) {
                // by default, first four sources get to be on
                option.selected = true;
            }
            selectionDropdowns[i].appendChild(option);
        }
        source_id += 1;
    }

    // notify charts that it needs to be reformatted with this new data
    for (let i = 0; i < 4; i++) {
        ipcRenderer.send("reformatChart", { chartid: i, panel: selectionDropdowns[i].value });
    }
}

/**
 * Update the list of sensors and their readings.
 */
function updateSensorList() {
    var sensorList = document.getElementById("panelSensors");
    sensorList.innerHTML = "";

    let source_id = 0;
    for (group in interface.config.sensor_groups) {
        let label = document.createElement("h6");
        label.className = "text-muted";
        label.innerHTML = group.label
        sensorList.appendChild(label);

        sensorList.innerHTML += '<table id="group-"' + group.label + '" class="table table-sm table-dark"></table>';
        for (sensor in group.sensors) {
            let row = table.insertRow();
            let labelCell = row.insertCell(0);
            let adcCell = row.insertCell(1);
            let calibCell = row.insertCell(2);

            labelCell.innerHTML = sensor.label;
            adcCell.innerHTML = "N/A"; // no readings, so this text should be N/A for now
            adcCell.id = "sensor-adc-" + sensor.label;
            adcCell.classList.add("text-right"); // right align ADC value
            calibCell.innerHTML = "N/A";
            calibCell.id = "sensor-calib-" + sensor.label;
            calibCell.classList.add("text-right"); // right align calibrated reading
        }
    }
}

interface.emitter.on("config", (_event) => {
    updatePanelButtons();
    updateChartSelectorList();
    updateSensorList();
})

interface.emitter.on("status", (status) => {
    if (!status) {
        // clear out dashboard on disconnect
        document.getElementById("panelSensors").innerHTML = "";
        document.getElementById("panelButtons").innerHTML = "";
        for (let i = 0; i < 4; i++) {
            let selectionDropdown = document.getElementById("panelSelect" + i);
            selectionDropdowns.push(selectionDropdown);
            selectionDropdown.innerHTML = "";
        }
    }
})