"use strict";

module.exports = function getShortMessages(messages) {
  return messages.filter(function(object) {
    return object.message.length < 50;
  }).map(function(object) {
    return object.message;
  });
};