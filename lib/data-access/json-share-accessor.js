const
    Pg2 = require('../key-value-db/postgres/posty2'),
    baseSqlCommands = require('../sql/sql-files'),
    Constants = require('../common/constants'),
    shortId = require('short-id');

class JsonShareAccessor extends Pg2 {
    constructor(dependencies) {
        super(dependencies);
        this.tableName = Constants.TableNames.JsonShareData;
        this.baseUserCommands = baseSqlCommands[this.tableName];
    }

    async getTotalCount() {
        const me = this;
        let result = await me.count(me.baseUserCommands.totalCount);
        console.log("getTotalCount", JSON.stringify(result, null, 10));
        return result.count;
    }

    async deleteLastUsed() {
        const me = this;
        let result = await me.delete(me.baseUserCommands.deleteLastUsed);
        console.log("deleteLastUsed", JSON.stringify(result, null, 10));
        return result;
    }

    async getById(id) {
        const me = this;
        console.log("getById", id);
        let result = await me.filter(me.baseUserCommands.getById, [id]);
        console.log("getById", JSON.stringify(result, null, 10));
        return result[0];
    }

    async save(actual, expected) {
        const me = this;
        let id = shortId.generate();
        console.log(id, actual, expected);
        return await me.insert(me.baseUserCommands.insert, [id, actual, expected]);
    }

    async updateModifiedDateById(id) {
        const me = this;
        return await me.update(me.baseUserCommands.updateModifiedDateById, [id]);
    }
}
module.exports = JsonShareAccessor;
