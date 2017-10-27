var https    = require("https");              // http server core module
var express = require("express");           // web framework external module
var serveStatic = require('serve-static');  // serve static files


// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
app.use(serveStatic('static', {'index': ['index.html']}));

// Start Express http server on port 443
var webServer = https.createServer({}, app).listen(process.env.PORT);

//listen on port 443
webServer.listen(process.env.PORT, function () {
    console.log('listening on http://localhost:443');
});
