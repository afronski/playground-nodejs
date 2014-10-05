/*jshint es5: true*/
var Dispatcher = require("./lib/Dispatcher.js").Dispatcher,

    cmdLineArguments = require("optimist")
                            .usage('Usage: $0\n' +
                                   '\t-n [WORKER AMOUNT]' +
                                   '\t-i [INTERVAL DURATION]' +
                                   '\t-e [ENVIRONMENT]')
                            .default("n", 20)
                            .default("i", 2000)
                            .alias("e", "env")
                            .argv,

    mainDispatcher = new Dispatcher(cmdLineArguments.n, cmdLineArguments.i);

if (cmdLineArguments.env) {
  process.env.NODE_ENV = cmdLineArguments.env;
}

mainDispatcher.eventLoop();