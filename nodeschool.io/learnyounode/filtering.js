"use strict";

var fs = require("fs");

module.exports = function(directory, extension, callback) {
  var re = new RegExp("\\." + extension + "$");

  fs.readdir(directory, function(err, files) {
    if (err) {
      return callback(err);
    }

    callback(null, files.filter(function(file) { return re.test(file); }));
  });
};