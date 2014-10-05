"use strict";

var trumpet = require("trumpet"),
    through = require("through"),

    htmlStream = trumpet(),
    elements,

    transformer = through(function(buffer) {
      this.queue(buffer.toString().toUpperCase());
    });

elements = htmlStream.select(".loud").createStream();
elements.pipe(transformer).pipe(elements);

process.stdin.pipe(htmlStream).pipe(process.stdout);