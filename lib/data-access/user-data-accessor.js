const
    PgModel2 = require('../key-value-db/postgres/posty2'),
    baseSqlCommands = require('../sql/sql-files'),
    Constants = require('../common/constants'),
    co = require('co'),
    uuid = require('uuid');

class UserDataAccessor extends PgModel2 {
    constructor(dependencies) {
        super(dependencies);
        this.tableName = Constants.TableNames.UserData;
        this.baseUserCommands = baseSqlCommands[this.tableName];
    }

    async getByIdentityId(identityId) {
        const me = this;
        let result = await me.filter(me.baseUserCommands.filterByIdentityId, [identityId]);
        console.log(JSON.stringify(result, null, 10));
        return result;
    }

    async getByEmailId(identityId) {
        const me = this;
        let result = await me.filter(me.baseUserCommands.filterByEmailId, [identityId]);
        console.log(JSON.stringify(result, null, 10));
        return result;
    }

    async save(data) {
        const me = this;
        data.id = uuid.v4();
        return await me.insert(me.baseUserCommands.insert, [data.id, data]);
    }

    async getUserRecordsCount(identityId) {
        const me = this;
        let result = await me.filter(me.baseUserCommands.countUserRecords, [identityId]);
        console.log(JSON.stringify(result, null, 10));
        return result;
    }
}
module.exports = UserDataAccessor;