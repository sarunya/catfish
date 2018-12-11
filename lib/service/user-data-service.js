const _ = require("lodash"),
    CryptoUtil = require('../common/crypto-util'),
    Errors = require('../common/error'),
    UserDataAccessor = require('../data-access/user-data-accessor');


class UserDataService {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.cryptoUtil = new CryptoUtil();
        this.userDataAccessor = new UserDataAccessor(dependencies);
    }

    async checkIfUserExists(identityId) {
        try {
            const me = this;
            let result = await me.userDataAccessor.getByIdentityId(identityId);
            return result;
        } catch (error) {
            console.log("error", "checkIfUserExists", error);
            throw error;
        }
    }

    generateIdentityId(email) {
        const me = this;
        return me.cryptoUtil.generateSha1Hash(email, me.dependencies.config.hashSecret);
    }

    async addNewUser(userData) {
        try {
            const me = this;
            userData.identity_id = me.generateIdentityId(userData.email);
            let existingData = await me.checkIfUserExists(userData.identity_id);
            if (!_.isEmpty(existingData)) {
                throw Errors.UserAlreadyExists;
            }
            userData.is_active = true;
            return await me.userDataAccessor.save(userData);
        } catch (error) {
            console.log("error", "addNewUser", error);
            throw error;
        }
    }
}
module.exports = UserDataService;