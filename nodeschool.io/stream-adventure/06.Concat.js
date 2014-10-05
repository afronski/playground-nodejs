"use strict";

var concat = require("concat-stream"),

    reverser = concat(function(buffer) {
      console.log(buffer.toString().split("").reverse().join(""));
    });

process.stdin.pipe(reverser);