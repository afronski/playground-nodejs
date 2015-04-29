"use strict";

var ISSUE = 8;
var OWNER = "nodeschool";
var REPO = "international-day";

var TIMEOUT = 4000;

var settings = require("./package.json");

var util = require("util");
var http = require("http");
var https = require("https");

var concat = require("concat-stream");

var geocoderProvider = "google";
var httpAdapter = "https";

var extra = {
    apiKey: process.env["GEOCODER_KEY"] || "",
    formatter: null
};

var geocoder = require("node-geocoder")(geocoderProvider, httpAdapter, extra);

var options = {
    hostname: "api.github.com",
    port: 443,
    path: util.format("/repos/%s/%s/issues/%d/comments?per_page=100", OWNER, REPO, ISSUE),
    method: "GET",
    headers: {
        "User-Agent": util.format("comments-gh-scraper@%s", settings.version)
    }
};

function capitalize(name) {
    if (name === "buenosaires") {
        name = "buenos aires";
    }

    if (name === "costarica") {
        name = "costa rica";
    }

    if (name === "sanfrancisco") {
        name = "san francisco";
    }

    name = name.replace(/\-/gi, " ");
    name = name.split(" ");

    name = name.map(function (word) {
        return word.slice(0, 1).toUpperCase() + word.slice(1);
    });

    return name.join(" ");
}

function extractName(body) {
    var result = null;

    if (body.match(/this|works|please|what|does|means?/gi)) {
        return "UNKNOWN";
    }

    result = /(?:github\.com\/nodeschool\/)([^\s\/\(\)]+)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1];
    }

    result = /(?:nodeschool.io\/)([^\s\/\(\)]+)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1];
    }

    result = /(?:chapter\:\s*)([^\s\/\(\)]+)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1];
    }

    result = /(?:chapter.name\:\s*)([^\s\/\(\)]+)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1];
    }

    result = /campjs/gi.exec(body);
    if (result && result.length > 0) {
        return "Melbourne";
    }

    result = /(saint [a-z]+)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1];
    }

    result = /^([a-z\- ]+),/gi.exec(body);
    if (result && result.length > 0) {
        return result[1].trim();
    }

    result = /,([a-z\- ]+),/gi.exec(body);
    if (result && result.length > 0) {
        return result[1].trim();
    }

    result = /^([a-z]+)(?:\n|\r)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1].trim();
    }

    result = /^([a-z]+)\s*(?:[^\s])/gi.exec(body);
    if (result && result.length > 0) {
        return result[1].trim();
    }

    result = /^\* ([a-z ]+)/gi.exec(body);
    if (result && result.length > 0) {
        return result[1].trim();
    }

    return "UNKNOWN";
}

function usafy(name) {
    name = name.replace(/ Mass$/, ", MA");
    name = name.replace(/ Me$/, ", ME");
    name = name.replace(/ Boulder$/, " and Boulder, CO");

    return name;
}

function handleSpecialURL(name) {
    if (name === "santiago") {
        return "http://www.noders.cl";
    }

    if (name === "wrocław") {
        return "https://github.com/nodeschool/wroclaw";
    }

    if (name === "mexico") {
        return "http://nodeschool.io/mexicocity";
    }

    if (name === "bainbridge island") {
        return "https://github.com/nodeschool/bainbridge";
    }

    if (name === "saint petersburg") {
        return "http://nodeschool.io/spb";
    }

    if (name === "oxford") {
        return "http://jsoxford.com";
    }

    return util.format("http://nodeschool.io/%s", name);
}

function geocode(name, callback) {
    if (name === "silesia") {
        name = "katowice";
    }

    if (name === "yosuke") {
        name = "tokyo, japan";
    }

    geocoder.geocode(name, function (err, res) {
        if (err || res.length === 0) {
            console.log(err, res);

            callback({ lat: 0, lng: 0});
            return;
        }

        callback({ lat: res[0].latitude, lng: res[0].longitude });
    });
}

function testURL(url, name, callback) {
    var module = http;

    if (url.indexOf("https") !== -1) {
        module = https;
    }

    function failed() {
        var url = util.format("https://github.com/nodeschool/%s", name);

        var req = https.get(url, function (res) {
            if (res.statusCode < 400) {
                callback({
                    success: false,
                    url: url
                });
            } else {
                callback({
                    success: false,
                    url: ""
                });
            }
        }).on("error", function (error) {
            callback({
                success: false,
                url: ""
            });
        });

        req.on("socket", function (socket) {
            socket.setTimeout(TIMEOUT);
            socket.on("timeout", function() {
                req.abort();
            });
        });
    }

    var request = module.get(url, function (response) {
        if (response.statusCode < 400) {
            callback({ success: true });
        } else {
            failed();
        }
    }).on("error", function (error) {
        failed();
    });

    request.on("socket", function (socket) {
        socket.setTimeout(TIMEOUT);
        socket.on("timeout", function() {
            request.abort();
        });
    });
}

function createChapter(comment, callback) {
    var object;
    var name = extractName(comment.body);

    if (name === "UNKNOWN") {
        callback(null);
    } else {
        object = {
            name: util.format("NodeSchool %s", usafy(capitalize(name))),
            url: handleSpecialURL(name.toLowerCase())
        };

        geocode(name.toLowerCase(), function (geo) {
            object.lat = geo.lat;
            object.lng = geo.lng;

            testURL(handleSpecialURL(name.toLowerCase()), name.toLowerCase(), function (result) {
                if (!result.success) {
                    object.url = result.url;
                }

                callback(object);
            });
        });
    }
}

function parseComments(comments) {
    console.log("name,lat,lon,chapter-url");

    var chapters = comments.length - 1;
    var i = 0;

    var timer = setInterval(function () {
        (function (i) {
            createChapter(comments[i], function (object) {

                if (object) {
                    process.stdout.write(util.format("\"%s\",\"%d\",\"%d\",\"%s\"\n", object.name, object.lat, object.lng, object.url));
                }

                if (i >= chapters) {
                    clearInterval(timer);
                    setTimeout(function () { process.exit(0); }, 1000);
                }
            });
        } (i));

        ++i;
    }, 5000);
}

https.get(options, function (response) {
    if (response.statusCode >= 300) {
        console.error("[EE] Unexpected status code: %d", response.statusCode);
        return;
    }

    response.pipe(concat(function (content) {
        try {
            parseComments(JSON.parse(content));
        } catch (error) {
            console.error("[EE] JSON syntax error: %s", error);
        }
    }));
}).on("error", function (error) {
    console.error("[EE] %s", error);
});
