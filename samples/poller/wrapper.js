var color = require("colorize");
var doer = require("./do-and-die.js");

console.log(color.ansify("#green[Hello from wrapper.js]"));

doer.init();

doer.registerOnEnd(function() {
	console.log(color.ansify("#bold[#red[wrapper.js exiting...]]"));
});

doer.processTask();
