const express = require('express')
const app = express();
var session = require('express-session');
var cors = require('cors')
var path = require('path');
var guid = require('uuid');
const TinyUrlRouteHandler = require('./lib/route-handler/tiny-url-route-handler');
const ComparisonRouteHandler = require('./lib/route-handler/comparison-route-handler');
const VisitorMapHandler = require('./lib/route-handler/visitor-map-handler');

function start() {
  let dependencies = {};
  let tinyUrlRouteHandler = new TinyUrlRouteHandler(dependencies)
  let visitorMapHandler = new VisitorMapHandler(dependencies)
  let comparisonRouteHandler = new ComparisonRouteHandler(dependencies)
  app.use(express.json())
  app.use(session({secret: 'ssshhhhh'}));
  app.use(cors())
  app.options('*', cors()) 
  app.set('views', __dirname + '/web');
  app.engine('html', require('ejs').renderFile);
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, application/json, *")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  app.get('/codeshare.html$', (req, res) => {
    sess=req.session;
    if(sess.visitor_id) {
          res.header({"visitor_id": sess.visitor_id});
          res.render('codeshare.html');
      }
      else {
          req.session.visitor_id = guid.v4();
          res.header({"visitor_id": req.session.visitor_id});
          res.render('codeshare.html');
      }
  })

  app.post('/visitor-map', (req, res) => {
    return visitorMapHandler.updateVisitorMap(req, res)
  })
  app.post('/get-code-map', (req, res) => {
    return visitorMapHandler.getCodeHash(req, res)
  })
  app.get('/get-tiny-url', (req, res) => {
    return tinyUrlRouteHandler.getTinyUrl(req, res)
  })
  app.post('/array-companison', (req, res) => {
    return comparisonRouteHandler.arrayComparison(req, res)
  })
  app.use(express.static(path.join(__dirname, 'web')));
  var port = process.env.PORT || 1337;
  console.log(port);
  app.listen(port);
}
start();