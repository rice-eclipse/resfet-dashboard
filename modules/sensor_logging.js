const logger = require("./runtime_logging");
const interface = require("./interface");
const moment = require("moment");
const mkdirp = require('mkdirp');
const fs = require('fs');


function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

    return str;
}

let directory = "";
let groupStreams = [];

interface.emitter.on("config", (_cfg) => {
    groupStreams = [];

    directory = getFormattedDate();

    mkdirp('logs/sensor/' + directory, (err) => {
        if (err) {
            logger.log.error("Sensor logger failed to create the directory: " + err);
            return;
        }

        logger.log.info("Sensor output is logged in a new directory: logs/" + directory + "/");

        for (groupCfg of interface.config.sensor_groups) {
            let groupStream = [];
            for (idx in groupCfg.sensors) {
                let sensor = groupCfg.sensors[idx];
                let fname = "logs/sensor/" + directory + "/" + sensor.label + ".log"

                groupStream.push(fs.createWriteStream(fname, { flags: 'a' }))
                logger.log.info("Created log file " + fname);
            }
            groupStreams.push(groupStream);
        }
    });
});

interface.emitter.on("status", (connected) => {
    if (!connected) {
        groupStreams = [];
        directory = "";
    }
})

interface.emitter.on("sensorValue", (message) => {
    let groupCfg = interface.config.sensor_groups[message.group_id];
    let groupStream = groupStreams[message.group_id];
    for (datum of message.readings) {
        let sensorCfg = groupCfg.sensors[datum.sensor_id];
        let calibValue = sensorCfg.calibration_slope * datum.reading + sensorCfg.calibration_intercept;
        let read_time = moment("" + datum.time.secs_since_epoch + "." + datum.time.nanos_since_epoch / 1000000, "X")
        let stream = groupStream[datum.sensor_id];
        stream.write("" + read_time + " " + datum.reading + " " + calibValue + "\n");
    }
})