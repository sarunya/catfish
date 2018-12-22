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

    /**
     * Gets user data by identity id
     * @param {UserData} identityId 
     */
    async getUserDataByIdentityId(identityId) {
        try {
            const me = this;
            console.log(identityId)
            let result = await me.userDataAccessor.getByIdentityId(identityId);
            return result;
        } catch (error) {
            console.log("error", "getUserDataByIdentityId", error);
            throw error;
        }
    }

    /**
     * Gets user data by email id
     * @param {UserData} email 
     */
    async getUserDataByEmail(email) {
        try {
            const me = this;
            let result = await me.userDataAccessor.getByEmailId(email);
            return result;
        } catch (error) {
            console.log("error", "getUserDataByIdentityId", error);
            throw error;
        }
    }

    /**
     * Creates an user data and returns its object.
     * If user already exists, throws UserAlreadyFoundError
     * @param {UserData} userData 
     */
    async addNewUser(userData) {
        try {
            const me = this;
            userData.identity_id = me.generateIdentityId(userData.email);
            let promises = [];
            promises[0] = me.getUserDataByIdentityId(userData.identity_id);
            promises[1] = me.getUserDataByIdentityId(userData.identity_id);
            let resolvedPromises = await promises;
            let existingData = resolvedPromises[0];
            let userCount = resolvedPromises[1];
            if(userCount >= 50) {
                throw Errors.UserRegistrationCountExceeded;
            }
            if (!_.isEmpty(existingData)) {
                throw Errors.UserAlreadyExists;
            }
            userData.is_active = true;
            let createdUserData = await me.userDataAccessor.save(userData);
            createdUserData = createdUserData.data;
            return me._getUserDataResponse(createdUserData);
        } catch (error) {
            console.log("error", "addNewUser", error);
            throw error;
        }
    }

    /**
     * Creates an user data and returns its object.
     * If user already exists, throws UserAlreadyFoundError
     * @param {UserData} userData 
     */
    async loginUser(email, password) {
        try {
            const me = this;
            let userData = await me.getUserDataByEmail(email);
            if (_.isEmpty(userData)) {
                throw Errors.IncorrectUserDetailsError;
            }
            userData = userData[0].data;
            if(userData.password.active_password === password) {
                return me._getUserDataResponse(userData);
            }
            throw Errors.IncorrectPassword;
        } catch (error) {
            console.log("error", "loginUser", error);
            throw error;
        }
    }

    generateIdentityId(email) {
        const me = this;
        return me.cryptoUtil.generateSha1Hash(email, me.dependencies.config.hashSecret);
    }

    _getUserDataResponse(userData) {
        return _.omit(userData, ["password", "created_date", "modified_date"])
    }
}
module.exports = UserDataService;