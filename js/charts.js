var chart1Elem = document.getElementById("chart1").getContext('2d');
var chart2Elem = document.getElementById("chart2").getContext('2d');
var chart3Elem = document.getElementById("chart3").getContext('2d');
var chart4Elem = document.getElementById("chart4").getContext('2d');

var config = {
    type: 'line',
    data: {
    datasets: [{
        label: '',
        data: [],
        lineTension: 0,
        fill: false
    }]
    },
    options: {
    scales: {
        xAxes: [{
        type: 'realtime'
        }],
        yAxes: [{
            ticks: {
                beginAtZero:true
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
}

var chart1 = new Chart(chart1Elem, config);
var chart2 = new Chart(chart2Elem, config);
var chart3 = new Chart(chart3Elem, config);
var chart4 = new Chart(chart4Elem, config);

function onReceive(chart,event) {
    chart.data.datasets[0].data.push({
        x: event.timestamp,
        y: event.value
    });
    chart.update({
        preservation: true
    });
}

onReceive(chart1, {timestamp: Date.now(), value: 1000})