"use strict"

const UserDataService = require('../service/user-data-service')
class UserRouteHandler {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.userDataService = new UserDataService(this.dependencies, this.config);
    }

    async addNewUser(request, reply) {
        const me = this;
        try {
            let result = await me.userDataService.addNewUser(request.body);
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
module.exports = UserRouteHandler;