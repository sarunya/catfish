const _ = require("lodash");

/**
 * Asserts json, array, array of json and other primitive types
 * Provides both full deep assertion and contains deep assertion
 * Ability to support Soft Assertion is also added
 * 
 * @class Assertion
 * @author sarunya.d
 */

let tabSpace = 5;
let wrongColor = "red";
let extraColor = "green";
let resetColor = "none";
let lineBreak = "<code></code></br>";
let space = "&nbsp;";

//check if given json is an array
function _isJSON(x) {
    try {
        return (_.isObjectLike(x) && JSON.parse(JSON.stringify(x)) && !_.isArray(x));
    } catch (e) {
        return false;
    }
}

function _prettyJson(json, indentation, color) {
    const me = this;
    let linesInJson = 1;
    let jsonStr = JSON.stringify(json, null, indentation);
    if (indentation && _isJSON(json)) {
        let jsonStrArr = jsonStr.split("\n");
        jsonStr = jsonStrArr[0] + "<br/>";
        let index = 1;
        for (index = 1; index < jsonStrArr.length - 1; index++) {
            jsonStr += `<code background-color="${color}" >${space.repeat(indentation)}` + jsonStrArr[index].trim() + "</code><br/>";
            ++linesInJson
        }
        jsonStr += `<code background-color="${color}" >${space.repeat(indentation-4)}` + jsonStrArr[index] + "</code>";
        ++linesInJson;
    } else {
        jsonStr = jsonStr;
    }
    return [jsonStr, linesInJson];
}

function _removeFromArray(array, index) {
    array.splice(index, 1);
}

function compareTwoJsonObject(actual, expected, indentation) {
    const me = this;
    let initindentation = indentation - 4;
    let actualKeys = _.keys(actual);
    let expectedKeys = _.keys(expected);
    let acolor = resetColor;
    let ecolor = resetColor;
    let acutalJsonString = `<code style="background-color: ${acolor}" >{</code><br/>`;
    let expectedJsonString = `<code style="background-color: ${ecolor}" >{</code><br/>`;
    let missingKeysInActual = _.difference(actualKeys, expectedKeys);
    let acomma = ",";
    let ecomma = ",";
    if (initindentation) {
        acutalJsonString = "{</br>";
        expectedJsonString = "{</br>";
    }

    _.each(expectedKeys, function (eKey) {
        let aVal = actual[eKey];
        let eVal = expected[eKey];
        if (_.indexOf(expectedKeys, eKey) == expectedKeys.length - 1) {
            ecomma = "";
            if (missingKeysInActual.length == 0) {
                acomma = "";
            }
        }
        if (typeof aVal == typeof eVal) {
            if (_isJSON(aVal)) {
                let diff = compareTwoJsonObject(aVal, eVal, indentation + 4);
                acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : ${diff[0]}${acomma}</code><br/>`;
                expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : ${diff[1]}${ecomma}</code><br/>`;
            } else if (_.isArray(aVal)) {
                if (aVal.length == 0 && eVal.length == 0) {
                    acolor = resetColor;
                    ecolor = resetColor;
                    acutalJsonString += `<code style="background-color: ${acolor}" >${space.repeat(indentation)}${eKey} : ${_prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/>`;
                    expectedJsonString += `<code style="background-color: ${ecolor}" >${space.repeat(indentation)}${eKey} : ${_prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/>`;
                } else {

                }

            } else {
                if (aVal != eVal) {
                    acolor = wrongColor;
                    ecolor = wrongColor;
                } else {
                    acolor = resetColor;
                    ecolor = resetColor;
                }
                acutalJsonString += `<code style="background-color: ${acolor}" >${space.repeat(indentation)}${eKey} : ${_prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/>`;
                expectedJsonString += `<code style="background-color: ${ecolor}" >${space.repeat(indentation)}${eKey} : ${_prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/>`;
            }
        } else if (typeof actual[eKey] == "undefined") {
            ecolor = extraColor
            let prettyVal = _prettyJson(eVal, indentation + 4, ecolor);
            acutalJsonString += lineBreak.repeat(prettyVal[1]);
            expectedJsonString += `<code style="background-color: ${ecolor}" >${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${ecomma}</code><br/>`;
        } else {
            acolor = wrongColor;
            ecolor = wrongColor;
            let actualErr = _prettyJson(aVal, indentation + 4, acolor);
            let expectedErr = _prettyJson(eVal, indentation + 4, ecolor);
            let acbr = 0,
                expbr = 0;
            if (actualErr[1] < expectedErr[1]) {
                acbr = expectedErr[1] - actualErr[1];
            } else if (expectedErr[1] < actualErr[1]) {
                expbr = actualErr[1] - expectedErr[1];
            }
            acutalJsonString += `<code style="background-color: ${acolor}" >${space.repeat(indentation)}${eKey} : ${actualErr[0]}${acomma}</code></br>${lineBreak.repeat(acbr)}`;
            expectedJsonString += `<code style="background-color: ${ecolor}" >${space.repeat(indentation)}${eKey} : ${expectedErr[0]}${ecomma}</code></br>${lineBreak.repeat(expbr)}`;
        }
    })

    _.each(missingKeysInActual, function (aKey) {
        acolor = extraColor
        let prettyVal = _prettyJson(actual[aKey], indentation + 4, acolor);
        expectedJsonString += lineBreak.repeat(prettyVal[1]);
        if (_.indexOf(missingKeysInActual, aKey) == missingKeysInActual.length - 1) {
            acomma = "";
        }
        acutalJsonString += `<code style="background-color: ${acolor}" >${space.repeat(indentation)}${aKey} : ${data[0]}${acomma}</code><br/>`;
    })

    acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(initindentation)}}</code>`;
    expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(initindentation)}}</code>`;

    if (initindentation == 0) {
        acutalJsonString += "</br>";
        expectedJsonString += "</br>";
    }
    return [acutalJsonString, expectedJsonString];
}

function getDiffDiv(actual, expected, indentation) {
    const me = this;
    let diff = compareTwoJsonObject(actual, expected, 4);
    let value = `<style>
        /* Split the screen in half */
        .split {
        height: 100%;
        width: 50%;
        position: fixed;
        z-index: 1;
        top: 0;
        overflow-x: hidden;
        padding-top: 20px;
        }

        /* Control the left side */
        .left {
        left: 0;
        background-color: bisque;
        overflow: scroll;
        }

        /* Control the right side */
        .right {
        right: 0;
        background-color: white;
        overflow: scroll;
        }

        /* If you want the content centered horizontally and vertically */
        .centered {
        position: absolute;
        top: 5%;
        left: 10%;
        f
        text-align: left;
        }
        pre{
            counter-reset: line;
            }
            code{
                counter-increment: line;
            }
            code:before{
                content: counter(line);
                display: inline-block;
                width: 1.0em; /* Fixed width */
                border-right: 2px solid #ddd;
                padding: 0 .5em;
                margin-right: .5em;
                color: #888;
                -webkit-user-select: none;
            }

        </style>
        <div class="split left">
            <div class="centered">
                
                <h2>Jane Flex</h2>
                <pre>${diff[0]}</pre>
            </div>
            </div>

            <div class="split right">
            <div class="centered">
                <h2>John Doe</h2>
                <pre>${diff[1]}</pre>
            </div>
        </div>`

    console.log(value);
}