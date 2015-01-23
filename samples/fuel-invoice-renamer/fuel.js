"use strict";

var fs = require("fs");
var domain = require("domain");
var path = require("path");
var util = require("util");
var child_process = require("child_process");

var glob = require("glob");
var moment = require("moment");

var handler = domain.create();

handler.on("error", function (err) {
    console.error(
        "[Error] Details: '%s', Error: '%s'.",
        err.toString(),
        err.stack
    );

    process.exit(1);
});

var PREFIX = "F-VAT Paliwo - Shell (TODAY) %s.jpg";
var COMMAND = "/usr/bin/convert";
var QUALITY = 75;

var directory = process.argv[2] || "./";
var pattern = path.join(directory, "*.jpg");

PREFIX = PREFIX.replace("TODAY", moment().format("DD.MM.YYYY"));

glob(pattern, handler.intercept(function (files) {
    files.forEach(function (file, index) {
        if (file.indexOf("F-VAT Paliwo") !== -1) {
            console.info("[Info] Skipping '%s'.", file);
            return;
        }

        var filePath = path.join(directory, util.format(PREFIX, index + 1));

        fs.rename(
            path.join(directory, file),
            filePath,
            handler.intercept(function () {
                child_process.spawn(
                    COMMAND, [ filePath, "-quality", QUALITY, filePath ]
                );
            }));
    });
}));
