var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var serveStatic = require('serve-static');  // serve static files


// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
app.use(serveStatic('static', {'index': ['index.html']}));

// Start Express http server on port 8080
var webServer = http.createServer(app).listen(8080);

//listen on port 8080
webServer.listen(8080, function () {
    console.log('listening on http://localhost:8080');
});
