"use strict";

var buffers = [];

process.stdin.on("data", function(chunk) {
  buffers.push(chunk);
});

process.stdin.on("end", function() {
  console.log(Buffer.concat(buffers));
});