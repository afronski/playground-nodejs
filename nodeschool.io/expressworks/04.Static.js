"use strict";

var path = require("path"),

    express = require("express"),

    application = express(),

    DefaultPath = path.join(__dirname, "public");

application.use(express.static(process.argv[3]) || DefaultPath);

application.listen(process.argv[2]);