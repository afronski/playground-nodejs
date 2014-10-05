"use strict";

function curryN(fn, n) {
  n = typeof(n) === "number" ? n : fn.length;

  function curried(previous) {
    return function(argument) {
      var args = previous.concat(argument);

      if (args.length < n) {
        return curried(args);
      } else {
        return fn.apply(this, args);
      }
    };
  }

  return curried([]);
}

module.exports = curryN;