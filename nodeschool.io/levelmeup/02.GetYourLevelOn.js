"use strict";

var level = require("level"),

    pathToDatabase = process.argv[2],

    db = level(pathToDatabase);

db.get("levelmeup", function(error, value) {
  if (error) {
    throw error;
  }

  console.log(value);
});