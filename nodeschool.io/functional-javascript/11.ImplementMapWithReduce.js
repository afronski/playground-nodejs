"use strict";

module.exports = function(array, fn) {
  return array.reduce(function(accumulator, actual, index, original) {
    return accumulator.concat(fn.call(null, actual, index, original));
  }, []);
};