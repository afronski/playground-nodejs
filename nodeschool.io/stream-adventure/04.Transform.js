"use strict";

var through = require("through"),

    transformer = through(function(buffer) {
      this.queue(buffer.toString().toUpperCase());
    });

process.stdin.pipe(transformer).pipe(process.stdout);