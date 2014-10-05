"use strict";

var duplex = require("duplexer"),
    through = require("through");

module.exports = function (counter) {
    var countries = {},
        input;

    function write(row) {
        countries[row.country] = (countries[row.country] || 0) + 1;
    }

    function end() {
        counter.setCounts(countries);
    }

    input = through(write, end);

    return duplex(input, counter);
};