const load = require('./load-sql'),
  Constants = require('../common/constants');


let sqlFileHash = {};
sqlFileHash[Constants.TableNames.UserData] = {
  insert: load('./user-data/insert.sql'),
  filterByIdentityId: load('./user-data/filterByIdentityId.sql'),
  filterByEmailId: load('./user-data/filterByEmailId.sql'),
  countUserRecords: load('./user-data/countUserRecords.sql')
};

sqlFileHash[Constants.TableNames.UserCodeshareData] = {
  insert: load('./user-codeshare/insert.sql'),
  filterByIdentityId: load('./user-codeshare/filterByIdentityId.sql'),
  filterByFirebaseId: load('./user-codeshare/filterByFirebaseId.sql'),
  countRecordsByIdentityId: load('./user-codeshare/countRecordsByIdentityId.sql')
};

sqlFileHash[Constants.TableNames.TaskData] = {
  insert: load('./task-data/insert.sql'),
  filterByIdentityId: load('./task-data/filterByIdentityId.sql'),
  countRecordsByIdentityId: load('./task-data/countRecordsByIdentityId.sql'),
  updateById: load('./task-data/updateById.sql')
};


module.exports = sqlFileHash;