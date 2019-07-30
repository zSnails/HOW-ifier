function Logger() {

}

Logger.prototype.logs = function(prefix, message) {
    console.log(`[${new Date().toLocaleDateString()}]:[${prefix}]: ${message}`);
}

Logger.info = function(message) {
    Logger.prototype.logs("INFO", message)
}


Logger.error = function(message) {
    Logger.prototype.logs("ERROR", message)
}


Logger.warn = function(message) {
    Logger.prototype.logs("WARNING", message)
}

module.exports = Logger