// Modules for config management.
let config = require("electron").remote.require("./modules/config")

// Module for network hook calls.
const { ipcRenderer } = require('electron');

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

charts.push(new Chart(chartElems[0], {
    type: 'line',
    data: {
    datasets: []
    },
    options: {
        legend: {
            display: true
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
                    labelString: 'N/A'
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

charts.push(new Chart(chartElems[1], {
    type: 'line',
    data: {
    datasets: []
    },
    options: {
        legend: {
            display: true
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
                    labelString: 'N/A'
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

charts.push(new Chart(chartElems[2], {
    type: 'line',
    data: {
    datasets: []
    },
    options: {
        legend: {
            display: true
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
                    labelString: 'N/A'
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

charts.push(new Chart(chartElems[3], {
    type: 'line',
    data: {
    datasets: []
    },
    options: {
        legend: {
            display: true
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
                    labelString: 'N/A'
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

function plotData(panel, source, event) {
    /**
     * Takes panel, which is the index of the panel in json; source, which is the index of the data source in json;
     * event, which includes the timestamp and value of the datapoint.
     */
    for (var i = 0; i < 4; i++) {
        if(panelSelects[i].value == panel) {
            var chart = charts[i]

            chart.data.datasets[source].data.push({
                x: event.timestamp,
                y: event.value
            });
            chart.update({
                preservation: true
            });
        }
    }
}

function reformatChart(chartid, panel) {
    /**
     * Takes chartid, which is the id [0, 1, 2, 3] of the chart displayed on the dashboard; panel, which is the index of the panel in json.
     */
    var chart = charts[chartid]
    var label = panelLabels[chartid]

    chart.data.datasets = []

    for (var i = 0; i < config.config.panels[panel].data.length; i++) {
        chart.data.datasets.push({
            label: config.config.panels[panel].data[i].label,
            data: [],
            lineTension: 0,
            fill: false,
            backgroundColor: config.config.panels[panel].data[i].color,
            borderColor: config.config.panels[panel].data[i].color
        });
    }
    chart.update({
        preservation: true
    });

    label.innerHTML = config.config.panels[panel].label
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

// Listening for hooks and calls from other files.
ipcRenderer.on('plotData' , function(event , data){
    plotData(data.panel, data.source, {timestamp: Date.now(), value: 0});
});

ipcRenderer.on('reformatChart' , function(event , data){
    reformatChart(data.chartid, data.panel);
});