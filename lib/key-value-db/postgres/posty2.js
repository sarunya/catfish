'use strict';

class PGPure {
    constructor(dependencies) {
        this.pgp = dependencies.pgpCatFish
    }

    async insert(sqlCmd, values, tx = this.pgp) {
        const me = this;
        try {
            let result = await tx.one(sqlCmd, values);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async update(sqlCmd, values, tx = this.pgp) {
        const me = this;
        try {
            let result = await tx.one(sqlCmd, values);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async filter(sqlCmd, values, tx = this.pgp) {
        const me = this;
        try {
            let result = await tx.any(sqlCmd, values);
            return (result)?result:null;
        } catch (err) {
            throw err;
        }
    }

    async count(sqlCmd, values, tx = this.pgp) {
        const me = this;
        try {
            let result = await tx.one(sqlCmd, values);
            return (result)?result:null;
        } catch (err) {
            throw err;
        }
    }

    async delete(sqlCmd, values, tx = this.pgp) {
        const me = this;
        try {
            let result = await tx.any(sqlCmd, values);
            return result;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = PGPure;