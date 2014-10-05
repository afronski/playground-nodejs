"use strict";

function duckCount() {
  return Array.prototype.slice.call(arguments).filter(function(possibleDuck) {
    return Object.prototype.hasOwnProperty.call(possibleDuck, "quack");
  }).length;
}

module.exports = duckCount;