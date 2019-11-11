function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

    return str;
}

module.exports = {
    directory: "",
    init: function() {
        this.directory = getFormattedDate()
    }
}