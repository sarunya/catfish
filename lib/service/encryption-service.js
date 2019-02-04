const crypto = require('crypto');

class EncryptionService {
    encrypt(type, payload, secret) {

    }

    hash(type, payload, secret) {
        let sha = crypto.createHash('sha1');
    }
}