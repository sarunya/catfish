var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/web/index.html'));
});

app.use(express.static('web'));

app.listen(8086);