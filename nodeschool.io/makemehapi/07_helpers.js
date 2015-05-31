"use strict";

var path = require("path");

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

server.route({
    method: "GET",
    path: "/",
    handler: {
        view: "index_with_helper.html"
    }
});

server.views({
    engines: {
        html: require("handlebars")
    },

    path: path.join(__dirname, "templates"),
    helpersPath: "helpers"
});

server.start();
