"use strict";

function spy(target, method) {
  var original = target[method],
      result = {
        count: 0
      };

  function wrapper() {
    ++result.count;
    return original.apply(target, arguments);
  }

  target[method] = wrapper;

  return result;
}

module.exports = spy;