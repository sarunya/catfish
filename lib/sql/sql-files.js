const load = require('./load-sql'),
Constants = require('../common/constants');


let sqlFileHash = {};
sqlFileHash[Constants.TableNames.UserData] = {
  insert: load('./user-data/insert.sql'),
  filterByIdentityId: load('./user-data/filterByIdentityId.sql')
};


module.exports = sqlFileHash;