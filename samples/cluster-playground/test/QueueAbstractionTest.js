var QueueAbstraction = require("../lib/queues/QueueAbstraction.js").QueueAbstraction;

exports.QueueAbstractionTests = {
  setUp: function(done) {
    done();
  },

  "Creating QueueAbstraction": function(test) {
    test.expect(1);

    var queue = new QueueAbstraction();

    test.equal("object", typeof(queue), "create queue won't fail");

    test.done();
  },

  "Adding to queue": function(test) {
    test.expect(1);

    var queue = new QueueAbstraction();
    queue.add(1, "Test 1");
    queue.add(2, "Test 2");
    queue.add(3, "Test 3");

    test.equal(3, queue._queue.length, "adding to queue");

    test.done();
  },

  "Removing from queue by worker id": function(test) {
    test.expect(4);

    var queue = new QueueAbstraction();
    queue.add(1, "Test 1");
    queue.add(2, "Test 2");
    queue.add(3, "Test 3");

    test.equal(3,        queue._queue.length,   "queue length before remove");

    var object = queue.remove(2);

    test.equal(2,        queue._queue.length,   "queue length after remove");

    test.equal(2,        object.id,             "object returned from remove method");
    test.equal("Test 2", object.link,           "object returned from remove method");

    test.done();
  },

  "Removing from queue by link": function(test) {
    test.expect(4);

    var queue = new QueueAbstraction();
    queue.add(1, "Test 1");
    queue.add(2, "Test 2");
    queue.add(3, "Test 3");

    test.equal(3,        queue._queue.length,   "queue length before remove");

    var object = queue.removeByLink("Test 2");

    test.equal(2,        queue._queue.length,   "queue length after remove");

    test.equal(2,        object.id,             "object returned from remove method");
    test.equal("Test 2", object.link,           "object returned from remove method");

    test.done();
  },

  "Peek first element in queue": function(test) {
    test.expect(4);

    var queue = new QueueAbstraction();
    queue.add(1, "Test 1");
    queue.add(2, "Test 2");
    queue.add(3, "Test 3");

    test.equal(3, queue._queue.length, "queue length assertion before pop");

    var object = queue.peek();

    test.equal(3, queue._queue.length, "queue length assertion after pop");

    test.equal(1,        object.id,             "object returned from remove method");
    test.equal("Test 1", object.link,           "object returned from remove method");

    test.done();
  },

  "Get first element in queue": function(test) {
    test.expect(4);

    var queue = new QueueAbstraction();
    queue.add(1, "Test 1");
    queue.add(2, "Test 2");
    queue.add(3, "Test 3");

    test.equal(3, queue._queue.length, "queue length assertion before pop");

    var object = queue.pop();

    test.equal(2, queue._queue.length, "queue length assertion after pop");

    test.equal(1,        object.id,             "object returned from remove method");
    test.equal("Test 1", object.link,           "object returned from remove method");

    test.done();
  }

};
