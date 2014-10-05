var colorize = require("colorize"),
	i,
	mockedResults,
	EventEmitter = require('events').EventEmitter,
	events = new EventEmitter();

exports.registerOnEnd = function(call) {
	events.once("endtask", call);
	console.log(colorize.ansify("#bold[#green[Event handler for 'end' event registered with success!]]"));
};

exports.init = function() {
	i = 0;
	mockedResults = [
		"Result 1",
		"Result 2",
		"Result 3",
		"Result 4",
		"Result 5"
	];

	console.log(colorize.ansify("#green[Hello from do-and-die.js]"));
};

var processTask = function() {
	_simulateAsync(function(result) {
		console.log(colorize.ansify("#yellow[Process " + result + "]"));
	});
};

var _simulateAsync = function(callback) {
	setTimeout(function() {
		callback(mockedResults[i]);
		++i;

		if (i >= mockedResults.length) {
			console.log(colorize.ansify("#red[Exit task...]"));
			events.emit("endtask");
		} else {
			processTask();
		}
	}, 300);
};

exports.processTask = processTask;