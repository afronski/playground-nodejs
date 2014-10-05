"use strict";

function reduce(array, fn, accumulator) {
  function reduceInner(array, fn, accumulator, index) {
    if (index < array.length) {
      accumulator = fn(accumulator, array[index], index, array);
      return reduceInner(array, fn, accumulator, index + 1);
    } else {
      return accumulator;
    }
  }

  return reduceInner(array, fn, accumulator, 0);
}

module.exports = reduce;