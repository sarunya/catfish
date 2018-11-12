const TaskService = require('../service/task-service')

class TaskRouteHandler {
  constructor(dependencies) {
    const me = this;
    this.dependencies = dependencies;
    this.taskService = new TaskService(me.dependencies, me.config);
  }

  createTask(request, reply) {
    let me = this;
    me.taskService.createTask(request.body).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

  searchTask(request, reply) {
    let me = this;
    me.taskService.searchTask(request.body).then(function (result) {
      reply.send(result);
    }, function (error) {
      reply.send(error);
    });
  }

}
module.exports = TaskRouteHandler;