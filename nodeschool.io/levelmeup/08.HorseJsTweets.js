"use strict";

module.exports = function (db, date, callback) {
  var tweets = [],
      endDate = date + "\xFF";

  function gatherTweet(data) {
    tweets.push(data.value);
  }

  function handleError(error) {
    if (error) {
      callback(error);
      callback = null;
    }
  }

  function publishResult() {
    if (callback) {
      callback(null, tweets);
      callback = null;
    }
  }

  db.createReadStream({ start: date, end: endDate })
      .on("data", gatherTweet)
      .on("error", handleError)
      .on("end", publishResult);
};
