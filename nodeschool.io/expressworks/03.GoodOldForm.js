"use strict";

var express = require("express"),

    application = express();

application.use(express.urlencoded());

application.post("/form", function(request, response) {
    response.end(request.body.str.split("").reverse().join(""));
});

application.listen(process.argv[2]);