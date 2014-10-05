"use strict";

var crypto = require("crypto"),

    express = require("express"),

    application = express();

application.put("/message/:id", function(request, response) {
    var id = request.params.id,
        hasher = crypto.createHash("sha1");

    hasher.update((new Date()).toDateString().toString() + id);
    response.end(hasher.digest("hex"));
});

application.listen(process.argv[2]);