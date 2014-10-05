"use strict";

function repeat(operation, number) {
  if (number <= 0) {
    return;
  }

  operation();

  if (number % 5 === 0) {
    setTimeout(function() {
      repeat(operation, --number);
    }, 0);
  } else {
    repeat(operation, --number);
  }
}

module.exports = repeat;