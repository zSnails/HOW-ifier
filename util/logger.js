class Logger {
    constructor() {
        this.logs = function (prefix, message) { console.log(`[${new Date().toLocaleDateString()}]:[${prefix}]: ${message}`) }
    }
    info(message) {
        this.logs("INFO", message)
    }
    warn(message) {
        this.logs("WARNING", message)
    }
    error(message) {
        this.logs("ERROR", message)
    }
}

module.exports = Logger