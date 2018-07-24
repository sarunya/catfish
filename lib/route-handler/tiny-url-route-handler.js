
const TinyUrlService = require('../service/tiny-url-service')
class TinyUrlRouteHandler {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  getTinyUrl(request, reply) {
    let me = this;
    let service = new TinyUrlService(me.dependencies, me.config, request);
    service.getTinyUrl(request.query).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

}
module.exports = TinyUrlRouteHandler;