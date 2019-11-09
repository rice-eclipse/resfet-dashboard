let assert = require('assert');
let config = require("./../modules/config");

describe('Config Module', function() {
    describe('fetchConfig', function() {
        it('Should read luna_hotfire.json', function() {
            config.fetchConfigs().then((pathContent) => {
                assert(pathContent.includes("luna_hotfire.json"));
            });
        });
        it('Should read titan_hotfire.json', function() {
            config.fetchConfigs().then((pathContent) => {
                assert(pathContent.includes("titan_hotfire.json"));
            });
        });
        it('Should read titan_hotfire.json', function() {
            config.fetchConfigs().then((pathContent) => {
                assert(!pathContent.includes("random.json"));
            });
        });
    });



    // describe('applyConfig', function() {
    //     it('Should update config path', function() {
    //         config.applyConfig('luna_hotfire.json').then(() => {
    //             global.recentdata = {}
    //             global.recentdata_lambda = {}
    //             global.recentdata[module.exports.config.panels[i].data[j].source] = 0;
    //             global.recentdata_lambda[module.exports.config.panels[i].data[j].source] = lambda;
    //             assert.equals(config.configPath, 'luna_hotfire.json');
    //         });
    //     });
    // });
});