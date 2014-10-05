"use strict";

var fs = require("fs"),
    directory = process.argv[2],
    extension = process.argv[3];

fs.readdir(directory, function(err, files) {
  var re = new RegExp("\\." + extension + "$");

  if (err) {
    throw err;
  }

  files.filter(function(file) { return re.test(file); })
       .forEach(function(file) { console.log(file); });
});