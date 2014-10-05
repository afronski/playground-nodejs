var utils = require("util"),
    events = require("events");

function WorkerInstanceConstructor(callback) {
    this._callback = callback;
}

utils.inherits(WorkerInstanceConstructor, events.EventEmitter);

WorkerInstanceConstructor.prototype.spawn = function() {
    this.emit("task-started");
    this.process();
};

WorkerInstanceConstructor.prototype.handleNextLink = function(nextLink) {
    this.emit("next-link", nextLink);
};

WorkerInstanceConstructor.prototype.process = function() {
    var err = null;

    try {
        var lastTransactionId = this._callback();
        this.emit("task-finished", lastTransactionId);
    } catch(exception) {
        err = exception;
    }

    this.emit("die", err);
};

exports.WorkerInstance = WorkerInstanceConstructor;