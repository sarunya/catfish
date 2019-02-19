const _ = require("lodash"),
JsonShareAccessor = require("../data-access/json-share-accessor");

class JsonShare {

    constructor(dependencies) {
        this.jsonShareAccessor = new JsonShareAccessor(dependencies);
    }

    async createJsonShare(actual, expected) {
        const me = this;
        try {
            let count = await me.jsonShareAccessor.getTotalCount();
            if(!_.isEmpty(count) && parseInt(count)>100) { 
                await me.jsonShareAccessor.deleteLastUsed();
            }
            let result = await me.jsonShareAccessor.save(actual, expected);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getJsonShare(id) {
        const me = this;
        try {
            let result = await me.jsonShareAccessor.getById(id);
            await me.jsonShareAccessor.updateModifiedDateById(id);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = JsonShare;