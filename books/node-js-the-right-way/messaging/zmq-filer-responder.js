"use strict";

const fs = require("fs");
const zmq = require("zmq");

const responder = zmq.socket("rep");

responder.on("message", function (data) {
  let request = JSON.parse(data);

  console.info("Received request to get: '%s'.", request.path);

  fs.readFile(request.path, function (err, content) {
    console.info("Sending response content.");

    responder.send(JSON.stringify({
      content: content.toString(),
      timestamp: Date.now(),
      pid: process.pid
    }));
  });
});

responder.bind("tcp://127.0.0.1:5433", function () {
  console.info("Listening for ZMQ requesters...");
});

process.on("SIGINT", function () {
  console.info("Shutting down...");
  responder.close();
});