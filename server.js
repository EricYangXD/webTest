var express = require("express");
var app = express();

app.use(express.static("src"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/");
});

var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log(`Server is running at http://localhost:${port}/index.html`);
});