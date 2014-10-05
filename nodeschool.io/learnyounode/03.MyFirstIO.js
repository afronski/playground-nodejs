"use strict";

var fs = require("fs"),
    os = require("os"),
    file = fs.readFileSync(process.argv[2]).toString(),
    lines = file.split(os.EOL);

console.log(lines.length - 1);