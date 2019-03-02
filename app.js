const express = require('express')
const app = express();
var session = require('express-session');
var cors = require('cors')
var path = require('path');
var guid = require('uuid');
var nconf = require('nconf');
const db = require('./lib/data-access/pgp').db;
const TinyUrlRouteHandler = require('./lib/route-handler/tiny-url-route-handler');
const ComparisonRouteHandler = require('./lib/route-handler/comparison-route-handler');
const VisitorMapHandler = require('./lib/route-handler/visitor-map-handler');
const defaultConfig = require('./config/local-config.json');

function start() {
  let cwd = process.cwd();
  let dependencies = {};

  //nconf.env().argv();
  dependencies.config = defaultConfig;
  if (process.env.DATABASE_URL) {
    //console.log(path.join(cwd, nconf.get('config')));
    defaultConfig.postgres.connection_string_catfish = process.env.DATABASE_URL;
  }
  dependencies.pgpCatFish = db(dependencies.config.postgres.connection_string_catfish, dependencies.config.postgres.poolSize);

  let tinyUrlRouteHandler = new TinyUrlRouteHandler(dependencies)
  let visitorMapHandler = new VisitorMapHandler(dependencies)
  let comparisonRouteHandler = new ComparisonRouteHandler(dependencies)

  app.use(express.json())
  app.use(session({
    secret: 'ssshhhhh'
  }));
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
    sess = req.session;
    if (sess.visitor_id) {
      res.header({
        "visitor_id": sess.visitor_id
      });
      res.render('codeshare.html');
    } else {
      req.session.visitor_id = guid.v4();
      res.header({
        "visitor_id": req.session.visitor_id
      });
      res.render('codeshare.html');
    }
  })

  app.get('/json-comparison', (req, res) => {
    res.render('json-comparison.html');
  })

  app.get('/json-share-data', (req, res) => {
    return comparisonRouteHandler.getJsonShareData(req, res);
  })

  app.get('/array-share-data', (req, res) => {
    return comparisonRouteHandler.getArrayShareData(req, res);
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
  app.post('/json-share', (req, res) => {
    return comparisonRouteHandler.createJsonShare(req, res);
  })
  app.post('/array-share', (req, res) => {
    return comparisonRouteHandler.createArrayShare(req, res);
  })
  app.use(express.static(path.join(__dirname, 'web')));
  var port = process.env.PORT || 1337;
  app.listen(port);
}
start();