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
let lineBreak = "<span></span></br>";

class AssertionHelper {

    //check if given json is an array
    _isJSON(x) {
        try {
            return (_.isObjectLike(x) && JSON.parse(JSON.stringify(x)) && !_.isArray(x));
        } catch (e) {
            return false;
        }
    }

    _prettyJson(json, indentation, color) {
        const me = this;
        let linesInJson = 1;
        let jsonStr = JSON.stringify(json, null, 5);
        if (indentation && me._isJSON(json)) {
            let jsonStrArr = jsonStr.split("\n");
            jsonStr = jsonStrArr[0] + "<br/>";
            let index = 1;
            for (index = 1; index < jsonStrArr.length - 1; index++) {
                jsonStr += `<span background-color="${color}" padding-left: ${indentation}em>` + jsonStrArr[index] + "</span><br/>";
                ++linesInJson
            }
            jsonStr += `<span background-color="${color}" padding-left: ${indentation}em>` + jsonStrArr[index] + "</span>";
            ++linesInJson;
        }
        return [jsonStr, linesInJson];
    }

    _removeFromArray(array, index) {
        array.splice(index, 1);
    }

    compareTwoJsonObject(actual, expected, indentation) {
        const me = this;
        let initindentation = indentation || 0;
        let actualKeys = _.keys(actual);
        let expectedKeys = _.keys(expected);
        let acolor = resetColor;
        let ecolor = resetColor;
        let acutalJsonString = `<span style="background-color: ${acolor}" padding-left: ${initindentation}em>{</span><br/>`;
        let expectedJsonString = `<span style="background-color: ${ecolor}" padding-left: ${initindentation}em>{</span><br/>`;
        let missingKeysInActual = _.difference(actualKeys, expectedKeys);
        let acomma = ",";
        let ecomma = ",";
        if(initindentation) {
            acutalJsonString = "{</br>";
            expectedJsonString = "{</br>";
        }
        indentation = indentation || 4;

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
                if (me._isJSON(aVal)) {
                    let diff = me.compareTwoJsonObject(aVal, eVal, indentation+4);
                    acutalJsonString += `<span style="background-color: ${resetColor}" padding-left: ${indentation}em>${eKey} : ${diff[0]}${acomma}</span><br/>`;
                    expectedJsonString += `<span style="background-color: ${resetColor}" padding-left: ${indentation}em>${eKey} : ${diff[1]}${ecomma}</span><br/>`;
                } else {
                    if (aVal != eVal) {
                        acolor = wrongColor;
                        ecolor = wrongColor;
                    } else {
                        acolor = resetColor;
                        ecolor = resetColor;
                    }
                    acutalJsonString += `<span style="background-color: ${acolor}" padding-left: ${indentation}em>${eKey} : ${me._prettyJson(aVal, indentation+tabSpace, acolor)[0]}${acomma}</span><br/>`;
                    expectedJsonString += `<span style="background-color: ${ecolor}" padding-left: ${indentation}em>${eKey} : ${me._prettyJson(eVal, indentation+tabSpace, ecolor)[0]}${ecomma}</span><br/>`;
                }
            } else if (typeof actual[eKey] == "undefined") {
                ecolor = extraColor
                let prettyVal = me._prettyJson(eVal, indentation + tabSpace, ecolor);
                acutalJsonString += lineBreak.repeat(prettyVal[1]);
                expectedJsonString += `<span style="background-color: ${ecolor}" padding-left: ${indentation}em>${eKey} : ${prettyVal[0]}${ecomma}</span><br/>`;
            } else {
                acolor = wrongColor;
                ecolor = wrongColor;
                let actualErr = me._prettyJson(aVal, indentation + tabSpace, acolor);
                let expectedErr = me._prettyJson(eVal, indentation + tabSpace, ecolor);
                let acbr = 0,
                    expbr = 0;
                if (actualErr[1] < expectedErr[1]) {
                    acbr = expectedErr[1] - actualErr[1];
                } else if (expectedErr[1] < actualErr[1]) {
                    expbr = actualErr[1] - expectedErr[1];
                }
                acutalJsonString += `<span style="background-color: ${acolor}" padding-left: ${indentation}em>${eKey} : ${actualErr[0]}${acomma}</span></br>${lineBreak.repeat(acbr)}`;
                expectedJsonString += `<span style="background-color: ${ecolor}" padding-left: ${indentation}em>${eKey} : ${expectedErr[0]}${ecomma}</span></br>${lineBreak.repeat(expbr)}`;
            }
        })

        _.each(missingKeysInActual, function (aKey) {
            acolor = extraColor
            let data = me._prettyJson(actual[aKey], indentation + tabSpace, acolor);
            expectedJsonString += `<br/>`;
            if (_.indexOf(missingKeysInActual, aKey) == missingKeysInActual.length - 1) {
                acomma = "";
            }
            acutalJsonString += `<span style="background-color: ${acolor}" padding-left: ${indentation}em>${aKey} : ${data[0]}${acomma}</span><br/>`;
        })

        acutalJsonString += `<span style="background-color: ${resetColor}" padding-left: ${initindentation}em>}</span>`;
        expectedJsonString += `<span style="background-color: ${resetColor}" padding-left: ${initindentation}em>}</span>`;

        if(initindentation==0) {
            acutalJsonString+= "</br>";
            expectedJsonString+= "</br>";
        }
        return [acutalJsonString, expectedJsonString];
    }

    getDiffDiv(actual, expected, indentation) {
        const me = this;
        let diff = me.compareTwoJsonObject(actual, expected, indentation);
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
            span{
                counter-increment: line;
            }
            span:before{
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
}



module.exports = AssertionHelper;