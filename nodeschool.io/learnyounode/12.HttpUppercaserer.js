"use strict";

var Transform = require("stream").Transform,

    http = require("http"),
    util = require("util"),

    server;

function TransformToUppercase(options) {
  Transform.call(this, options);
}

util.inherits(TransformToUppercase, Transform);

TransformToUppercase.prototype._transform = function(chunk, encoding, done) {
  this.push(chunk.toString().toUpperCase());

  done();
};

server = http.createServer(function(request, response) {
  if (request.method === "POST") {
    request.pipe(new TransformToUppercase()).pipe(response);
  } else {
    request.pipe(response);
  }
});

server.listen(8000);