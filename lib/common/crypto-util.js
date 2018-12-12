const Constants = require('./constants'),
    crypto = require('crypto'),
    shortId = require('shortid32');
/**
 *Consolidates the functions of cypto in this class
 *
 * @class CryptoUtil
 * @author Sarunya Durai
 */
class CryptoUtil {

    /**
     *Generates SHA 512 using given text and secret
     *
     * @param {*} text
     * @param {*} secret
     * @returns hashed value
     * @memberof CryptoUtil
     */
    generateSha512Hash(text, secret) {
        return crypto.createHmac(Constants.ShaTags.Sha512, secret).update(text).digest('hex');
    }

    generateSha1Hash(text, secret) {
        return crypto.createHmac(Constants.ShaTags.Sha1, secret).update(text).digest('hex');
    }

    generateShortId() {
        return shortId.generate();
    }
}

module.exports = CryptoUtil;