"use strict";

var http = require("http"),

    urls = process.argv.slice(2),

    count = urls.length,
    pages = urls.map(function() { return ""; });

function append(count, buffer) {
  pages[count] += buffer;
}

function end() {
  --count;

  if (count <= 0) {
    pages.forEach(function(page) { console.log(page); });
  }
}

urls.forEach(function(url, index) {
  var appliedAppend = append.bind(null, index);

  http.get(url, function(response) {
    response.setEncoding("utf-8");

    response.on("data", appliedAppend);
    response.on("end", end);

    response.on("error", console.error);
  });
});