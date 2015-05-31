"use strict";

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

function main(request, reply) {
    return reply("Hello Hapi");
}

server.route({ path: "/", method: "GET", handler: main });
server.start();
