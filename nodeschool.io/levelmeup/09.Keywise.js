"use strict";

var level = require("level"),

    pathToDatabase = process.argv[2],
    json = require(process.argv[3]),

    db = level(pathToDatabase, { valueEncoding: "json" });

function mapper(entry) {
  var key;

  if (entry.type === "user") {
    key = entry.name;
  }

  if (entry.type === "repo") {
    key = entry.user + "!" + entry.name;
  }

  return { type: "put", key: key, value: entry };
}

db.batch(json.map(mapper));