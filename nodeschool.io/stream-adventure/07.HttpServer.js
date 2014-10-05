"use strict";

var http = require("http"),
    through = require("through"),

    server,

    transformer = through(function(buffer) {
      this.queue(buffer.toString().toUpperCase());
    });

server = http.createServer(function(request, response) {
  if (request.method === "POST") {
    request.pipe(transformer).pipe(response);
  } else {
    response.end("Send a POST.");
  }
});

server.listen(8000);