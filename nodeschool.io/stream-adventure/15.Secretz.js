"use strict";

var crypto = require("crypto"),
    util = require("util"),
    zlib = require("zlib"),

    through = require("through"),
    tar = require("tar"),

    parser = tar.Parse(),

    cipher = process.argv[2],
    passphrase = process.argv[3],

    gunzipper = zlib.createGunzip(),
    decryptor = crypto.createDecipher(cipher, passphrase);

parser.on("entry", function(entry) {
  var hasher,
      merge;

  if (entry.type === "File") {
    hasher = crypto.createHash("md5", { encoding: "hex" });
    merge = through(null, function() {
      this.queue(util.format(" %s\n", entry.path));
    });

    entry.pipe(hasher).pipe(merge).pipe(process.stdout);
  }
});

process.stdin
         .pipe(decryptor)
         .pipe(gunzipper)
         .pipe(parser);