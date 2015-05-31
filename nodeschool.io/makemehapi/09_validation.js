"use strict";

var Joi = require("joi");
var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

function main(request, reply) {
    return reply("You have asked for chicken " + request.params.breed);
}

server.route({
    method: "GET",
    path: "/chickens/{breed}",
    handler: main,
    config: {
        validate: {
            params: {
                breed: Joi.string().required()
            }
        }
    }
});
server.start();
