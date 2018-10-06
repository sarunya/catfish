const _ = require("lodash");
const AssertionHelper = require("./json-diff")

let helper = new AssertionHelper();

// let actual = {
//     "a": 1,
//     "b": 2,
//     "K": "sarunya",
//     "baby": "sdfd",
//     "json1": {
//         key: 1,
//         key5: {
//             g: "a",
//             f: "b",
//             "arr1": [{
//                 "K": "sarunya",
//                 "baby": "sdfds"
//             },{
//                 "K": "sarunya",
//                 "baby": "sdfds"
//             }]
//         }
//     },
//     "arr1": []
// }

// let expected = {
//     "a": {
//         "c": 1,
//         "d": 1
//     },
//     "b": 2,
//     "K": 2345,
//     "json1": {
//         key: 1,
//         key2: 2,
//         key5: {
//             g: "a",
//             f: {
//                 k: 12345
//             },
//             "arr1": [{
//                 "K": "sarunya",
//                 "baby": "sdfd"
//             }]
//         }
//     },
//     "arr1": [1,2,3]
// }

let actual = {
    "cart_id": "9cf1d2f5-a86b-4f5a-b70b-498b976614dc",
    "type": "B2C",
    "po_id": "1234",
    "currency": "INR",
    "cost": {
        "discount": {
            "amount": 38.25,
            "split": []
        },
        "shipping": 0,
        "subtotal": 344.25,
        "tax": 0,
        "total": 0
    },
    "line_items": {
        "adf6aad0-6fda-4d63-99f1-4d20ecefb3a4": {
            "line_item_id": "adf6aad0-6fda-4d63-99f1-4d20ecefb3a4",
            "quantity": 1,
            "sku_id": "SM-N950FZDDINS",
            "skip_inventory": false,
            "flash_sale": false,
            "line_item_cost": {
                "unit_list_price": 450,
                "regular_price": 450,
                "sale_price": 382.5,
                "quantity_groups": [
                    {
                        "associated_quantities": [],
                        "tax": 0,
                        "shipping": 0,
                        "discount": {
                            "amount": 38.25,
                            "split": [
                                {
                                    "discount_mode": "Epp",
                                    "value": 38.25,
                                    "id": "dfbab66e-d851-491e-8f5c-59f125fd0f7b",
                                    "delayed_gratification_value": 0
                                }
                            ]
                        },
                        "subtotal": 344.25
                    }
                ],
                "total": 344.25
            }
        }
    },
    "coupon_codes": [],
    "schema_version": "v2.0",
    "status": "Active",
    "user_info": {
        "locale": "IN",
        "store_id": "3049",
        "visitor_id": "ecom|c268a6df-ea47-4c3b-ae9d-03ed53d4e477",
        "user_id": "sarunya@gmail.com"
    },
    "rejected_coupon_codes": [],
    "offers_applied": {},
    "pg_offers": {},
    "validation_details": "eyJlcHBfcmVzdHJpY3Rpb24iOnsidGltZV9wZXJpb2RfYWNjdW11bGF0aW9uIjp7InR5cGUiOiJDcm9uIiwiY3Jvbl9leHByZXNzaW9uIjoiKiAqLzEwICogKiAqIn0sImNob3Nlbl9wcml2YXRlX3N0b3JlX2dyb3VwcyI6eyJTTS1OOTUwRlpERElOUyI6eyJuYW1lIjoiTW9iaWxlIERldmljZXMgU21hcnRwaG9uZXMiLCJtYXhfcXR5IjoxLCJ0YXhvbm9teSI6eyJwcm9kdWN0X2ZhbWlseSI6Ik1vYmlsZSBEZXZpY2VzIiwicHJvZHVjdF9jYXRlZ29yeSI6IlNtYXJ0cGhvbmVzIn0sInNrdV9saXN0IjpbIlNNLU45NTBGWkRESU5TIiwiU00tRzkyMElaQkEiLCJFRi1aRzkzMENCRUdXVyIsIlNNLUc1MzJHWkRESU5TIiwiU00tRzUzMkdaREQiLCJTTS1HNTMyR1pTRElOUyIsIlNNLUc1MzJHWlNEIiwiU00tRzUzMkdaS0RJTlMiLCJTTS1HNTMyR1pLRCIsIlNNLUE1MTBBQkMiLCJTTS1BNTIwRlpERElOUyIsIlNNLUc5MzBGWlNVIiwiU00tTjk2MEZaS0giLCJTTS1HOTU1RlpLRElOUyIsIlNNLUE2MDVHWkJIIiwiU00tTjk2MEZaS0RJTlMtUiIsIlNNLU45NjBGWktESU5TLVYiLCJTTS1OOTYwRlpLRElOUy1GIiwiU00tWjMwMEhaS0RJTlMiLCJTTS1aNDAwRlpERElOUyIsIlNNLU45NjBGWktISU5TIiwiU00tWjIwMEZaRERJTlMiLCJTTS1OOTYwRlpCSElOUyIsIlNNLU45NjBGWkJESU5TIiwiU00tTjk1MEZaS0RJTlMiLCJTTS1OOTYwRlpORElOUyIsIlNNLU45NjBGWktESU5TIiwiU00tRzYxMUZaREdJTlMiLCJTTS1HNjEwRlpERElOUyIsIlNNLUc5MzVGWktVSU5TIiwiU00tRzYxMUZaS0RJTlMiLCJTTS1HNjEwRlpESElOUyIsIlNNLUc2MTBGWktISU5TIiwiU00tRzYwMEZaRERJTlMiLCJTTS1HNjEwRlpET0lOUyIsIlNNLUc2MTBGWkRHSU5TIiwiU00tRzU3MEZaREdJTlMiLCJTTS1HNTUwRlpLRElOUyIsIlNNLUc1NzBGWkRESU5TIiwiU00tRzkzMEZaRFUiLCJTTS1HNjEwRlpLT0lOUyIsIlNNLUM5MDBGWkRESU5TIiwiU00tRzkyMElaREFJTlMiLCJTTS1HNTcwRlpLR0lOUyIsIlNNLUE2MDVHWkRISU5TIiwiU00tQTcyMEZaS0RJTlMiLCJTTS1BNzEwRlpERklOUyIsIlNNLUE2MDVHWktISU5TIiwiU00tQTYwMEdaS0hJTlMiLCJTTS1BNjAwR1pLR0lOUyIsIlNNLUE2MDBHWkRHSU5TIiwiU00tQTkxMEZaV0RJTlMiLCJTTS1BNjA1R1pCSElOUyIsIlNNLUE1MjBGWktESU5TIiwiU00tQTcyMEZaRERJTlMiLCJTTS1BNjAwR1pESElOUyIsIlNNLUM3MDFGTkJESU5TIiwiU00tQTczMEZaRElJTlMiLCJTTS1BNTEwRlpERklOUyIsIlNNLUE3MzBGWktJSU5TIiwiU00tQTUxMEZaU1QiLCJTTS1BNjAwR1pCR0lOUyIsIlNNLUE1MTBGWldUIiwiU00tQTMwMEhaRFQiLCJTTS1BMzAwSFpMTSIsIlNNLUEzMDBIWlNUIiwiU00tRzkyMElaS0EiLCJTTS1BNzMwRlpLSSIsIlNNLUE2MDVHWkRIIiwiRUYtTTUxMjlCUEdCUiIsIkVGLU01MTI4QlBHQlIiLCJTTS1KODEwR1pLR0lOUyIsIlNNLUo3MTBGWkRHSU5TIiwiU00tTjkyMDhaRFVJTlMiLCJTTS1KNzEwRlpEVUlOUyIsIlNNLU45MzBGWktESU5TIiwiU00tSjgxMEdaQkZJTlMiLCJTTS1KODEwR1pCR0lOUyIsIlNNLUo3MjBGWktHSU5TIiwiU00tSjgxMEdaS0ZJTlMiLCJTTS1KNjAwR1pLSElOUyIsIlNNLU45MjA4WkRWSU5TIiwiU00tSjczMEdaRFdJTlMiLCJTTS1KNjAwR1pER0lOUyIsIlNNLUozMjBGWkRHSU5TIiwiU00tSjczMEdaS1dJTlMiLCJTTS1KNjAwR1pESElOUyIsIlNNLUoyNTBGWklFSU5TIiwiU00tSjgxMEdaREdJTlMiLCJTTS1KNzAxRlpERElOUyIsIlNNLUoyNTBGWktFSU5TIiwiU00tSjcyMEZaREdJTlMiLCJTTS1KNzAxRlpLWUlOUyIsIlNNLUo0MDBGWktISU5TIiwiU00tSjYwMEdaS0ZJTlMiLCJTTS1KNTEwRlpEVUlOUyIsIlNNLUoxMjBHWldESU5TIiwiU00tRzk2NUZaQkRJTlMiLCJTTS1KNjAwR1pCSElOUyIsIlNNLUo2MDBHWkJHSU5TIiwiU00tSjExMEhaS0RJTlMiLCJTTS1HOTYwRlpCRElOUyIsIlNNLUo3MDFGWkRZSU5TIiwiU00tSjMyMEZaRERJTlMiLCJTTS1KMjAwR01ERElOUyIsIlNNLUo2MDBHWktHSU5TIiwiU00tSjUwMEZaV0RJTlMiLCJTTS1KMjUwRlpERUlOUyIsIlNNLUc5NTVGWktHSU5TIiwiU00tSjcwMEZaV0RJTlMiLCJTTS1KNDAwRlpLRElOUyIsIlNNLUoxMjBHWktESU5TIiwiU00tSjIxMEZaREdJTlMiLCJTTS1HOTU1RlpCRElOUyIsIlNNLUc5MjVJWkRBSU5TIiwiU00tRzYxNUZaRFVJTlMiLCJTTS1KMjEwRlpERElOUyIsIlNNLUc5NTVGWlZESU5TIiwiU00tRzkyMElaV0EiLCJTTS1HNjExRlpLR0lOUyIsIlNNLUo2MDBHWkJGSU5TIiwiU00tSjIwMEdaRERJTlMiLCJTTS1HOTY1RlpER0lOUyIsIlNNLUc5MzBGWktVIiwiU00tRzkyMElaREEiLCJTTS1KMjAwR1RLRElOUyIsIlNNLUc5NTBGWlZESU5TIiwiU00tRzk1MEZaS0RJTlMiLCJTTS1HNjE1RlpERElOUyIsIlNNLUoxMjBHWkRESU5TIiwiU00tRzk1NUZaRERJTlMiLCJTTS1HOTUwRlpSRElOUyIsIlNNLUc5MzBGWkRVSU5TIiwiU00tRzYxMUZaREZJTlMiLCJTTS1HNjExRlpERElOUyIsIlNNLUc5NTBGWkRESU5TIl19fX19",
    "epp_rejection_reasons": []
}

let expected = {
    "cart_id": "9cf1d2f5-a86b-4f5a-b70b-498b976614dc",
    "type": "B2C",
    "po_id": "1234",
    "currency": "INR",
    "cost": {
        "discount": {
            "amount": 38.25,
            "split": []
        },
        "shipping": 0,
        "subtotal": 344.25,
        "tax": 0,
        "total": 0
    },
    "line_items": {
        "adf6aad0-6fda-4d63-99f1-4d20ecefb3a4": {
            "line_item_id": "adf6aad0-6fda-4d63-99f1-4d20ecefb3a4",
            "quantity": 1,
            "sku_id": "SM-N950FZDDINS",
            "skip_inventory": false,
            "flash_sale": false,
            "line_item_cost": {
                "unit_list_price": 450,
                "regular_price": 450,
                "sale_price": 382.5,
                "quantity_groups": [
                    {
                        "associated_quantities": [],
                        "tax": 0,
                        "shipping": 0,
                        "discount": {
                            "amount": 38.25,
                            "split": [
                            ]
                        },
                        "subtotal": 344.25
                    }
                ],
                "total": 344.25
            }
        }
    },
    "coupon_codes": [],
    "schema_version": "v2.0",
    "status": "Active",
    "user_info": {
        "locale": "IN",
        "store_id": "3049",
        "visitor_id": "ecom|c268a6df-ea47-4c3b-ae9d-03ed53d4e477",
        "user_id": "sarunya@gmail.com"
    },
    "rejected_coupon_codes": [],
    "offers_applied": {},
    "pg_offers": {},
    "validation_details": "eyJlcHBfcmVzdHJpY3Rpb24iOnsidGltZV9wZXJpb2RfYWNjdW11bGF0aW9uIjp7InR5cGUiOiJDcm9uIiwiY3Jvbl9leHByZXNzaW9uIjoiKiAqLzEwICogKiAqIn0sImNob3Nlbl9wcml2YXRlX3N0b3JlX2dyb3VwcyI6eyJTTS1OOTUwRlpERElOUyI6eyJuYW1lIjoiTW9iaWxlIERldmljZXMgU21hcnRwaG9uZXMiLCJtYXhfcXR5IjoxLCJ0YXhvbm9teSI6eyJwcm9kdWN0X2ZhbWlseSI6Ik1vYmlsZSBEZXZpY2VzIiwicHJvZHVjdF9jYXRlZ29yeSI6IlNtYXJ0cGhvbmVzIn0sInNrdV9saXN0IjpbIlNNLU45NTBGWkRESU5TIiwiU00tRzkyMElaQkEiLCJFRi1aRzkzMENCRUdXVyIsIlNNLUc1MzJHWkRESU5TIiwiU00tRzUzMkdaREQiLCJTTS1HNTMyR1pTRElOUyIsIlNNLUc1MzJHWlNEIiwiU00tRzUzMkdaS0RJTlMiLCJTTS1HNTMyR1pLRCIsIlNNLUE1MTBBQkMiLCJTTS1BNTIwRlpERElOUyIsIlNNLUc5MzBGWlNVIiwiU00tTjk2MEZaS0giLCJTTS1HOTU1RlpLRElOUyIsIlNNLUE2MDVHWkJIIiwiU00tTjk2MEZaS0RJTlMtUiIsIlNNLU45NjBGWktESU5TLVYiLCJTTS1OOTYwRlpLRElOUy1GIiwiU00tWjMwMEhaS0RJTlMiLCJTTS1aNDAwRlpERElOUyIsIlNNLU45NjBGWktISU5TIiwiU00tWjIwMEZaRERJTlMiLCJTTS1OOTYwRlpCSElOUyIsIlNNLU45NjBGWkJESU5TIiwiU00tTjk1MEZaS0RJTlMiLCJTTS1OOTYwRlpORElOUyIsIlNNLU45NjBGWktESU5TIiwiU00tRzYxMUZaREdJTlMiLCJTTS1HNjEwRlpERElOUyIsIlNNLUc5MzVGWktVSU5TIiwiU00tRzYxMUZaS0RJTlMiLCJTTS1HNjEwRlpESElOUyIsIlNNLUc2MTBGWktISU5TIiwiU00tRzYwMEZaRERJTlMiLCJTTS1HNjEwRlpET0lOUyIsIlNNLUc2MTBGWkRHSU5TIiwiU00tRzU3MEZaREdJTlMiLCJTTS1HNTUwRlpLRElOUyIsIlNNLUc1NzBGWkRESU5TIiwiU00tRzkzMEZaRFUiLCJTTS1HNjEwRlpLT0lOUyIsIlNNLUM5MDBGWkRESU5TIiwiU00tRzkyMElaREFJTlMiLCJTTS1HNTcwRlpLR0lOUyIsIlNNLUE2MDVHWkRISU5TIiwiU00tQTcyMEZaS0RJTlMiLCJTTS1BNzEwRlpERklOUyIsIlNNLUE2MDVHWktISU5TIiwiU00tQTYwMEdaS0hJTlMiLCJTTS1BNjAwR1pLR0lOUyIsIlNNLUE2MDBHWkRHSU5TIiwiU00tQTkxMEZaV0RJTlMiLCJTTS1BNjA1R1pCSElOUyIsIlNNLUE1MjBGWktESU5TIiwiU00tQTcyMEZaRERJTlMiLCJTTS1BNjAwR1pESElOUyIsIlNNLUM3MDFGTkJESU5TIiwiU00tQTczMEZaRElJTlMiLCJTTS1BNTEwRlpERklOUyIsIlNNLUE3MzBGWktJSU5TIiwiU00tQTUxMEZaU1QiLCJTTS1BNjAwR1pCR0lOUyIsIlNNLUE1MTBGWldUIiwiU00tQTMwMEhaRFQiLCJTTS1BMzAwSFpMTSIsIlNNLUEzMDBIWlNUIiwiU00tRzkyMElaS0EiLCJTTS1BNzMwRlpLSSIsIlNNLUE2MDVHWkRIIiwiRUYtTTUxMjlCUEdCUiIsIkVGLU01MTI4QlBHQlIiLCJTTS1KODEwR1pLR0lOUyIsIlNNLUo3MTBGWkRHSU5TIiwiU00tTjkyMDhaRFVJTlMiLCJTTS1KNzEwRlpEVUlOUyIsIlNNLU45MzBGWktESU5TIiwiU00tSjgxMEdaQkZJTlMiLCJTTS1KODEwR1pCR0lOUyIsIlNNLUo3MjBGWktHSU5TIiwiU00tSjgxMEdaS0ZJTlMiLCJTTS1KNjAwR1pLSElOUyIsIlNNLU45MjA4WkRWSU5TIiwiU00tSjczMEdaRFdJTlMiLCJTTS1KNjAwR1pER0lOUyIsIlNNLUozMjBGWkRHSU5TIiwiU00tSjczMEdaS1dJTlMiLCJTTS1KNjAwR1pESElOUyIsIlNNLUoyNTBGWklFSU5TIiwiU00tSjgxMEdaREdJTlMiLCJTTS1KNzAxRlpERElOUyIsIlNNLUoyNTBGWktFSU5TIiwiU00tSjcyMEZaREdJTlMiLCJTTS1KNzAxRlpLWUlOUyIsIlNNLUo0MDBGWktISU5TIiwiU00tSjYwMEdaS0ZJTlMiLCJTTS1KNTEwRlpEVUlOUyIsIlNNLUoxMjBHWldESU5TIiwiU00tRzk2NUZaQkRJTlMiLCJTTS1KNjAwR1pCSElOUyIsIlNNLUo2MDBHWkJHSU5TIiwiU00tSjExMEhaS0RJTlMiLCJTTS1HOTYwRlpCRElOUyIsIlNNLUo3MDFGWkRZSU5TIiwiU00tSjMyMEZaRERJTlMiLCJTTS1KMjAwR01ERElOUyIsIlNNLUo2MDBHWktHSU5TIiwiU00tSjUwMEZaV0RJTlMiLCJTTS1KMjUwRlpERUlOUyIsIlNNLUc5NTVGWktHSU5TIiwiU00tSjcwMEZaV0RJTlMiLCJTTS1KNDAwRlpLRElOUyIsIlNNLUoxMjBHWktESU5TIiwiU00tSjIxMEZaREdJTlMiLCJTTS1HOTU1RlpCRElOUyIsIlNNLUc5MjVJWkRBSU5TIiwiU00tRzYxNUZaRFVJTlMiLCJTTS1KMjEwRlpERElOUyIsIlNNLUc5NTVGWlZESU5TIiwiU00tRzkyMElaV0EiLCJTTS1HNjExRlpLR0lOUyIsIlNNLUo2MDBHWkJGSU5TIiwiU00tSjIwMEdaRERJTlMiLCJTTS1HOTY1RlpER0lOUyIsIlNNLUc5MzBGWktVIiwiU00tRzkyMElaREEiLCJTTS1KMjAwR1RLRElOUyIsIlNNLUc5NTBGWlZESU5TIiwiU00tRzk1MEZaS0RJTlMiLCJTTS1HNjE1RlpERElOUyIsIlNNLUoxMjBHWkRESU5TIiwiU00tRzk1NUZaRERJTlMiLCJTTS1HOTUwRlpSRElOUyIsIlNNLUc5MzBGWkRVSU5TIiwiU00tRzYxMUZaREZJTlMiLCJTTS1HNjExRlpERElOUyIsIlNNLUc5NTBGWkRESU5TIl19fX19",
    "epp_rejection_reasons": []
}

function compare(actual, expected) {
    helper.getDiffDiv(actual, expected);
}

compare(actual, expected);