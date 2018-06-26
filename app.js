const express = require('express')
const app = express()
const db = require('./lib/data-access/pgp').db,
  KeyValueRouteHandler = require('./lib/route-handler/key-value-route-handler');

function start() {
  let dependencies = {};
  dependencies.pgpPriceEngine = db("postgres://postgres:postgres@localhost/ecompricingengine", 10, 1);
  let keyValueRouteHandler = new KeyValueRouteHandler(dependencies)
  app.use(express.json())
  app.post('/info', (req, res) => {return keyValueRouteHandler.save(req, res)})
  app.post('/get-info', (req, res) => {return keyValueRouteHandler.getInfo(req, res)})
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}
start();