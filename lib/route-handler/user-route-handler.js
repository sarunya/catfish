"use strict"

const UserDataService = require('../service/user-data-service');
const UserCodeshareService = require('../service/user-codeshare-service');

class UserRouteHandler {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.userDataService = new UserDataService(this.dependencies, this.config);
        this.userCodeshareService = new UserCodeshareService(this.dependencies, this.config);
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

    async login(request, reply) {
        const me = this;
        try {
            let result = await me.userDataService.loginUser(request.query.email, request.query.password);
            reply.send(result);
        } catch (error) {
            me._replyError(reply, error);
        }
    }

    async addNewCodeShareRecord(request, reply) {
        const me = this;
        try {
            let result = await me.userCodeshareService.addNewCodeShareRecord(request.body);
            reply.send(result);
        } catch (error) {
            me._replyError(reply, error); 
        }
    }

    async getSavedCodeShare(request, reply) {
        const me = this;
        try {
            let result = await me.userCodeshareService.getCodeshareDataByIdentityId(request.headers.identity_id);
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