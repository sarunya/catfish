/*******************************************************************************
 *
 * Copyright 2015-2017 Zack Grossbart
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ******************************************************************************/
'use strict';

/**
 * Asserts json, array, array of json and other primitive types
 * Provides both full deep assertion and contains deep assertion
 * Ability to support Soft Assertion is also added
 * 
 * @class Assertion
 * @author sarunya.d
 */

let tabSpace = 5;
let wrongColor = "#FA8383";
let extraColor = "#5ABB6A";
let resetColor = "none";
let lineBreak = "<code></code></br>";
let space = "&nbsp;";

function _isObject(a) {
    return (!!a) && (a.constructor === Object);
};

function _isArray(a) {
    return (!!a) && (a.constructor === Array);
};

//check if given json is an array
function _isJSON(x) {
    const me = this;
    try {
        return (_isObject(x) && JSON.parse(JSON.stringify(x)) && !_isArray(x));
    } catch (e) {
        return false;
    }
}

function _prettyJson(json, indentation, color, comma="") {
    const me = this;
    let linesInJson = 1;
    let jsonStr = JSON.stringify(json, null, indentation);
    if (indentation && (_isJSON(json) || (_isArray(json) && json.length > 0))) {
        let jsonStrArr = jsonStr.split("\n");
        jsonStr = jsonStrArr[0] + "<br/>";
        let index = 1;
        for (index = 1; index < jsonStrArr.length - 1; index++) {
            jsonStr += `<div  style="background-color: ${color}"><code>${space.repeat(indentation)}` + jsonStrArr[index].trim() + "</code><br/></div>";
            ++linesInJson
        }
        jsonStr += `<div  style="background-color: ${color}"><code>${space.repeat(indentation-4)}` + jsonStrArr[index] + comma+"</code></div>";
        ++linesInJson;
    } else {
        jsonStr = jsonStr;
    }
    return [jsonStr, linesInJson];
}

function _removeFromArray(array, index) {
    array.splice(index, 1);
}

function _keys(object) {
    return Object.keys(object);
}

function _difference(data1, data2) {
    let difference = [];
    for (var i = 0; i < data1.length; i++) {
        if (data2.indexOf(data1[i]) == -1) {
            difference.push(data1[i]);
        }
    }
    return difference;
}

function _intersection(data1, data2) {
    let intersection = [];
    for (var i = 0; i < data1.length; i++) {
        if (data2.indexOf(data1[i]) >= 0) {
            intersection.push(data1[i]);
        }
    }
    return intersection;
}

function compareTwoJsonObject(actual, expected, indentation) {
    const me = this;
    let initindentation = indentation - 4;
    let actualKeys = _keys(actual);
    let expectedKeys = _keys(expected);
    let acolor = resetColor;
    let ecolor = resetColor;
    let acutalJsonString = `<code style="background-color: ${acolor}" >{</code><br/>`;
    let expectedJsonString = `<code style="background-color: ${ecolor}" >{</code><br/>`;
    let missingKeysInActual = _difference(actualKeys, expectedKeys);
    let acomma = ",";
    let ecomma = ",";
    if (initindentation) {
        acutalJsonString = "{</br>";
        expectedJsonString = "{</br>";
    }

    for (let i = 0; i < expectedKeys.length; i++) {
        let eKey = expectedKeys[i];
        let aVal = actual[eKey];
        let eVal = expected[eKey];
        if (expectedKeys.indexOf(eKey) == expectedKeys.length - 1) {
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
            } else if (_isArray(aVal)) {
                if (aVal.length == 0 && eVal.length == 0) {
                    acolor = resetColor;
                    ecolor = resetColor;
                    acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
                    expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
                } else if (aVal.length == 0) {
                    ecolor = wrongColor;
                    acolor = wrongColor;
                    let prettyVal = _prettyJson(eVal, indentation + 4, ecolor);
                    acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
                    acutalJsonString += lineBreak.repeat(prettyVal[1] - 1);
                    expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${ecomma}</code><br/></div>`;
                } else if (eVal.length == 0) {
                    ecolor = wrongColor;
                    acolor = wrongColor;
                    let prettyVal = _prettyJson(aVal, indentation + 4, acolor);
                    expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
                    expectedJsonString += lineBreak.repeat(prettyVal[1] - 1);
                    acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${acomma}</code><br/></div>`;
                } else if (typeof aVal[0] == typeof eVal[0]) {
                    expectedJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation)}${eKey} : [</code><br/></div>`;
                    acutalJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation)}${eKey} : [</code><br/></div>`;
                    if (_isJSON(aVal[0])) {
                        let i = 0,
                            j = 0;
                        while (i < aVal.length && j < eVal.length) {
                            let diff = compareTwoJsonObject(aVal[i], eVal[j], indentation + 8);
                            acomma = ",";
                            ecomma = ",";
                            if (i == aVal.length - 1) {
                                acomma = "";
                            }
                            if (j == eVal.length - 1) {
                                ecomma = "";
                            }
                            acutalJsonString += `<div  style="background-color: ${resetColor}"><code style="background-color: ${resetColor}" >${space.repeat(indentation+4)}${diff[0]}${acomma}</code><br/></div>`;
                            expectedJsonString += `<div  style="background-color: ${resetColor}"><code style="background-color: ${resetColor}" >${space.repeat(indentation+4)}${diff[1]}${ecomma}</code><br/></div>`;
                            ++i;
                            ++j;
                        }
                        while (i < aVal.length) {
                            if (i == aVal.length - 1) {
                                acomma = "";
                            }
                            let diff = _prettyJson(aVal[i], indentation + 8, extraColor, acomma);
                            acutalJsonString += `<div  style="background-color: ${extraColor}"><code>${space.repeat(indentation+4)}${diff[0]}</code></div>`; //${acomma}</code><br/></div>
                            expectedJsonString += lineBreak.repeat(diff[1]);
                            ++i;
                        }
                        while (j < eVal.length) {
                            if (j == eVal.length - 1) {
                                ecomma = "";
                            }
                            let diff = _prettyJson(eVal[j], indentation + 4, extraColor, ecomma);
                            expectedJsonString += `<div  style="background-color: ${extraColor}"><code>${space.repeat(indentation+4)}${diff[0]}</code></div>`; //${ecomma}</code><br/></div>
                            acutalJsonString += lineBreak.repeat(diff[1]);
                            ++j;
                        }
                    } else {
                        let common = _intersection(aVal, eVal);
                        let aAlone = _difference(aVal, eVal);
                        let eAlone = _difference(eVal, aVal);
                        for (let j = 0; j < common.length; j++) {
                            let commonVal = common[j];
                            acutalJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation+4)}${_prettyJson(commonVal, indentation+4, resetColor)[0]}${acomma}</code><br/></div>`;
                            expectedJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation+4)}${_prettyJson(commonVal, indentation+4, resetColor)[0]}${ecomma}</code><br/></div>`;
                        }
                        let diff = (aAlone.length > eAlone.length) ? (aAlone.length - eAlone.length) : eAlone.length - aAlone.length;
                        let isaHigher = (aAlone.length > eAlone.length) ? true : false;
                        for (let j = 0; j < aAlone.length; j++) {
                            let aOnly = aAlone[j];
                            acutalJsonString += `<div  style="background-color: ${extraColor}"><code>${space.repeat(indentation+4)}${_prettyJson(aOnly, indentation+4, wrongColor)[0]}${acomma}</code><br/></div>`;
                        }
                        for (let j = 0; j < eAlone.length; j++) {
                            let eOnly = eAlone[j];
                            expectedJsonString += `<div  style="background-color: ${extraColor}"><code>${space.repeat(indentation+4)}${_prettyJson(eOnly, indentation+4, wrongColor)[0]}${ecomma}</code><br/></div>`;
                        }
                        if (isaHigher) {
                            while (diff) {
                                expectedJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation+4)} ${ecomma}</code><br/></div>`;
                                --diff;
                            }
                        } else {
                            while (diff) {
                                acutalJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation+4)} ${ecomma}</code><br/></div>`;
                                --diff;
                            }
                        }
                    }
                    acolor = resetColor;
                    ecolor = resetColor;
                    acutalJsonString += `<code style="background-color: ${acolor}" >${space.repeat(indentation)}]${acomma}</code><br/>`;
                    expectedJsonString += `<code style="background-color: ${ecolor}" >${space.repeat(indentation)}]${ecomma}</code><br/>`;
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
                acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
                expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
            }
        } else if (typeof actual[eKey] == "undefined") {
            ecolor = extraColor
            let prettyVal = _prettyJson(eVal, indentation + 4, ecolor);
            acutalJsonString += lineBreak.repeat(prettyVal[1]);
            expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${ecomma}</code><br/></div>`;
        } else {
            acolor = wrongColor;
            ecolor = wrongColor;
            let actualErr = _prettyJson(aVal, indentation + 4, acolor, acomma);
            let expectedErr = _prettyJson(eVal, indentation + 4, ecolor, ecomma);
            let acbr = 0,
                expbr = 0;
            if (actualErr[1] < expectedErr[1]) {
                acbr = expectedErr[1] - actualErr[1];
            } else if (expectedErr[1] < actualErr[1]) {
                expbr = actualErr[1] - expectedErr[1];
            }
            acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${actualErr[0]}</code></div>${lineBreak.repeat(acbr)}`;
            expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${expectedErr[0]}</code></div>${lineBreak.repeat(expbr)}`;
        }
    }

    for (let i = 0; i < missingKeysInActual.length; i++) {
        let aKey = missingKeysInActual[i];
        acolor = extraColor
        let prettyVal = _prettyJson(actual[aKey], indentation + 4, acolor);
        expectedJsonString += lineBreak.repeat(prettyVal[1]);
        if (missingKeysInActual.indexOf(aKey) == missingKeysInActual.length - 1) {
            acomma = "";
        }
        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${aKey} : ${prettyVal[0]}${acomma}</code><br/></div>`;
    }

    acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(initindentation)}}</code>`;
    expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(initindentation)}}</code>`;

    if (initindentation == 0) {
        acutalJsonString += "</br>";
        expectedJsonString += "</br>";
    }
    return [acutalJsonString, expectedJsonString];
}

function compare(actual, expected, indentation) {
    const me = this;
    actual = JSON.parse(actual);
    expected = JSON.parse(expected);
    console.log(typeof actual);
    console.log(typeof expected);
    return compareTwoJsonObject(actual, expected, 4);
}

function showDiv(classname) {
    $(classname).show();
}

function hideDiv(classname) {
    $(classname).hide();
}


function compareAndPopualateResult() {
    let actual = $('#textarealeft').val();
    let expected = $('#textarearight').val();
    console.log(actual);
    console.log(expected);
    let diff = compare(actual, expected);

    $('#left').html(diff[0]);
    $('#right').html(diff[1]);
    showDiv(".centerpos");
    hideDiv(".initContainer");

}

function newDiff() {
    hideDiv(".centerpos");
    showDiv(".initContainer");
}

// $(document).keydown(function (event) {
//     if (event.keyCode === 78 || event.keyCode === 39) {
//         /*
//          * The N key or right arrow key
//          */
//         //jdd.highlightNextDiff();
//     } else if (event.keyCode === 80 || event.keyCode === 37) {
//         /*
//          * The P key or left arrow key
//          */
//         //jdd.highlightPrevDiff();
//     }
// });