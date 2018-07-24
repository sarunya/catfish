const express = require('express')
const app = express();
var path = require('path');
const TinyUrlRouteHandler = require('./lib/route-handler/tiny-url-route-handler');

function start() {
  let dependencies = {};
  let tinyUrlRouteHandler = new TinyUrlRouteHandler(dependencies)
  app.use(express.json())
  app.get('/get-tiny-url', (req, res) => {return tinyUrlRouteHandler.getTinyUrl(req, res)})
  app.use(express.static(path.join(__dirname , 'web')));
var port = process.env.PORT || 1337;
app.listen(port);
}
start();