"use strict";

var crypto = require("crypto"),

    passphrase = process.argv[2],
    stream = crypto.createDecipher("aes256", passphrase);

stream.pipe(process.stdout);
process.stdin.pipe(stream);