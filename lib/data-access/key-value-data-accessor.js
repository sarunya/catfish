const 
    PgModel = require('../key-value-db/postgres/posty'),
    co = require('co'),
    uuid = require('uuid');
class KeyValueAccessor extends PgModel {
    constructor(dependencies) {
        super(dependencies);
    }
    filterData(data) {
        return this.filter(data);
    }
    save(data) {
        const me = this;
        return co(function*() {
            data.id = uuid.v4();
            return yield me.insert(data.id, data)
        })
    }
}
module.exports = KeyValueAccessor;
