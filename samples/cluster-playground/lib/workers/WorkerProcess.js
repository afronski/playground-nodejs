var WorkerInstance = require("./WorkerInstance.js").WorkerInstance;

(function(global) {

    var process,
        worker;

    process = function() {
        // TODO
        var sum = 0,
            i;

        for(i = 0; i < 1000000000; ++i) {
            sum += i * i - i;
        }

        return -1;
    };

    worker = new WorkerInstance(process);

    worker.on("task-started", function() {
        global.process.send({ cmd : "worker-started" });
    });

    worker.on("task-finished", function(lastTransactionId) {
        global.process.send({ cmd : "worker-finished", lastTransactionId : lastTransactionId });
    });

    worker.on("next-link", function(nextLink) {
        global.process.send({ cmd : "worker-found-next-link", link : nextLink });
    });

    worker.on("die", function(err) {
        if (err) {
            global.process.send({ cmd : "worker-died-with-exception", err : err });
        } else {
            global.process.send({ cmd : "worker-died" });
        }
    });

    worker.spawn();
    global.process.exit(0);

} (global));