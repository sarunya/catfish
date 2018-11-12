const co = require('co'),
    _ = require('lodash'),
    joi = require('joi'),
    taskSchema = require('../schema/task-schema').taskInfoPayload,
    UserService = require('../service/user-service'),
    TaskInfoDataAccessor = require('../data-access/task-info-data-accessor');
class TaskService {
    constructor(dependencies) {
        this.taskInfoDataAccessor = new TaskInfoDataAccessor(dependencies);
        this.userService = new UserService(dependencies);
    }

    createTask(payload) {
        const me = this;
        return co(function* () {
            let validation = joi.validate(payload, taskSchema);
            if(validation.error) {
                console.log(JSON.stringify(validation, null, 10));
                throw validation.error;
            }
            payload.is_active = true;
            yield me.taskInfoDataAccessor.save(payload);
            return payload;
        }).catch((err) => {
            console.log(err);
        });
    }


    searchTask(payload) {
        const me = this;
        return co(function* () {
            let userData = yield me.userService.getUserInfo(payload.email);
            if(!userData || _.isEmpty(userData)) {
                console.log("User is not Authorised");
                return "User is not Authorised";
            }
            return yield me.taskInfoDataAccessor.getTasksByEmail(payload.email);
        })
    }
}
module.exports = TaskService;