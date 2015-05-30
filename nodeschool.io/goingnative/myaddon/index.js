"use strict";

var bindings = require("bindings");
var addon = bindings("myaddon");

console.log("%d", addon.length(process.argv[2]));
