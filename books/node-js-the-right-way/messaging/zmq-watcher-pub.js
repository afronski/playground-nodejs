"use strict"

const fs = require("fs");
const zmq = require("zmq");

const publisher = zmq.socket("pub");

const filename = process.argv[2]

fs.watch(filename, function () {
  publisher.send(JSON.stringify({
    type: "changed",
    file: filename,
    timestamp: Date.now()
  }));
});

publisher.bind("tcp://*:5432", function () {
  console.info("Listening for ZMQ subscribers...");
});