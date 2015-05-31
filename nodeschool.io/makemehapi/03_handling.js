"use strict";

var path = require("path");

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

server.route({
    path: "/",
    method: "GET",
    handler: {
        file: path.join(__dirname, "index.html")
    }
});

server.start();
