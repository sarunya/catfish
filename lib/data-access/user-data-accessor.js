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

    filterData(data) {
        return this.filter(data);
    }

    getByEmail(email) {
        const me = this;
        return co(function* () {

        })
    }

    async getByIdentityId(identityId) {
        const me = this;
        let result = await me.filter(me.baseUserCommands.filterByIdentityId, [identityId]);
        console.log(JSON.stringify(result, null, 10));
        return result;
    }

    async save(data) {
        const me = this;
        data.id = uuid.v4();
        return await me.insert(me.baseUserCommands.insert, [data.id, data]);
    }
}
module.exports = UserDataAccessor;