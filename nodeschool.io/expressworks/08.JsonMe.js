"use strict";

var fs = require("fs"),

    express = require("express"),

    application = express();

application.get("/books", function (request, response) {
    fs.readFile(process.argv[3], function(error, content) {
        if (error) {
            throw error;
        }

        response.json(JSON.parse(content));
    });
});

application.listen(process.argv[2]);