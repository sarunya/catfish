const _ = require("lodash"),
    Errors = require('../common/error'),
    uuid = require('uuid'),
    TaskDataAccessor = require('../data-access/task-data-accessor');


class TaskService {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.taskDataAccessor = new TaskDataAccessor(dependencies);
    }

    /**
     * Gets task data by identity id
     * @param {TaskData} identityId 
     */
    async getAllTasksByIdentityId(identityId) {
        try {
            const me = this;
            console.log(identityId)
            let result = await me.taskDataAccessor.getByIdentityId(identityId);
            return result;
        } catch (error) {
            console.log("error", "getUserDataByIdentityId", error);
            throw error;
        }
    }

    /**
     * Saves or Updates the task data for a specific user
     * @param {TaskData} taskData 
     */
    async saveOrUpdateTask(taskData) {
        try {
            const me = this;
            let identityId = taskData.identity_id;
            let returnData = null;

            if(_.isEmpty(taskData.id)) {
                console.log("new task update");
                taskData.id = uuid.v4();
                returnData = await me.taskDataAccessor.save(taskData);
            } else {
                console.log("existing task update");
                returnData = await me.taskDataAccessor.updateById(taskData);
            }
            return returnData;
        } catch (error) {
            console.log("error", "saveOrUpdateTask", error);
            throw error;
        }
    }

}
module.exports = TaskService;