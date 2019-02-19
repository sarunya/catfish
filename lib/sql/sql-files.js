const load = require('./load-sql'),
  Constants = require('../common/constants');


let sqlFileHash = {};
sqlFileHash[Constants.TableNames.JsonShareData] = {
  insert: load('./json-share/insert.sql'),
  getById: load('./json-share/getbyid.sql'),
  deleteLastUsed: load('./json-share/deletelastused.sql'),
  totalCount: load('./json-share/totalcount.sql'),
  updateModifiedDateById: load('./json-share/updatemodifieddatebyid.sql')
};

module.exports = sqlFileHash;