const path = require('path');
const fs = require('fs');

module.exports = {
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

        let result = await promise

        return result
    }
}
