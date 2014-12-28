"use strict";

const zmq = require("zmq");
const subscriber = zmq.socket("sub");

// Subscribe on all messages.
subscriber.subscribe("");

subscriber.on("message", function (data) {
  let message = JSON.parse(data);
  let date = new Date(message.timestamp);

  console.info("File '%s' changed at %s.", message.file, date);
});

subscriber.connect("tcp://localhost:5432");