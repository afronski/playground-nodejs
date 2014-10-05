"use strict";

var fs = require("fs"),
    os = require("os");

fs.readFile(process.argv[2], function(err, data) {
  var lines;

  if (err) {
    throw err;
  }

  lines = data.toString().split(os.EOL);

  console.log(lines.length - 1);
});