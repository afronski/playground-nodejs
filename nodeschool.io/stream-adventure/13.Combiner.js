"use strict";

var os = require("os"),
    combine = require("stream-combiner"),
    through = require("through"),
    split = require("split"),
    zlib = require("zlib");

module.exports = function () {
    var grouper,
        current;

    function write (line) {
        var row;

        if (line.length === 0) {
            return;
        }

        row = JSON.parse(line);

        if (row.type === "genre") {
            if (current) {
                this.queue(JSON.stringify(current) + os.EOL);
            }

            current = {
                name: row.name,
                books: []
            };
        } else if (row.type === "book") {
            current.books.push(row.name);
        }
    }

    function end () {
        if (current) {
            this.queue(JSON.stringify(current) + os.EOL);
        }

        this.queue(null);
    }

    grouper = through(write, end);

    return combine(split(), grouper, zlib.createGzip());
};