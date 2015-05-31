"use strict";

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

function main(request, reply) {
    return reply("Hello " + request.params.name);
}

server.route({ path: "/{name}", method: "GET", handler: main });
server.start();
