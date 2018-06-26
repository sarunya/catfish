
const KeyValueService = require('../service/key-value-service')
class KeyValueRouteHandler {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  save(request, reply) {
    let me = this;
    let service = new KeyValueService(me.dependencies, me.config, request);
    service.save(request.body).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

  getInfo(request, reply) {
    let me = this;
    let service = new KeyValueService(me.dependencies, me.config, request);
    service.filter(request.body).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

}
module.exports = KeyValueRouteHandler;