"use strict";

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({
    host: "localhost",
    port: Number(process.argv[2] || 8080)
});

function upload(request, reply) {
    var body = "";

    request.payload.file.on("data", function (chunk) {
        body += chunk;
    });

    request.payload.file.on("end", function () {
        var response = {
            description: request.payload.description,
            file: {
                data: body,
                filename: request.payload.file.hapi.filename,
                headers: request.payload.file.hapi.headers
            }
        };

        reply(JSON.stringify(response));
    });
}

server.route({
    method: "POST",
    path: "/upload",
    handler: upload,
    config: {
        payload: {
            output: "stream",
            parse: true,
            allow: "multipart/form-data"
        }
    }
});

server.start();
