// Modules for config management.
let config = require("./../modules/config")

config.fetchConfigs().then((pathContent) => {
    var selectElement = document.getElementById("configSelect");
    for (var i = 0; i < pathContent.length; i++) {
        var option = document.createElement("option");
        option.value = pathContent[i];
        option.text = pathContent[i];
        selectElement.appendChild(option);
    }
  }, (err) => {
    console.log(err);
});
