"use strict";

var path = require("path"),

    express = require("express"),

    application = express();

application.set("views", path.join(__dirname, "templates"));
application.set("view engine", "jade");

application.get("/home", function(request, response) {
    response.render(process.argv[3], { date: (new Date()).toDateString() });
});

application.listen(process.argv[2]);