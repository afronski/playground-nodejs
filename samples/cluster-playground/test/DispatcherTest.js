var QueueAbstraction = require("../lib/queues/QueueAbstraction.js").QueueAbstraction,
    Dispatcher = require("../lib/Dispatcher.js").Dispatcher;

exports.DispatcherTests = {
  setUp: function(done) {
    done();
  },

  "Creating Dispatcher": function(test) {
    test.expect(3);

    var dispatcher = new Dispatcher(10);

    test.equal(10, dispatcher._workerMaxAmount, "workers amount should be valid");

    test.equal(true, dispatcher._pending instanceof QueueAbstraction, "dispatcher should have pending queue");
    test.equal(true, dispatcher._processed instanceof QueueAbstraction, "dispatcher should have processed queue");

    test.done();
  }

};
