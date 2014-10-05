"use strict";

var level = require("level"),

    pathToDatabase = process.argv[2],
    json = JSON.parse(process.argv[3]),

    db = level(pathToDatabase);

Object.keys(json).forEach(function(key) {
  db.put(key, json[key], function(error) {
    if (error) {
      throw error;
    }
  });
});