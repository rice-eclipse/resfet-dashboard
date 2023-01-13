// Modules for config management.
let config = require("electron").remote.require("./modules/config")

// Module for network hook calls.
const { ipcRenderer } = require('electron');

/**
 * The source for oxidizer TC data.
 * 
 * This is a hack! 
 * My hope is that RESFET is sunsetted before this hack becomes obvious.
 */
const OX_TC_SOURCE = "TC1_SEND";
/**
 * The most recently received oxidizer TC datum, in degrees Celsius.
 * 
 * If this value is `null`, no oxidizer temperature has been measured since the start of the 
 * controller.
 */
var celsiusMostRecentOxTemp = null;

/**
 * The source for the oxidizer tank PT data.
 * 
 * This is a hack! 
 * My hope is that RESFET is sunsetted before this hack becomes obvious.
 */
const OX_TANK_PT_SOURCE = "PT4_SEND";
/**
 * The most recently received oxidizer tank pressure in psi.
 * 
 * If this value is `null`, no oxidizer tank pressure mas been measured since the start of the 
 * controller.
 */
var psiMostRecentOxTankPressure = null;

/**
 * The source for the oxidizer feedline PT data.
 * 
 * This is a hack! 
 * My hope is that RESFET is sunsetted before this hack becomes obvious.
 */
const FEEDLINE_PT_SOURCE = "PT4_SEND";
/**
 * The most recently received oxidizer feedline pressure in psi.
 * 
 * If this value is `null`, no oxidizer tank pressure mas been measured since the start of the 
 * controller.
 */
var psiMostRecentFeedlinePressure = null;

const MASS_FLOW_SOURCE = "FLOW";


// Initializing all the variables.
var chartElems = [];
chartElems.push(document.getElementById("chart1").getContext('2d'));
chartElems.push(document.getElementById("chart2").getContext('2d'));
chartElems.push(document.getElementById("chart3").getContext('2d'));
chartElems.push(document.getElementById("chart4").getContext('2d'));

var panelSelects = [];
panelSelects.push(document.getElementById("panelSelect1"));
panelSelects.push(document.getElementById("panelSelect2"));
panelSelects.push(document.getElementById("panelSelect3"));
panelSelects.push(document.getElementById("panelSelect4"));

var panelLabels = [];
panelLabels.push(document.getElementById("panelLabel1"));
panelLabels.push(document.getElementById("panelLabel2"));
panelLabels.push(document.getElementById("panelLabel3"));
panelLabels.push(document.getElementById("panelLabel4"));

// Initializing all the charts.
var charts = []

for (var i = 0; i < 4; i++) {
    charts.push(new Chart(chartElems[i], {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            legend: {
                display: true,
                labels: {
                    boxWidth: 15
                }
            },
            scales: {
                xAxes: [{
                    type: 'realtime'
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "N/A"
                    }
                }]
            },
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            plugins: {
                streaming: {
                    frameRate: 15
                }
            }
        }
    }));
}

function reformatChart(chartid, panel) {
    /**
     * Takes chartid, which is the id [0, 1, 2, 3] of the chart displayed on the dashboard; panel, which is the index of the panel in json.
     */
    var chart = charts[chartid];
    var label = panelLabels[chartid];

    chart.data.datasets = []

    for (var i = 0; i < config.config.panels[panel].data.length; i++) {
        chart.data.datasets.push({
            label: config.config.panels[panel].data[i].label,
            data: [],
            lineTension: 0,
            fill: false,
            backgroundColor: config.config.panels[panel].data[i].color,
            borderColor: config.config.panels[panel].data[i].color,
            datasource: config.config.panels[panel].data[i].source
        });
        
        chart.options.scales.yAxes[0].scaleLabel.labelString = config.config.panels[panel].unit ? config.config.panels[panel].unit : "N/A";
    }
    chart.update({
        preservation: true
    });

    //label.innerHTML = config.config.panels[panel].label;
}

// Allow different modules to call plotData method.
module.exports = {
    plotData : function(time, source, data) {
        /**
         * Takes panel, which is the index of the panel in json; source, which is the index of the data source in json;
         * event, which includes the timestamp and value of the datapoint.
         */

        // hack for creating mass flow rate
        // Update most recently read values which are relevant 
        let updateMassFlowRate = false;
        if (source === OX_TANK_PT_SOURCE) {
            psiMostRecentOxTankPressure = data;
            updateMassFlowRate = true;
        }
        else if (source === OX_TC_SOURCE) {
            celsiusMostRecentOxTemp = data;
            updateMassFlowRate = true;
        }
        else if (source === FEEDLINE_PT_SOURCE) {
            psiMostRecentFeedlinePressure = data;
            updateMassFlowRate = true;
        }

        if (updateMassFlowRate && psiMostRecentFeedlinePressure != null && psiMostRecentOxTankPressure != null && celsiusMostRecentOxTemp != null) {
            // calculate mass flow rate from most recent data and plot it on the panel

            // smallest diameter in meters
            const M_D2 = 0.00475;
            // diameter at feed PT in meters
            const M_D1 = 0.0109;

            // convert psi to Pa
            let paFeedPressure = 6895 * psiMostRecentFeedlinePressure;
            let paOxTankPressure = 6895 * psiMostRecentOxTankPressure;

            // Density of the oxidizer in kg/m^3
            let kgPM3Rho = 950.16 - 9.185 * celsiusMostRecentOxTemp;

            // TODO use experimentally derived discharge coefficient
            let dischargeCoefficient = 0.25;

            let kgPSecMassFlowRate = dischargeCoefficient 
                * (Math.PI / 4 * M_D2 * M_D2) 
                * Math.sqrt(2 * (paOxTankPressure - paFeedPressure) / (kgPM3Rho * (1.0 - Math.pow(M_D2 / M_D1, 4))));
            
            let lbPSecMassFlowRate = 2.205 * kgPSecMassFlowRate;

            for (let chart of charts) {
                for (let dataset of chart) {
                    if (dataset.datasource === MASS_FLOW_SOURCE) {
                        dataset.data.push({
                            x: Date.now(),
                            y: lbPSecMassFlowRate,
                        });
                        chart.update({
                            preservation: true
                        });
                    }
                }
            }
        }


        for (var i = 0; i < 4; i++) {
            for(var j = 0; j < charts[i].data.datasets.length; j++) {
                var chart_source = charts[i].data.datasets[j].datasource

                if(chart_source == source) {
                    charts[i].data.datasets[j].data.push({
                        x: time,
                        y: data
                    });
                    charts[i].update({
                        preservation: true
                    });
                }
            }
        }

        
    },
    updateSensorValue : function(source, data) {
        var sensor = document.getElementById("sensor-"+source);
    
        if (sensor != null) {
            sensor.innerHTML = data;
        }
    }
}

// Watch the 'panelSelect' objects in HTML and look for any change.
document.getElementById('panelSelect1').addEventListener('change', function() {
    reformatChart(0, this.value)
});
document.getElementById('panelSelect2').addEventListener('change', function() {
    reformatChart(1, this.value)
});
document.getElementById('panelSelect3').addEventListener('change', function() {
    reformatChart(2, this.value)
});
document.getElementById('panelSelect4').addEventListener('change', function() {
    reformatChart(3, this.value)
});

// Watch for chart reformat request.
ipcRenderer.on('reformatChart' , function(event , data){
    reformatChart(data.chartid, data.panel);
});