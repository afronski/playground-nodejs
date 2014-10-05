"use strict";

var os = require("os"),
    fs = require("fs"),

    level = require("level"),

    pathToDatabase = process.argv[2],
    pathToFile = process.argv[3],

    db = level(pathToDatabase),

    values,
    batchOperations;

function createOperation(values) {
  return {
    type: values[0],
    key: values[1],
    value: values[2]
  };
}

fs.readFile(pathToFile, "utf-8", function(error, lines) {
  if (error) {
    throw error;
  }

  batchOperations = [];

  lines.split(os.EOL).forEach(function(line) {
    values = line.split(",");
    batchOperations.push(createOperation(values));
  });

  db.batch(batchOperations, function(error) {
    if (error) {
      throw error;
    }
  });
});