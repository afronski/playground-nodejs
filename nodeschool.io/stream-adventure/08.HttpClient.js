"use strict";

var request = require("request"),
    post = request.post("http://localhost:8000");

process.stdin.pipe(post).pipe(process.stdout);