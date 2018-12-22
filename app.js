"use strict"

const express = require('express'),
app = express(),
session = require('express-session'),
cors = require('cors'),
nconf = require('nconf'),
path = require('path'),
guid = require('uuid'),
db = require('./lib/data-access/pgp').db,
TinyUrlRouteHandler = require('./lib/route-handler/tiny-url-route-handler'),
VisitorMapHandler = require('./lib/route-handler/visitor-map-handler'),
UserRouteHandler = require('./lib/route-handler/user-route-handler');

function start() {
  let cwd = process.cwd();
  let dependencies = {};

  nconf.env().argv();
  if (nconf.get('config')) {
    console.log(path.join(cwd, nconf.get('config')));
    dependencies.config = require(path.join(cwd, nconf.get('config')));
  } else {
    console.log("Config not found");
    process.exit();
  }
  dependencies.pgpCatFish = db(dependencies.config.postgres.connection_string_orders, dependencies.config.postgres.poolSize);


  let tinyUrlRouteHandler = new TinyUrlRouteHandler(dependencies);
  let visitorMapHandler = new VisitorMapHandler(dependencies);
  let userRouteHandler = new UserRouteHandler(dependencies);
  
  app.use(express.json())
  
  //For Cross Origin (CORS)
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
    var sess=req.session;
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

  //user functions
  app.put('/register-user', (req, res) => {
    return userRouteHandler.addNewUser(req, res);
  })

  app.get('/login-user', (req, res) => {
    return userRouteHandler.login(req, res);
  })

  app.put('/save-codeshare', (req, res) => {
    return userRouteHandler.addNewCodeShareRecord(req, res);
  })

  app.get('/saved-codeshare', (req, res) => {
    return userRouteHandler.getSavedCodeShare(req, res);
  })

  app.use(express.static(path.join(__dirname, 'web')));
  var port = process.env.PORT || 1337;
  console.log(port);
  app.listen(port);
}
start();