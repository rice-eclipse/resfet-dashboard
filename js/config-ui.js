// Modules for config management.


// Module for network hook calls.
const { ipcRenderer } = require('electron');
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

        // Group containing the buttons
        let group = document.createElement("div");
        group.className = "btn-group mb-2 float-right col-12 pl-0";

        // Label for the driver
        let label = document.createElement("div");
        label.className = "input-group-text text-left";
        label.style = "flex: 1";
        // label.className = "input-group-prepend";

        // add badge for driver state
        let badge = document.createElement("span");
        badge.className = "badge badge-secondary";
        badge.id = "driver-state-badge-" + i;
        badge.innerHTML = "" + i;
        label.appendChild(badge);

        // add driver name
        label.innerHTML += "&nbsp;" + driver.label;
        group.appendChild(label);

        let buttonSet = document.createElement("div");
        buttonSet.className = "input-group-append";

        // unprotected drivers get manual actuation controls

        // Add actuate and deactuate buttons
        let actButton = make_driver_button("Actuate", i, true);
        let deactButton = make_driver_button("Deactuate", i, false);
        if (driver.protected) {
            actButton.disabled = true;
            deactButton.disabled = true;
        }
        buttonSet.appendChild(actButton);
        buttonSet.appendChild(deactButton);
        group.appendChild(buttonSet);

        panelButtons.appendChild(group);

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
    button.id = "driver-actuate-btn-" + id + "-" + direction;
    button.className = "btn ";
    if (direction) {
        button.className += "btn-primary";
    } else {
        button.className += "btn-secondary";
    }
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
 * Update the driver badges based on a newly-received driver value message.
 * @param {object} message The driver status update that was just received.
 */
function updateDriverBadges(message) {
    for (idx = 0; idx < message.values.length; idx++) {
        let badge = document.getElementById("driver-state-badge-" + idx);
        let actuateButton = document.getElementById("driver-actuate-btn-" + idx + "-true");
        let deactuateButton = document.getElementById("driver-actuate-btn-" + idx + "-false");
        if (message.values[idx]) {
            badge.className = "badge badge-primary";
            if (!interface.config.drivers[idx].protected) {
                actuateButton.className = "btn btn-secondary";
                deactuateButton.className = "btn btn-primary";
            }
        } else {
            badge.className = "badge badge-secondary";
            if (!interface.config.drivers[idx].protected) {
                actuateButton.className = "btn btn-primary";
                deactuateButton.className = "btn btn-secondary";
            }
        }
    }
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
        ipcRenderer.send("applySensorGroup", { chartid: i, panel: selectionDropdowns[i].value });
    }
}

/**
 * Update the list of sensors and their readings.
 */
function updateSensorList() {
    var sensorList = document.getElementById("panelSensors");
    sensorList.innerHTML = "";

    for (group of interface.config.sensor_groups) {
        let label = document.createElement("h6");
        label.innerHTML = group.label
        sensorList.appendChild(label);

        table = document.createElement("table");
        table.id = "group-" + group.label;
        table.className = "table table-sm";
        sensorList.appendChild(table);
        for (sensor of group.sensors) {
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
            calibCell.style = "width:25%";
            calibCell.classList.add("text-right"); // right align calibrated reading
        }
    }
}

/**
 * Update the sensor values panel based on a new sensor value message.
 * @param {object} message The message that was sent to the dashboard with sensor values.
 */
function updateSensorListValues(message) {
    let groupCfg = interface.config.sensor_groups[message.group_id];
    for (datum of message.readings) {
        let sensorCfg = groupCfg.sensors[datum.sensor_id];
        let calibValue = sensorCfg.calibration_slope * datum.reading + sensorCfg.calibration_intercept;

        let adcCell = document.getElementById("sensor-adc-" + sensorCfg.label);
        adcCell.innerHTML = datum.reading;
        let calibCell = document.getElementById("sensor-calib-" + sensorCfg.label);
        calibCell.innerHTML = Math.round(calibValue) + " " + sensorCfg.units;
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
            selectionDropdown.innerHTML = "";
        }
    }
})

interface.emitter.on("driverValue", updateDriverBadges);

interface.emitter.on("sensorValue", updateSensorListValues)