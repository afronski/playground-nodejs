"use strict";

var bytes = [ 0, 15, 24, 3, 250, 83 ],
    buffer = new Buffer(bytes, "utf-8");

console.log(buffer.toString("hex"));