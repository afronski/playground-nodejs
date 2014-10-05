var colors = require("colors");

function ConsoleLogger() {
    this._enabled = process.env.NODE_ENV === "development";

    if (this._enabled) {
        this.write = console.log;
    } else {
        this.write = function() {};
    }
}

ConsoleLogger.prototype.log = function(value) {
    this.write(value.blue);
};

ConsoleLogger.prototype.err = function(value) {
    this.write(value.red);
};

ConsoleLogger.prototype.warn = function(value) {
    this.write(value.yellow);
};

exports.ConsoleLogger = ConsoleLogger;