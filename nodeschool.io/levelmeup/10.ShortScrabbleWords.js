"use strict";

var util = require("util"),

    KeyFormat = "%s~%s";

function init(db, words, callback) {
  function mapper(word) {
    var key = util.format(KeyFormat, word.length, word);

    return { type: "put", key: key, value: word };
  }

  db.batch(words.map(mapper), callback);
}

function query(db, word, callback) {
  var matchingWords = [],

      cleanedWord = word.replace(/\*/g, ""),

      prefix = util.format(KeyFormat, word.length, cleanedWord),
      prefixEnd = prefix + "\xFF";

  function collect(data) {
    matchingWords.push(data.value);
  }

  function handleError(error) {
    if (error) {
      callback(error);
      callback = null;
    }
  }

  function publishResult() {
    if (callback) {
      callback(null, matchingWords);
      callback = null;
    }
  }

  db.createReadStream({ start: prefix, end: prefixEnd })
      .on("data", collect)
      .on("error", handleError)
      .on("end", publishResult);
}

module.exports = {
  init: init,
  query: query
};