"use strict";

var path = require("path"),

    express = require("express"),
    stylus = require("stylus"),

    application = express(),

    DefaultPath = path.join(__dirname, "public"),

    stylusMiddleware = stylus.middleware(DefaultPath);

application.use(stylusMiddleware);
application.use(express.static(process.argv[3]));

application.listen(process.argv[2]);