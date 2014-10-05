"use strict";

var net = require("net"),

    multilevel = require("multilevel"),

    db = multilevel.client(),
    connection = net.connect(4545);

connection.pipe(db.createRpcStream()).pipe(connection);

db.get("multilevelmeup", function(error, value) {
  if (error) {
    connection.end();
    throw error;
  }

  console.log(value);
  connection.end();
});