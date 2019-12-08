const path = require('path');
const fs = require('fs');
const logger = require("./runtime_logging");

module.exports = {
    configPath: "",
    config: {},
    lambda: {},
    fetchConfigs: async function() {
        /**
         * Returns a list of valid configuration files located in ./configs/
         */
        const directoryPath = path.join(__dirname, 'configs');

        let promise = new Promise((res, rej) => {
            fs.readdir(directoryPath, function (err, files) {    
                // Handling error
                if (err) {
                    rej(logger.log.error('Unable to scan directory '+directoryPath));
                }
    
                res(files);
            });
        });

        let result = await promise;

        return result;
    },
    applyConfig: function(configPath) {
        /**
         * Reads the configPath and sets the configuration parameters.
         */
        module.exports.configPath = configPath;
        module.exports.config = require("./configs/"+configPath)[0];

        module.exports.config.sources_inv = {};
        module.exports.config.commands_inv = {};

        for (const i of Object.keys(module.exports.config.sources)) {
            module.exports.config.sources_inv[module.exports.config.sources[i]] = i;
        }

        for (const i of Object.keys(module.exports.config.commands)) {
            module.exports.config.commands_inv[module.exports.config.commands[i]] = i;
        }

        for (const i of Object.keys(module.exports.config.panels)){
            for (const j of Object.keys(module.exports.config.panels[i].data)) {
                try {
                    let lambda = new Function("x", "return "+module.exports.config.panels[i].data[j].calibration);
                    module.exports.lambda[module.exports.config.panels[i].data[j].source] = lambda;
                } catch(e) {
                    let lambda = new Function("x", "return x");
                    module.exports.lambda[module.exports.config.panels[i].data[j].source] = lambda;
                    logger.log.error("Error while importing the lambda configuration "+module.exports.config.panels[i].data[j].calibration+". Reading is default to x.");
                }
            }
        }

        logger.log.info("Configuration file "+module.exports.configPath+" is applied.");
    }
}
