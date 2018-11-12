const co = require('co'),
_ = require('lodash'),
joi = require('joi'),
userSchema = require('./../schema/task-schema').userInfoPayload,
UserInfoDataAccessor = require('../data-access/user-info-data-accessor');
class UserService {
    constructor(dependencies) {
        this.userInfoDataAccessor = new UserInfoDataAccessor(dependencies);
    }

    registerUser(payload) {
        const me = this;
        return co(function* () {
            let validation = joi.validate(payload, userSchema);
            if(validation.error) {
                console.log(JSON.stringify(validation, null, 10));
                throw validation.error;
            }
            console.log(JSON.stringify(payload, null, 10));
            let existingUser = yield me.getUserInfo(payload.email);
            if(!existingUser || _.isEmpty(existingUser)) {
                payload.is_active = true;
                yield me.userInfoDataAccessor.save(payload);
            }
            return payload;
        }).catch((err) => {
            console.log(err);
        });
    }


    getUserInfo(email) {
        const me = this;
        return co(function*() {
            let data = yield me.userInfoDataAccessor.filterData(email);
            console.log(JSON.stringify(data, null, 10));
            return data[0];
        })
    }


}
module.exports = UserService;