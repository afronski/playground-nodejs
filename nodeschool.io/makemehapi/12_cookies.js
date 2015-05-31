"use strict";

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

function setCookie(request, reply) {
    return reply("success").state("session", { key: "makemehapi" });
}

function checkCookie(request, reply) {
    var cookie = request.state.session;

    if (cookie && cookie.key === "makemehapi") {
        return reply({ user: "hapi" });
    } else {
        return reply(new Hapi.error.unauthorized("Missing authentication."));
    }
}

server.route({
    method: "GET",
    path: "/set-cookie",
    handler: setCookie,
    config: {
        state: {
            parse: true,
            failAction: "log"
        }
    }
});

server.route({
    method: "GET",
    path: "/check-cookie",
    handler: checkCookie
});

server.state("session", {
    ttl: 10,
    domain: "localhost",
    path: "/{path*}",
    encoding: "base64json"
});

server.start();
