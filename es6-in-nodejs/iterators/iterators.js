/*global Symbol*/
/*jshint esnext:true*/

"use strict";

function Words(string) {
  this._string = string;
}

function* tokenizer() {
  var regexp = /\S+/g;
  var string = this._string;
  var match;

  while (match = regexp.exec(string)) {
    yield match[0];
  }
}

Words.prototype[Symbol.iterator] = tokenizer;

var tokenized = new Words("Hello World");

for (let word of tokenizer.call(tokenized)) {
    console.log(word);
}

// In future it will be possible to do:
//
//   for (let word of tokenized) {
//     console.log(word);
//   }
//
// Or:
//   [ ... new Words("Hello World") ]