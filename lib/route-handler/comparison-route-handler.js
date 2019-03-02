const ArrayComparisonService = require('../service/compare-service');
const JsonShareService = require('../service/json-share');
class ComaprisonRouteHandler {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    arrayComparison(request, reply) {
        let me = this;
        try {
            let service = new ArrayComparisonService(me.dependencies, me.config, request);
            let result = service.compare(request.body);
            reply.send(result);
        } catch (error) {
            me._replyError(reply, error); 
        }
    }

    async createJsonShare(request, reply) {
        let me = this;
        try {
            let service = new JsonShareService(me.dependencies, me.config, request);
            let result = await service.createJsonShare(request.body);
            reply.send(result);
        } catch (error) {
            me._replyError(reply, error); 
        }
    }

    async createArrayShare(request, reply) {
        let me = this;
        try {
            let service = new JsonShareService(me.dependencies, me.config, request);
            let result = await service.createArrayShare(request.body);
            reply.send(result);
        } catch (error) {
            me._replyError(reply, error); 
        }
    }

    async getJsonShareData(request, reply) {
        let me = this;
        let result = null;
        try {
            let service = new JsonShareService(me.dependencies, me.config, request);
            result = await service.getJsonShare(request.query.id);
            reply.send(result);
        } catch (error) {
            result = {error:error};
            reply.send(result);
        }
    }

    async getArrayShareData(request, reply) {
        let me = this;
        let result = null;
        try {
            let service = new JsonShareService(me.dependencies, me.config, request);
            result = await service.getArrayShare(request.query.id);
            reply.send(result);
        } catch (error) {
            result = {error:error};
            reply.send(result);
        }
    }

    _replyError(reply, error) {
        reply.status(error.statusCode || error.status || 500);
        reply.send(error);
     }

}
module.exports = ComaprisonRouteHandler;