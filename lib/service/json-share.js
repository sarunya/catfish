const _ = require("lodash");
const shortId = require("short-id");

class JsonShare {
    constructor(dependencies) {
    }

    async createJsonShare(actual, expected) {
        try {
            let id = shortId.generate();
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = JsonShare;