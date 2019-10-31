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
                // Handling error
                if (err) {
                    rej(console.log('[ERROR] Unable to scan directory: ' + err));
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

        // TODO: Divide commands into 'sources' and 'commands' so that this would be unnecessary.
        module.exports.config.commands_inv = {};

        for (const i of Object.keys(module.exports.config.commands)) {
            module.exports.config.commands_inv[module.exports.config.commands[i]] = i;
        }

        // TODO: Instead of refreshing what we have, we should essentially pull whenever we get a reading.s
        for (const i of Object.keys(module.exports.config.panels)){
            for (const j of Object.keys(module.exports.config.panels[i].data)) {
                global.recentdata[module.exports.config.panels[i].data[j].source] = 0;

                try {
                    let lambda = new Function("x", "return "+module.exports.config.panels[i].data[j].calibration);
                    global.recentdata_lambda[module.exports.config.panels[i].data[j].source] = lambda;
                } catch(e) {
                    let lambda = new Function("x", "return 0");
                    global.recentdata_lambda[module.exports.config.panels[i].data[j].source] = lambda;
                    console.log("[CONF]: Error while importing the lambda configuration "+module.exports.config.panels[i].data[j].calibration+". Reading is default to 0.");
                }
            }
        }
        console.log("[CONF]: Configuration file "+module.exports.configPath+" is applied.");
    }
}
