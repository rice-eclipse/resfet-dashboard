const path = require('path');
const fs = require('fs');

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
                var configs = [];
    
                // Handling error
                if (err) {
                    rej(console.log('[ERROR] Unable to scan directory: ' + err));
                }
    
                // Listing all files using forEach
                files.forEach(function (file) {
                    configs.push(file);
                });

                res(configs);
            });
        });

        let result = await promise;

        return result;
    },
    applyConfig: function(configPath) {
        /**
         * Reads the configPath and sets the configuration parameters.
         */
        module.exports.configPath = configPath
        module.exports.config = require("./configs/"+configPath)[0];

        for (const i of Object.keys(module.exports.config.panels)){
            for (const j of Object.keys(module.exports.config.panels[i].data)) {
                global.recentdata[module.exports.config.panels[i].data[j].source] = 0
            }
        }
        console.log("[CONF]: Configuration file "+module.exports.configPath+" is applied.");
    }
}
