"use strict";

var fs = require("fs"),
    fileName = process.argv[2];

fs.createReadStream(fileName).pipe(process.stdout);