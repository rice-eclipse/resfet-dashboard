
// Module for network hook calls.
const { ipcRenderer } = require('electron');
const interface = require("electron").remote.require("./modules/interface");

// Initializing all the variables.
let chartElems = [];
let panelSelects = [];
let panelLabels = [];

for (let i = 0; i < 4; i++) {
    chartElems.push(document.getElementById("chart" + i).getContext("2d"));
    panelSelects.push(document.getElementById("panelSelect" + i));
    panelLabels.push(document.getElementById("panelLabel" + i));
}

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
                        beginAtZero: true
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

/**
 * Reformat a chart with a new sensor group.
 * @param {int} chartid the ID of the chart to be reformatted
 * @param {int} groupId the ID of the group to pull from 
 * 
 */
function reformatChart(chartid, groupId) {
    var chart = charts[chartid];

    chart.data.datasets = []

    console.log(groupId);
    for (sensor of interface.config.sensor_groups[groupId].sensors) {
        chart.data.datasets.push({
            label: sensor.label,
            data: [],
            lineTension: 0,
            fill: false,
            backgroundColor: sensor.color,
            borderColor: sensor.color,
            source_label: sensor.label,
        })

        chart.options.scales.yAxes[0].scaleLabel.labelString = sensor.units;
    }
    chart.update({
        preservation: true
    });
}

for (let i = 0; i < 4; i++) {
    // when things change on the panel selectors, reformat their associated charts
    panelSelects[i].addEventListener('change', () => {
        reformatChart(i, this.value)
    });
}
// Watch for chart reformat request.
ipcRenderer.on('reformatChart', function (event, data) {
    reformatChart(data.chartid, data.panel);
});