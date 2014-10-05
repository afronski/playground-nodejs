"use strict";

function countWords(inputWords) {
  return inputWords.reduce(function(object, actual) {
    object[actual] = ++object[actual] || 1;
    return object;
  }, {});
}

module.exports = countWords;