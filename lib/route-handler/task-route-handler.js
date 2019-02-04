"use strict"

const TaskService = require('../service/task-service');

class TaskRouteHandler {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.taskService = new TaskService(this.dependencies, this.config);
    }

    async saveOrUpdateTask(request, reply) {
        const me = this;
        try {
            let result = await me.taskService.saveOrUpdateTask(request.body);
            console.log("result", result);
            reply.send(result);
        } catch (error) {
            console.log("error", error);
            me._replyError(reply, error);
        }
    }

    async getTasksForIdentityId(request, reply) {
        const me = this;
        try {
            let result = await me.taskService.getAllTasksByIdentityId(request.headers.identity_id);
            reply.send(result);
        } catch (error) {
            me._replyError(reply, error); 
        }
    }

    _replyError(reply, error) {
       reply.status(error.statusCode || error.status || 500);
       reply.send(error);
    }

}
module.exports = TaskRouteHandler;