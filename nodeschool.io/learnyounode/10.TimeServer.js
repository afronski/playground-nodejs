"use strict";

var net = require("net"),
    util = require("util"),
    server;

function zeroFill(value) {
  if (value < 10) {
    return "0" + value;
  }

  return value;
}

function getFormattedDate() {
  var date = new Date();

  return util.format("%d-%d-%d %d:%d\n",
                     date.getFullYear(), zeroFill(date.getMonth() + 1), zeroFill(date.getDate()),
                     zeroFill(date.getHours()), zeroFill(date.getMinutes()));
}

server = net.createServer(function(socket) {
  socket.end(getFormattedDate());
});

server.listen(8000);