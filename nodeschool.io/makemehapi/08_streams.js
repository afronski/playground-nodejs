"use strict";

var fs = require("fs");
var path = require("path");

var rot13 = require("rot13-transform");

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

var stream = fs.createReadStream(path.join(__dirname, "assets/for-encryption.txt"));

function streaming(request, reply) {
    return reply(stream.pipe(rot13()));
}

server.route({ path: "/", method: "GET", handler: streaming });
server.start();
