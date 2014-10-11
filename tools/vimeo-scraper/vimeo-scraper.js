"use strict";

var LIMIT = 5;

var util = require("util");
var webDriver = require("selenium-webdriver");

var links = [
  // Paste here your links to videos which should be downloaded.
];

function waitUntilPageIsFullyLoaded(driver) {
  return driver.findElement(webDriver.By.tagName("video")).then(
    function () {
      return true;
    },
    function () {
      return false;
    }
  );
}

function slug(value) {
  return value.toLowerCase()
              .trim()
              .replace(/#/g, "sharp")
              .replace(/:|'|"|&|’|`|\?/g, "")
              .replace(/\s{2,}/g, " ")
              .replace(/\s/g, "-");
}

function loadPart(offset, next) {
  var clone = links.slice();

  var flows = clone.splice(offset, LIMIT).map(function (link) {
    return webDriver.promise.createFlow(function() {
      var driver = new webDriver
                .Builder()
                  .withCapabilities(webDriver.Capabilities.chrome())
                  .build();

      driver.get(link).then(function () {
        driver.wait(waitUntilPageIsFullyLoaded.bind(null, driver), 1000).then(function () {
          driver.findElement(webDriver.By.css("h1[itemprop='name']")).getText().then(function (title) {
            var fileName = util.format("%s.mp4", slug(title));

            driver.findElement(webDriver.By.tagName("video")).then(
              function (video) {
                video.getAttribute("src").then(
                  function (source) {
                    console.log(fileName, source);
                    driver.quit();
                  },
                  function () {
                    console.log("Tag 'video' does not have 'src' attribute for '%s'.", link);
                    driver.quit();
                  }
                );
              }
            );
          });
        });
      });
    });
  });

  webDriver.promise.fullyResolved(flows).then(next);
}

function continuation (offset) {
  return function () {
    loadPart(offset, function () {
      if (offset + LIMIT < links.length) {
        loadPart(offset + LIMIT, continuation(offset + LIMIT + 1));
      } else {
        process.exit(0);
      }
    });
  };
}

continuation(0)();