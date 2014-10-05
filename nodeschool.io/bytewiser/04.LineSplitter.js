"use strict";

var fs = require("fs"),
    os = require("os"),

    NewLineCharCode = os.EOL.charCodeAt(0),

    path = process.argv[2],
    content = fs.readFileSync(path),

    offset = 0,
    i;

for(i = 0; i < content.length; ++i) {
  if (content[i] === NewLineCharCode) {
    console.log(content.slice(offset, i));
    offset = ++i;
  }
}

console.log(content.slice(offset, i));