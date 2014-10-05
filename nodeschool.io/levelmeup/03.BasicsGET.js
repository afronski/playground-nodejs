"use strict";

var util = require("util"),

    level = require("level"),

    pathToDatabase = process.argv[2],
    db = level(pathToDatabase),

    key,
    i;

function printer(key, error, value) {
  if (!error) {
    console.log("%s=%s", key, value);
  } else {
    if (!error.notFound) {
      throw error;
    }
  }
}

for (i = 0; i < 100; ++i) {
  key = util.format("gibberish%d", i);
  db.get(key, printer.bind(null, key));
}