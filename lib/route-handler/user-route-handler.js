const UserService = require('../service/user-service')

class UserRouteHandler {
  constructor(dependencies) {
    this.dependencies = dependencies;
    this.userService = new UserService(this.dependencies);
  }

  registerUser(request, reply) {
    let me = this;
    me.userService.registerUser(request.body).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

  getUserInfo(request, reply) {
    let me = this;
    me.userService.getUserInfo(request.query.email).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

}
module.exports = UserRouteHandler;