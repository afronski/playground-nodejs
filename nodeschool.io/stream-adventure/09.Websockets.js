"use strict";

var sockets = require("websocket-stream"),
    stream = sockets("ws://localhost:8000");

stream.end("hello\n");