"use strict";

var level = require("level"),
    sublevel = require("level-sublevel"),

    pathToDatabase = process.argv[2],

    db = sublevel(level(pathToDatabase)),

    robots = db.sublevel("robots"),
    dinosaurs = db.sublevel("dinosaurs");

robots.put("slogan", "beep boop");
dinosaurs.put("slogan", "rawr");