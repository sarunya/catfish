const _ = require("lodash"),
    CryptoUtil = require('../common/crypto-util'),
    Errors = require('../common/error'),
    CodeshareAccessor = require('../data-access/codeshare-accessor'),
    UserDataService = require('../service/user-data-service');


class UserCodeshareService {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.cryptoUtil = new CryptoUtil();
        this.codeshareAccessor = new CodeshareAccessor(dependencies);
        this.userDataService = new UserDataService(dependencies);
    }

    /**
     * Gets user data by identity id
     * @param {UserData} identityId 
     */
    async getCodeshareDataByIdentityId(identityId) {
        try {
            const me = this;
            let result = await me.codeshareAccessor.getByIdentityId(identityId);
            return _.map(result, "data");
        } catch (error) {
            console.log("error", "getCodeshareDataByIdentityId", error);
            throw error;
        }
    }

    /**
     * Creates an user data and returns its object.
     * If user already exists, throws UserAlreadyFoundError
     * @param {UserData} codeShareData 
     */
    async addNewCodeShareRecord(codeShareData) {
        try {
            const me = this;
            let identityId = codeShareData.identity_id;
            //check if user exists
            let existingUserData = await me.userDataService.getUserDataByIdentityId(identityId);
            console.log(JSON.stringify(existingUserData, null, 10));
            if(_.isEmpty(existingUserData)) {
                throw Errors.UserNotFoundError;
            }

            let totalRecordCountByUser = await me.codeshareAccessor.getCountByIdentityId(identityId);
            if(totalRecordCountByUser >= 3) {
                throw Errors.CodeshareSaveLimitReachedByUser;
            }

            //check if codeshare data already exists
            let existingFirebaseData = await me.codeshareAccessor.getByFirebaseId(codeShareData.firebase_id);

            console.log(JSON.stringify(existingFirebaseData, null, 10));
            if(!_.isEmpty(existingFirebaseData)) {
                if(existingFirebaseData.identity_id === identityId) {
                    throw Errors.FirebaseRecordOwnedAlready;
                } else {
                    throw Errors.DuplicateFirebaseRecordSaveError;
                }
            }

            return await me.codeshareAccessor.save(codeShareData);
        } catch (error) {
            console.log("error", "addNewUser", error);
            throw error;
        }
    }
}
module.exports = UserCodeshareService;