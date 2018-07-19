var express = require('express');
var app = express();
var path = require('path');


app.use(express.static(path.join(__dirname , 'web')));

var port = process.env.PORT || 1337;
app.listen(port);