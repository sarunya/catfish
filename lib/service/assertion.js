const _ = require("lodash");
const AssertionHelper = require("./json-diff")

let helper = new AssertionHelper();

let actual = {
    "a": 1,
    "b": 2,
    "K": "sarunya",
    "baby": "sdfd",
    "json1": {
        key: 1,
        key5: {
            g: "a",
            f: "b",
            "arr1": [{
                "K": "sarunya",
                "baby": "sdfds"
            },{
                "K": "sarunya",
                "baby": "sdfds"
            }]
        }
    },
    "arr1": []
}

let expected = {
    "a": {
        "c": 1,
        "d": 1
    },
    "b": 2,
    "K": 2345,
    "json1": {
        key: 1,
        key2: 2,
        key5: {
            g: "a",
            f: {
                k: 12345
            },
            "arr1": [{
                "K": "sarunya",
                "baby": "sdfd"
            }]
        }
    },
    "arr1": [1,2,3]
}

function compare(actual, expected) {
    helper.getDiffDiv(actual, expected);
}

compare(actual, expected);