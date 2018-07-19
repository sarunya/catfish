var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080

app.use(express.static(path.join(__dirname, 'web')))

var port = process.env.PORT || 1337;
app.listen(port);