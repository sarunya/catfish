
let pgp = require("pg-promise")({
    extend(obj) {
      if (obj.ctx) {
        obj.ctx._meta = obj.ctx._meta || {
          redisKeys: []
        };
      }
    }
  });
  let _pgp;
  module.exports = {
    db: function (connectionString, maxPoolSize = 20, minPoolSize = 5) {
      if (!_pgp)
        _pgp = pgp({
          connectionString: connectionString,
          max: maxPoolSize,
          min: minPoolSize
        });
      return _pgp;
    }
  };