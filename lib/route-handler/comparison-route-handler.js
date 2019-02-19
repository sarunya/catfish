const ArrayComparisonService = require('../service/compare-service');
const JsonShareService = require('../service/json-share');
class ComaprisonRouteHandler {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    arrayComparison(request, reply) {
        try {
            let me = this;
            let service = new ArrayComparisonService(me.dependencies, me.config, request);
            let result = service.compare(request.body);
            reply.send(result);
        } catch (error) {
            reply.send(error);
        }

    }

    async createJsonShare(request, reply) {
        try {
            let me = this;
            let service = new JsonShareService(me.dependencies, me.config, request);
            let result = await service.createJsonShare(request.body.actual, request.body.expexted);
            reply.send(result);
        } catch (error) {
            reply.send(error);
        }
    }

}
module.exports = ComaprisonRouteHandler;