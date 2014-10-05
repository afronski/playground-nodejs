"use strict";

console.log(process.argv.slice(2).reduce(function(previous, actual) { return previous + parseInt(actual, 10); }, 0));