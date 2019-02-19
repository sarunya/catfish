const QueryFile = require('pg-promise').QueryFile,
    path = require('path');

module.exports = function (file) {
    const fullPath = path.join(__dirname, file);
    return new QueryFile(fullPath, { minify: true });
};