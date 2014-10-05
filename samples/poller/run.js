var colorize = require("colorize");
var Monitor = require("forever-monitor").Monitor;

var child = new Monitor("wrapper.js", {
    silent: false,
    pidFile: "output.pid",
    minUptime: 10000,
    spinSleepTime: 5000,       // minUptime > spinSleepTime
    options: [ "foo", "bar" ]  // Dodatkowe opcje przekazane do skryptu.
});

child.start();
console.log(colorize.ansify("#bold[#blue[wrapper.js - started first time]]"));