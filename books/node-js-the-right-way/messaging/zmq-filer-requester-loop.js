"use strict";

const zmq = require("zmq");
const filename = process.argv[2];

const requester = zmq.socket("req");

requester.on("message", function (data) {
  let response = JSON.parse(data);
  console.info("Received response: '%j'.", response);
});

requester.connect("tcp://localhost:5433");

for (let i = 1; i <= 3; ++i) {
  console.info("Sending request %d for '%s'.", i, filename);

  requester.send(JSON.stringify({
    path: filename
  }));
}