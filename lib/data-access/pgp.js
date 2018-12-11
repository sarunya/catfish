let pgp = require("pg-promise")({});
  let _pgp;
  module.exports = {
    db: function (connectionString, maxPoolSize = 20, minPoolSize = 5) {
      if (!_pgp)
        _pgp = pgp({
          connectionString: connectionString,
          max: maxPoolSize,
          min: minPoolSize,
          ssl: true
        });
      return _pgp;
    }
  };