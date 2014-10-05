"use strict";

var express = require("express"),

    application = express();

application.get("/home", function(request, response) {
    response.end("Hello World!");
});

application.listen(process.argv[2]);