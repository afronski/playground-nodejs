"use strict";

require("colors");

var readline = require("readline");

var rewards = require("./data/rewards.json").rewards;
var tasks = require("./data/tasks.json");

function askAboutPreviousAssignment(reward, continuation) {
    var io = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    io.question("[??] Did you finished previous assignment? [y/n]".yellow, function (answer) {
        answer = answer.toLowerCase().charAt(0);

        if (answer === "y") {
            console.log("[ii] Yay, you did it! Awesome, now it's your reward: <[ %s ]>.".green, reward);
        } else if (answer === "n") {
            console.log("[ii] It's allright, but there is no reward.".red);
        } else {
            console.log("[ii] I do not understand.".blue);
        }

        continuation(io);
    });
}

function askAboutTime(io, continuation) {
    io.question("[??] How much time do you have? [b/m/s/n]".yellow, function (answer) {
        answer = answer.toLowerCase().charAt(0);

        if ([ "b", "m", "s" ].indexOf(answer) !== -1) {
            console.log("[ii] Okay, it is time for: <[ %s ]>.".green, continuation(answer));
        } else if (answer === "n") {
            console.log("[ii] It's allright, but there is no assignment.".red);
        } else {
            console.log("[ii] I do not understand.".blue);
        }

        io.close();
    });
}

function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseRandomReward() {
    return rewards[getRandomRange(0, rewards.length - 1)];
}

function chooseRandomAssignment(time) {
    switch(time) {
        case "b":
            return tasks.big[getRandomRange(0, tasks.big.length - 1)];

        case "m":
            return tasks.medium[getRandomRange(0, tasks.medium.length - 1)];

        default:
            return tasks.small[getRandomRange(0, tasks.small.length - 1)];
    }
}

exports.start = function () {
    askAboutPreviousAssignment(chooseRandomReward(), function(io) {
        askAboutTime(io, chooseRandomAssignment);
    });
};