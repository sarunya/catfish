const express = require('express')
const app = express();
var cors = require('cors')
var path = require('path');
const TinyUrlRouteHandler = require('./lib/route-handler/tiny-url-route-handler');
const ComparisonRouteHandler = require('./lib/route-handler/comparison-route-handler');

function start() {
  let dependencies = {};
  let tinyUrlRouteHandler = new TinyUrlRouteHandler(dependencies)
  let comparisonRouteHandler = new ComparisonRouteHandler(dependencies)
  app.use(express.json())
  app.use(cors())
  app.options('*', cors()) 
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, application/json, *")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  app.get('/get-tiny-url', (req, res) => {
    return tinyUrlRouteHandler.getTinyUrl(req, res)
  })
  app.post('/array-companison', (req, res) => {
    return comparisonRouteHandler.arrayComparison(req, res)
  })
  app.use(express.static(path.join(__dirname, 'web')));
  var port = process.env.PORT || 1337;
  app.listen(port);
}
start();