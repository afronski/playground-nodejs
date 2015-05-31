"use strict";

var Joi = require("joi");
var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

function main(request, reply) {
    return reply("login successful");
}

server.route({
    method: "POST",
    path: "/login",
    handler: main,
    config: {
        validate: {
            payload: Joi.object({
                isGuest: Joi.boolean().required(),
                username: Joi.string().when("isGuest", { is: false, then: Joi.required() }),
                password: Joi.string().alphanum(),
                accessToken: Joi.string().alphanum()
            })
            .options({ allowUnknown: true})
            .without("password", "accessToken")
        }
    }
});

server.start();
