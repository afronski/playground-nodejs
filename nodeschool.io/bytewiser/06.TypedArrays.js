"use strict";

process.stdin.on("data", function(buffer) {
  var typedArray = new Uint8Array(buffer.length),
      i;

  for(i = 0; i < buffer.length; ++i) {
    typedArray[i] = buffer.readUInt8(i);
  }

  console.log(JSON.stringify(typedArray));
});