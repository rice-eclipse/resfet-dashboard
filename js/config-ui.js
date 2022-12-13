// Modules for config management.
const interface = require("electron").remote.require("./modules/interface")

// Module for network hook calls.
const { ipcRenderer } = require('electron');
const { config } = require("winston");

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
        label.innerHTML = driver.label
        panelButtons.appendChild(label);

        // Group containing the buttons
        let btngroup = document.createElement("div");
        btngroup.className = "btn-group btn-block mb-3";
        btngroup.role = "group";

        // Add actuate and deactuate buttons
        btngroup.appendChild(make_driver_button("Actuate", i, true));
        btngroup.appendChild(make_driver_button("Deactuate", i, false));

        panelButtons.appendChild(btngroup);
    }

    // When buttons are clicked, a new TCP call is being made.
    var panelButtonsList = panelButtons.getElementsByTagName('button');
    for (var i = 0, len = panelButtonsList.length; i < len; i++) {
        panelButtonsList[i].onclick = function () {
            var buffer = Buffer.alloc(1);
            buffer.fill(config.config.commands[this.dataset.action]);
            ipcRenderer.send('sendTCP', buffer);
        }
    }
}

/**
 * Helper function to create a button for actuating drivers.
 * @param {string} label The label of the button. 
 * @param {int} id The ID of the driver to be actuated.
 * @param {bool} direction The direction of the button to be actuated (true for active, false for 
 *  inactive).
 */
function make_driver_button(label, id, direction) {
    let button = document.createElement("button");
    button.className = "btn btn-primary";
    button.innerHTML = label;
    button.onclick((_) => {
        interface.sendTCP({
            "type": "Actuate",
            "driver_id": id,
            "value": direction,
        });
    })
}

/**
 * Update the chart-panel graphs with new configuration information.
 * The chart-panel graphs are little dropdowns that let the user choose which graph has which data.
 */
function updateChartSelectorList() {

    // all the dropdowns
    let selection_dropdowns = [];

    // remove previous dropdown options and collect the selection panels
    for (let i = 0; i < 4; i++) {
        let selection_dropdown = document.getElementById("panelSelect" + i);
        selection_dropdowns.push(selection_dropdown);
        selection_dropdown.innerHTML = "";
    }

    // collect new sources of chart-able data
    let source_id = 0;
    for (group in interface.config.sensor_groups) {
        for (sensor in group.sensors) {
            // need a new option for each selector
            for (let i = 0; i < 4; i++) {
                let option = document.createElement("option");
                option.value = sensor.label;
                option.text = sensor.label;
                if (i == source_id) {
                    // by default, first four sources get to be on
                    option.selected = true;
                }
                selection_dropdowns[i].appendChild(option);
            }
            source_id += 1;
        }
    }

    // notify charts that it needs to be reformatted with this new data
    for (let i = 0; i < 4; i++) {
        ipcRenderer.send("reformatChart", { chartid: i, panel: selection_dropdowns[i].value });
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

        sensorList.innerHTML += '<table id="groups-' + i + '" class="table table-sm table-dark"></table>';
        for (sensor in group.sensors) {
            let row = table.insertRow();
            let label_cell = row.insertCell(0);
            let adc_cell = row.insertCell(1);
            let calib_cell = row.insertCell(2);

            label_cell.innerHTML = sensor.label;
            adc_cell.innerHTML = "N/A"; // no readings, so this text should be N/A for now
            adc_cell.id = "sensor-adc-" + sensor.label;
            adc_cell.classList.add("text-right"); // right align ADC value
            calib_cell.innerHTML = "N/A";
            calib_cell.id = "sensor-calib-" + sensor.label;
            calib_cell.classList.add("text-right"); // right align calibrated reading
        }
    }
}