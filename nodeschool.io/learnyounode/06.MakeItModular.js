"use strict";

var filtering = require("./filtering"),
    directory = process.argv[2],
    extension = process.argv[3];

filtering(directory, extension, function(err, files) {
  if (err) {
    console.log("An error occurred.");
  } else {
    files.forEach(function(file) { console.log(file); });
  }
});