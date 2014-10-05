var util = require('util');
var immortal = require('immortal');

function Monitor() {
  immortal.MonitorAbstract.apply(this, arguments);
}

util.inherits(Monitor, immortal.MonitorAbstract);
exports.Monitor = Monitor;