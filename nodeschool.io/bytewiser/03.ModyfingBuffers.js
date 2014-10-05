"use strict";

var DotCharCode = ".".charCodeAt(0);

process.stdin.on("data", function(buffer) {
  var i = 0;

  for(i = 0; i < buffer.length; ++i) {
    if (buffer[i] === DotCharCode) {
      buffer.write("!", i);
    }
  }

  console.log(buffer);
});