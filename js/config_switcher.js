// Modules for config management.
let config = require("electron").remote.require("./modules/config")

config.fetchConfigs().then((pathContent) => {
  /**
   * Fills the config selector with the available options from configs/ directory.
   */
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

function updateConfigUI() {
  /**
   * Updates the UI elements with values from the config.
   */
  document.getElementById('currentConfig').innerHTML = config.configPath;
  document.getElementById('tcpAddress').innerHTML = config.config.network.tcp.ip+":"+config.config.network.tcp.port;
  document.getElementById('udpAddress').innerHTML = "0.0.0.0:"+config.config.network.udp.port;
}

// Watch the 'configSelect' object in HTML and look for any change.
document.getElementById('configSelect').addEventListener('change', function(){
  config.applyConfig(this.value)
  updateConfigUI()
});

// Update the UI with the initial config on boot.
updateConfigUI()