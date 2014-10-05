"use strict";

var http = require("http"),
    url = require("url"),
    server;

function sendResponse(response, object) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(object));
}

function parseTime(isoDate) {
  var date = new Date(isoDate);

  return {
    "hour": date.getHours(),
    "minute": date.getMinutes(),
    "second": date.getSeconds()
  };
}

function unixTime(isoDate) {
  var date = new Date(isoDate);

  return {
    "unixtime": date.getTime()
  };
}

function route(url) {
  switch(url.pathname) {
    case "/api/parsetime":
      return parseTime(url.query.iso);

    case "/api/unixtime":
      return unixTime(url.query.iso);

    default:
      return null;
  }
}

server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    sendResponse(response, route(url.parse(request.url, true)));
  } else {
    response.end();
  }
});

server.listen(8000);