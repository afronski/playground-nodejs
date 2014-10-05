
/*jshint es5: true*/

require("colors");

var fs = require("fs"),
    htmlparser = require("htmlparser"),
    natural = require("natural"),
    glob = require("glob"),
    argv = require("optimist")
            .usage("Usage: $0 -C className [-L 5 [--threshold 0.9] [-q] [--omitNumbers] [-D] [--significantDigits 4]")
            .boolean([ "q", "D", "omitNumbers" ])
            .demand("C")
            .default("threshold", null)
            .default("D", false)
            .default("omitNumbers", false)
            .default("q", false)
            .default("L", 2)
            .default("significantDigits", 6)
            .describe("q", "quiet output")
            .describe("D", "calculate TF-IDF per document")
            .describe("threshold", "normalized TF-IDF threshold filtering value (max: 1.0)")
            .describe("L", "minimal word length")
            .describe("omitNumbers", "TF-IDF should omit all words with numbers")
            .describe("significantDigits", "number of significant digits in TF-IDF")
            .describe("C", "class name")
            .argv,

    defaultLength = argv.L || 2;
    util = require("util"),

    TfIdf = natural.TfIdf,
    tfidf = new TfIdf(),

    dieIfError = function(err) {
      if (err) {
        if (!argv.q) {
          console.error(err.red);
        }

        process.exit(-1);
      }
    },

    log = function(value) {
      if (!argv.q) {
        console.log(value);
      }
    },

    EOL = "\n",
    mimeLastPosition = 6,

    handler = new htmlparser.DefaultHandler(dieIfError),
    parser = new htmlparser.Parser(handler),

    isText = function(element) {
      return element.type === "text";
    },

    isValid = function(element) {
      return !!element.raw;
    },

    extractMimeHeaders = function(data) {
      return data.split(EOL).slice(mimeLastPosition).join(EOL);
    },

    extractedText = [],
    extractText = function(array) {
      array.forEach(function(element, index) {
        if (isText(element) && isValid(element)) {
          extractedText.push(element.raw.trim());
        }

        if (element.hasOwnProperty("children")) {
          extractText(element.children);
        }
      });
    },

    isTermValid = function(term) {
      if (term.length <= defaultLength) {
        return false;
      }

      if (argv.omitNumbers && term.search(/[0-9]+/gi) !== -1) {
        return false;
      }

      return true;
    }

    calculateAndPrintTFIDF = function() {
      var terms,
          maxTfIdf = -1000.0;

      tfidf.addDocument(extractedText.join(" "));
      terms = tfidf.listTerms(0);

      terms
        .map(function(element) { if (isTermValid(element.term)) { return element.tfidf; } })
        .filter(function(value) { maxTfIdf = value > maxTfIdf ? value : maxTfIdf; });

      terms.forEach(function(element) {
        var normalizedTfIdf = parseFloat(element.tfidf / maxTfIdf);

        if (isTermValid(element.term)) {
          var result = util.format("%s %d", element.term, normalizedTfIdf.toFixed(argv.significantDigits));

          if (!argv.q) {
            result = result.green;
          }

          if (!!argv.threshold) {
            if (normalizedTfIdf > argv.threshold) {
              console.log(result);
            }
          } else {
            console.log(result);
          }
        }
      });
    };

glob(util.format("../datasets/webkb/%s**/*", argv.D ? "" : util.format("%s/", argv.C)), function (err, files) {
  dieIfError(err);

  files.forEach(function(file) {
    var stats = fs.statSync(file),
        data;

    if (stats.isFile()) {
      log("\tProcessing... ".yellow + file);

      data = fs.readFileSync(file, "UTF-8");

      parser.parseComplete(extractMimeHeaders(data));
      extractText(handler.dom);

      if (argv.D) {
        if (argv.q) {
          console.log(util.format("\t@@@ %s", file));
        }

        calculateAndPrintTFIDF();
        tfidf = new TfIdf();
        extractedText = [];
      }
    }
  });

  if (!argv.D) {
    calculateAndPrintTFIDF();
  }
});

log("Extractor is running...".rainbow);