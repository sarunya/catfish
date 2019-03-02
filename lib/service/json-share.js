const _ = require("lodash"),
    md5 = require("md5"),
    JsonShareAccessor = require("../data-access/json-share-accessor");

class JsonShare {

    constructor(dependencies) {
        this.jsonShareAccessor = new JsonShareAccessor(dependencies);
    }

    async createJsonShare(payload) {
        const me = this;
        try {
            let actualhash = me._generateObjectHash(payload.actual);
            let expectedhash = me._generateObjectHash(payload.expected);
            let actual = {data: payload.actual};
            let expected = {data: payload.expected};

            let existingId = await me.jsonShareAccessor.filterByHash(actualhash, expectedhash);
            if(existingId && existingId.id && existingId.id.length>4) {
                return existingId;
            }

            let count = await me.jsonShareAccessor.getTotalCount();
            if (!_.isEmpty(count) && parseInt(count) > 100) {
                await me.jsonShareAccessor.deleteLastUsed();
            }
            return await me.jsonShareAccessor.save(actual, expected, actualhash, expectedhash);
        } catch (error) {
            throw error;
        }
    }

    async createArrayShare(payload) {
        const me = this;
        try {
            let actualhash = me._generateArrayHash(payload.actual);
            let expectedhash = me._generateArrayHash(payload.expected);
            let actual = {data:payload.actual};
            let expected = {data:payload.expected};

            let existingId = await me.jsonShareAccessor.filterArrayByHash(actualhash, expectedhash);
            if(existingId && existingId.id && existingId.id.length>4) {
                return existingId;
            }

            let count = await me.jsonShareAccessor.getTotalCount();
            if (!_.isEmpty(count) && parseInt(count) > 100) {
                await me.jsonShareAccessor.deleteLastUsed();
            }
            return await me.jsonShareAccessor.save(actual, expected, actualhash, expectedhash, payload.userOptions);
        } catch (error) {
            console.log(JSON.stringify(error, null, 10));
            throw error;
        }
    }

    async getJsonShare(id) {
        const me = this;
        try {
            let result = await me.jsonShareAccessor.getById(id);
            result = await me._updateModifiedDateById(result, id);
            result.actual = result.actual.data;
            result.expected = result.expected.data;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getArrayShare(id) {
        const me = this;
        try {
            let result = await me.jsonShareAccessor.getArrayById(id);
            result = await me._updateModifiedDateById(result, id);
            result.actual = result.actual.data;
            result.expected = result.expected.data;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async _updateModifiedDateById(result, id) {
        const me = this;
        if(result && result.actual && result.expected) {
            await me.jsonShareAccessor.updateModifiedDateById(id);
            return result;
        }
        throw "Result Not Found";
    }

    _generateObjectHash(object) {
        const me = this;
        let hashObject = me._sortObject(object);
        return md5(JSON.stringify(hashObject));
    }

    _generateArrayHash(object) {
        let hashObject = _.sortBy(object);
        return md5(JSON.stringify(hashObject));
    }

    _sortObject(unorderedObj) {
        const me = this;
        if(me._isJSON(unorderedObj)) {
            return  me._sortJson(unorderedObj);
        } else if(me._isArray(unorderedObj)) {
            return me._sortArray(unorderedObj);
        } else {
            return unorderedObj;
        }
    }

    _sortArray(unordered) {
        const me = this;
        if (_.isEmpty(unordered)) {
            return unordered;
        }
        
        let ordered = [];
        if(me._isJSON(unordered[0])) {
            for (let index = 0; index < unordered.length; index++) {
                const element = unordered[index];
                ordered[index] = me._sortJson(element);
            }
        } else {
            ordered = _.sortBy(unordered);
        }
        return ordered;
    }

    _sortJson(unordered) {
        const me = this;
        const ordered = {};
        let sortedKeys = _.sortBy(_.keys(unordered));
        for (let index = 0; index < sortedKeys.length; index++) {
            const key = sortedKeys[index];
            if(me._isArray(unordered[key])) {
                ordered[key] = me._sortArray(unordered[key]);
            } else if(me._isJSON(unordered[key])) {
                ordered[key] = me._sortJson(unordered[key]);
            } else {
                ordered[key] = unordered[key];
            }
        };
        return ordered;
    }

    //check if given json is an array
    _isJSON(x) {
        const me = this;
        try {
            return (me._isObject(x) && JSON.parse(JSON.stringify(x)) && !me._isArray(x));
        } catch (e) {
            return false;
        }
    }

    _isObject(a) {
        return (!!a) && (a.constructor === Object);
    };

    _isArray(a) {
        return (!!a) && (a.constructor === Array);
    };
}

module.exports = JsonShare;