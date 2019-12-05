const path = require('path');
const fs = require('fs');
const logger = require("./runtime_logging");

module.exports = {
    configPath: "",
    config: {},
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

        for (const i of Object.keys(module.exports.config.sources)) {
            module.exports.config.sources_inv[module.exports.config.sources[i]] = i;
        }

        for (const i of Object.keys(module.exports.config.maincontrols)) {
            // if(key in obj) ... TODO: FINISH THIS!!!
        }



        logger.log.info("Configuration file "+module.exports.configPath+" is applied.");
    }
}
