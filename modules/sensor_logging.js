const logger = require("./runtime_logging");
const mkdirp = require('mkdirp');
const fs = require('fs');
const EventEmitter = require('events');


function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "_" +  date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

    return str;
}

module.exports = {
    directory: "",
    streams: {},
    enabled: false,
    emitter: new EventEmitter(),
    init: function() {

        // Clear old processes.
        module.exports.end();

        module.exports.directory = getFormattedDate();
        mkdirp('logs/sensor/'+this.directory, function (err) {
            if (err) {
                logger.log.error("Sensor logger failed to create the directory: "+err);
                return;
            }
            
            logger.log.info("Sensor output is logged in a new directory: logs/"+module.exports.directory+"/");

            for (const i of Object.keys(global.config.config.sources_inv)) {
                module.exports.streams[global.config.config.sources_inv[i]] = fs.createWriteStream("logs/sensor/"+module.exports.directory+"/"+global.config.config.sources_inv[i]+".log", {flags:'a'});
            }

            module.exports.enabled = true;
            module.exports.emitter.emit("status", module.exports.enabled);
        });

    },
    end: function() {
        if (!module.exports.enabled) {
            return;
        }

        for (const i of Object.keys(module.exports.streams)) {
            module.exports.streams[i].end();
        }

        module.exports.streams = {};
        module.exports.directory = "";

        logger.log.info("Sensor output session is terminated. All file streams are closed.");

        module.exports.enabled = false;
        module.exports.emitter.emit("status", module.exports.enabled);
    },
    toggle: function() {
        if(module.exports.enabled) {
            module.exports.end();
        } else {
            module.exports.init();
        }
    },
    log: function(sensor, timestamp, value) {
        if (sensor in module.exports.streams) {
            module.exports.streams[sensor].write(""+timestamp+" "+value+"\n");
        }
    }
}