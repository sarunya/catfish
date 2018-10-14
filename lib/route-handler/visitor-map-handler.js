const VisitorMapService = require('../service/visitor-map-service')
class VisitorMapHandler {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.visitorMapService = new VisitorMapService(this.dependencies, this.config);
    }

    updateVisitorMap(request, reply) {
        try {
            let me = this;
            let result = me.visitorMapService.updateVisitorMap(request.body);
            reply.send(result);
        } catch (error) {
            reply.send(error);
        }

    }

    getCodeHash(request, reply) {
        try {
            let me = this;
            let result = me.visitorMapService.getHashOfVisitor(request.body.visitor_id);
            reply.send(result);
        } catch (error) {
            console.log(error);
            reply.send(error);
        }

    }

}
module.exports = VisitorMapHandler;