"use strict";

module.exports = function (db, date, callback) {
  var counter = 0;

  function countTweet() {
    ++counter;
  }

  function handleError(error) {
    if (error) {
      callback(error);
      callback = null;
    }
  }

  function publishResult() {
    if (callback) {
      callback(null, counter);
      callback = null;
    }
  }

  db.createReadStream({ start: date })
      .on("data", countTweet)
      .on("error", handleError)
      .on("end", publishResult);
};