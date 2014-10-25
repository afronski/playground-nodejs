var nodeStatic = require("node-static");
var file = new nodeStatic.Server("./public", { cache: 3600 });

require("http").createServer(function (request, response) {
    request.addListener("end", function () {
        setTimeout(function () {
            file.serve(request, response);
        }, 200);
    }).resume();
}).listen(8080);