"use strict";

var level = require("level"),

    pathToDatabase = process.argv[2],
    db = level(pathToDatabase);

function handleError(error) {
  if (error) {
    throw error;
  }
}

function printEntry(data) {
  console.log("%s=%s", data.key, data.value);
}

db.createReadStream()
    .on("data", printEntry)
    .on("error", handleError);