const 
    co = require('co'),
    got = require('got');
class KeyValueService {
    constructor(dependencies) {
    }

    getTinyUrl(payload) {
        return co(function* () {
            let url = "http://tinyurl.com/api-create.php?url=" + encodeURIComponent(payload.url)
            let result
            try {
                result = yield got(url, { json: true })
            }
            catch (e) {
                result = e.response.body
            }
            return result;
        });
    }


}
module.exports = KeyValueService;