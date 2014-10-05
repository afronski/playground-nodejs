"use strict";

var slice = Array.prototype.slice;

function logger(namespace) {
  return function() {
    var array = slice.call(arguments);

    array.unshift(namespace);
    console.log.apply(console, array);
  };
}

module.exports = logger;