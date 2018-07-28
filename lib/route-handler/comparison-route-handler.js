const ArrayComparisonService = require('../service/compare-service')
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

}
module.exports = ComaprisonRouteHandler;