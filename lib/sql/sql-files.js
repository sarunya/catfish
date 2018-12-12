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
  insert: load('./user-data/insert.sql'),
  filterByIdentityId: load('./user-data/filterByIdentityId.sql'),
  filterByFirebaseId: load('./user-data/filterByFirebaseId.sql'),
  countRecordsByIdentityId: load('./user-data/countRecordsByIdentityId.sql')
};


module.exports = sqlFileHash;