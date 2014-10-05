"use strict";

var http = require("http"),
    fs = require("fs"),

    filename = process.argv[2],

    server;

server = http.createServer(function(request, response) {
  fs.createReadStream(filename).pipe(response);
});

server.listen(8000);