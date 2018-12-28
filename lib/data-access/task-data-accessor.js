const
    PgModel2 = require('../key-value-db/postgres/posty2'),
    baseSqlCommands = require('../sql/sql-files'),
    Constants = require('../common/constants'),
    co = require('co'),
    uuid = require('uuid');

class TaskDataAccessor extends PgModel2 {
    constructor(dependencies) {
        super(dependencies);
        this.tableName = Constants.TableNames.TaskData;
        this.baseUserCommands = baseSqlCommands[this.tableName];
    }

    async getCountByIdentityId(identityId) {
        const me = this;
        console.log("identityId", identityId)
        let result = await me.filter(me.baseUserCommands.countRecordsByIdentityId, [identityId]);
        console.log("getCountByIdentityId", JSON.stringify(result, null, 10));
        return result;
    }

    async getByIdentityId(identityId) {
        const me = this;
        console.log("identityId", identityId);
        let result = await me.filter(me.baseUserCommands.filterByIdentityId, [identityId]);
        console.log("getByIdentityId", JSON.stringify(result, null, 10));
        return result;
    }

    async getByFirebaseId(firebaseId) {
        const me = this;
        let result = await me.filter(me.baseUserCommands.filterByFirebaseId, [firebaseId]);
        return result;
    }

    async save(data) {
        const me = this;
        data.id = uuid.v4();
        return await me.insert(me.baseUserCommands.insert, [data.id, data]);
    }
}
module.exports = TaskDataAccessor;