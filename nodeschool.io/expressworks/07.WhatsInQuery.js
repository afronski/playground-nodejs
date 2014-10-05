"use strict";

var express = require("express"),

    application = express();

application.get("/search", function(request, response) {
    var result = Object.keys(request.query).reduce(function(result, key) {
        result[key] = request.query[key];

        return result;
    }, {});

    response.send(result);
});

application.listen(process.argv[2]);