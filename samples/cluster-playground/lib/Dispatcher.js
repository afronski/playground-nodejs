var utils = require("util"),
    events = require("events"),
    cluster = require('cluster'),

    ConsoleLogger = require("./maintenance/ConsoleLogger.js").ConsoleLogger,
    QueueAbstraction = require("./queues/QueueAbstraction.js").QueueAbstraction,

    NO_WORKER_ASSIGNED = -1;

function findWorkerId(worker) {
    var key;

    for (key in cluster.workers) {
        if (cluster.workers[key] === worker) {
            return parseInt(key, 10);
        }
    }

    return null;
}

function messageHandler(id, pid, message) {
    var handler = this.handlers[message.cmd];

    if (message.cmd.indexOf("worker-died") !== -1) {
        --this._workersSpawnedAmount;
    }

    if (handler) {
        handler.call(this, id, pid, message);
    }
}

function spawnOneMore(link) {
    var worker,
        id = null;

    if (this._workersSpawnedAmount < this._workerMaxAmount) {
        ++this._workersSpawnedAmount;

        worker = cluster.fork({
            link: link
        });

        id = findWorkerId(worker);

        if (id) {
            worker.on('message', messageHandler.bind(this, id, worker.process.pid));
        }
    }

    return id;
}

function DispatcherConstructor(workersMaxAmount, intervalDuration) {
    var owner = this;

    this.logger = new ConsoleLogger();

    this._intervalDuration = intervalDuration;

    this._workerMaxAmount = workersMaxAmount;

    this._pending = new QueueAbstraction();
    this._processed = new QueueAbstraction();

    this._workersSpawnedAmount = 0;
    this._retries = 0;

    cluster.setupMaster({
        exec : "lib/workers/WorkerProcess.js"
    });

    this.handlers = {
        "worker-finished" : function(id, pid, message) {
            this._processed.remove(id);
            this.handleNextLinks();

            this.logger.log(utils.format("Worker %s [%s] finished with %s", id, pid, message));
        },

        "worker-died-with-exception" : function(id, pid, message) {
            var linkObject = this._processed.remove(id);

            this._pending.add(NO_WORKER_ASSIGNED, linkObject.link);
            this.handleNextLinks();

            this.logger.err(utils.format("Worker %s [%s] died with %s", id, pid, message));
        },

        "worker-found-next-link" : function(id, pid, message) {
            this._pending.add(NO_WORKER_ASSIGNED, message.link);
            this.handleNextLinks();

            this.logger.warn(utils.format("Worker %s [%s] found next link %s", id, pid, message.link));
        }
    };
}

DispatcherConstructor.prototype.handleNextLinks = function() {
    var linkObject = this._pending.pop(),
        workerId;

    if (linkObject) {
        workerId = spawnOneMore.call(this, linkObject.link);

        if (workerId) {
            this._pending.removeByLink(linkObject.link);
            this._processed.add(workerId, linkObject.link);

            this.logger.warn(utils.format("Worker spawned - new ID: %s", workerId));
        }
    } else {
        this.logger.warn("Pending queue empty - sleeping...");
    }
};

DispatcherConstructor.prototype.eventLoop = function() {
    this._pending.add(NO_WORKER_ASSIGNED, "Link1");
    this.handleNextLinks();

    setInterval(this.handleNextLinks.bind(this), this._intervalDuration);
};

exports.Dispatcher = DispatcherConstructor;