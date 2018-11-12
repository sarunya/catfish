const
    PgModel = require('../key-value-db/postgres/posty'),
    co = require('co'),
    uuid = require('uuid'),
    Constants = require('../common/constants.json');

class UserInfoDataAccessor extends PgModel {
    constructor(dependencies) {
        super(dependencies, Constants.TableNames.UserInfo);
    }

    filterData(email) {
        const me = this;
        return co(function*() {
            let options = {
                keys: [{
                    type: 'json',
                    columnName: Constants.userinfo.Email,
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
            return yield me.tableInsert(data.email, data)
        })
    }
}
module.exports = UserInfoDataAccessor;