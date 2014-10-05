"use strict";

function repeat(operation, number) {
  if (number <= 0) {
    return;
  }

  return function() {
    operation();
    return repeat(operation, --number);
  };
}

function trampoline(fn) {
  while(fn && typeof(fn) === "function") {
    fn = fn();
  }
}

module.exports = function(operation, number) {
  trampoline(function() {
    return repeat(operation, number);
  });
};