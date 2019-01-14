// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

const btnIgnition = document.getElementById('btnIgnition')

btnIgnition.addEventListener('click', function (event) {
  alert("Ignition!")
})
