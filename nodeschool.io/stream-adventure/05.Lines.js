"use strict";

var through = require("through"),
    split = require("split"),

    lineCount = 0,

    transformer = through(function(buffer) {
      var line = buffer.toString();

      this.queue(lineCount % 2 === 0 ? line.toLowerCase() + "\n" : line.toUpperCase() + "\n");
      ++lineCount;
    });

process.stdin.pipe(split()).pipe(transformer).pipe(process.stdout);