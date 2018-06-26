const KeyValueAccessor = require('../data-access/key-value-data-accessor'),
    co = require('co');
class KeyValueService {
    constructor(dependencies) {
        this.keyValueAccessor = new KeyValueAccessor(dependencies);
    }
    filter(data) {
        return this.keyValueAccessor.filterData(data);
    }
    save(data) {
        const me = this;
        return co(function*() {
            return yield me.keyValueAccessor.save(data);
        });
    }
}
module.exports = KeyValueService;