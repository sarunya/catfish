const
    PgModel = require('../key-value-db/postgres/posty'),
    co = require('co'),
    uuid = require('uuid'),
    Constants = require('../common/constants.json');

class TaskInfoDataAccessor extends PgModel {
    constructor(dependencies) {
        super(dependencies, Constants.TableNames.TaskInfo);
    }

    getTasksByEmail(email) {
        const me = this;
        return co(function*() {
            let options = {
                keys: [{
                    type: 'json',
                    columnName: "data->>'email'",
                    value: email
                },{
                    type: 'json',
                    columnName: "data->>'is_active'",
                    value: "true"
                }],
                selectableCols: ["*"]
            };
            return yield me.filterTable(options);
        }).catch((err) => {
           console.log('EComCouponAccessor', 'getCouponsByOfferId', err);
            throw err;
        });
    }

    save(data) {
        const me = this;
        return co(function* () {
            data.id = uuid.v4();
            return yield me.tableInsert(data.id, data)
        })
    }
}
module.exports = TaskInfoDataAccessor;