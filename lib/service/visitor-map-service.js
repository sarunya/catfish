const _ = require("lodash");
let visitorMap = {};

class VisitorMapService {
    constructor(dependencies) {
    }

    updateVisitorMap(payload) {
        let visitorId = payload.visitor_id;
        let hash = payload.hash;
        let keys = _.keys(visitorMap);
        if(keys.length >= 20) {
            _deleteOldVisitorId();
        }
        visitorMap[visitorId] = {
            visitor_id : visitorId,
            code_hash : hash,
            created_date : new Date().toISOString()
        };
    }

    getHashOfVisitor(visitorId) {
        if(visitorMap[visitorId]) {
            return visitorMap[visitorId].code_hash;
        }
        return null;
    }

    _deleteOldVisitorId() {
        let oldestVisitor = null;
        let oldestDate = null;
        _.each(_.keys(visitorMap), function(visitorId) {
            let visitorData = visitorMap[visitorId];
            if(oldestDate && _isDateGreater(newDate, oldestDate)) {
                oldestDate = visitorData.created_date;
                oldestVisitor = visitorId;
            } else {
                oldestDate = visitorData.created_date;
                oldestVisitor = visitorId;
            }
        })
        delete visitorMap[oldestVisitor];
    }

    _isDateGreater(date, oldDate) {
        return new Date(date) > new Date(oldDate);
    }
}
module.exports = VisitorMapService;