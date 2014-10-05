"use strict";

var http = require("http"),
    url = process.argv[2],
    page = "";

function append(buffer) {
  page += buffer;
}

function end() {
  console.log(page.length);
  console.log(page);
}

http.get(url, function(response) {
  response.setEncoding("utf-8");

  response.on("data", append);
  response.on("end", end);

  response.on("error", console.error);
});