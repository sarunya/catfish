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
let overallActualJson = null;
let overallExpectedJson = null;

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

function _clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function _findNoOfLeadingSpaces(str) {
    let pttrn = /^\s*/;
    return str.match(pttrn)[0].length;
}

function _replaceAll (str, pattern, replace) {
    return str.replace(new RegExp(pattern, 'g'), replace);
}

function replaceHtmlStrings(str) {
    if(str) {
        str = _replaceAll(str, "\\\\","\\");
        str = _replaceAll(str, "&",";&amp;");
        str = _replaceAll(str, "<","&lt;");
        str = _replaceAll(str, ">","&gt;");
    }
    return str;
}

function _prettyJson(json, indentation, color, comma="") {
    const me = this;
    let linesInJson = 1;
    let jsonStr = JSON.stringify(json, null, indentation);
    jsonStr = replaceHtmlStrings(jsonStr);
    if (indentation && (_isJSON(json) || (_isArray(json) && json.length > 0))) {
        let jsonStrArr = jsonStr.split("\n");
        jsonStr = jsonStrArr[0] + "<br/>";
        let index = 1;
        for (index = 1; index < jsonStrArr.length - 1; index++) {
            let leadingSpace = _findNoOfLeadingSpaces(jsonStrArr[index]);
            leadingSpace = (leadingSpace/10) - 1;
            leadingSpace = indentation + (4 * leadingSpace);
            jsonStr += `<div  style="background-color: ${color}"><code>${space.repeat(leadingSpace)}${jsonStrArr[index].trim()}</code><br/></div>`;
            ++linesInJson
        }
        jsonStr += `<div  style="background-color: ${color}"><code>${space.repeat(indentation-4)}` + jsonStrArr[index] + comma+"</code></div>";
        ++linesInJson;
    } else {
        jsonStr = jsonStr+comma;
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
    data2 = _clone(data2);
    for (var i = 0; i < data1.length; i++) {
        let index = data2.indexOf(data1[i]);
        if (index == -1) {
            difference.push(data1[i]);
        } else {
            _removeFromArray(data2, index);
        }
    }
    return difference;
}

function _intersection(data1, data2) {
    let intersection = [];
    for (var i = 0; i < data1.length; i++) {
        if (data2.indexOf(data1[i]) >= 0 && intersection.indexOf(data1[i]) < 0) {
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
        if ((aVal != null && eVal != null  && typeof aVal == typeof eVal) || (aVal == null && eVal == null)){
            if (_isJSON(aVal) && _isJSON(eVal)) {
                let diff = compareTwoJsonObject(aVal, eVal, indentation + 4);
                acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : ${diff[0]}${acomma}</code><br/>`;
                expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : ${diff[1]}${ecomma}</code><br/>`;
            } else if (_isArray(aVal) && _isArray(eVal)) {
                let diff = compareArray(aVal, eVal, eKey, indentation);
                acutalJsonString+=diff[0];
                expectedJsonString+=diff[1];
            } else {
                if (aVal != eVal) {
                    acolor = wrongColor;
                    ecolor = wrongColor;
                } else {
                    acolor = resetColor;
                    ecolor = resetColor;
                }
                acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(aVal, indentation+4, acolor, acomma)[0]}</code></div>`;
                expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${_prettyJson(eVal, indentation+4, ecolor, ecomma)[0]}</code></div>`;
            }
        } else if (typeof actual[eKey] == "undefined" || aVal == null) {
            ecolor = extraColor
            let prettyVal = _prettyJson(eVal, indentation + 4, ecolor, ecomma);
            acutalJsonString += lineBreak.repeat(prettyVal[1]);
            expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}</code></div>`;
        }  else if (typeof expected[eKey] == "undefined" || eVal == null) {
            acolor = extraColor
            let prettyVal = _prettyJson(aVal, indentation + 4, acolor, acomma);
            expectedJsonString += lineBreak.repeat(prettyVal[1]);
            acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}</code></div>`;
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
        let prettyVal = _prettyJson(actual[aKey], indentation + 4, acolor, acomma);
        expectedJsonString += lineBreak.repeat(prettyVal[1]);
        if (missingKeysInActual.indexOf(aKey) == missingKeysInActual.length - 1) {
            acomma = "";
        }
        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${aKey} : ${prettyVal[0]}</code></div>`;
    }

    acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(initindentation)}}</code>`;
    expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(initindentation)}}</code>`;

    if (initindentation == 0) {
        acutalJsonString += "</br>";
        expectedJsonString += "</br>";
    }
    return [acutalJsonString, expectedJsonString];
}

function compareArray(aVal, eVal, eKey, indentation) {
    let acolor = resetColor;
    let ecolor = resetColor;
    let acutalJsonString = "";
    let expectedJsonString = "";
    let acomma = "";
    let ecomma = "";
    if(eKey) {
        eKey = space.repeat(indentation)+eKey+":"; 
    } else {
        eKey = "";
    }
    if (aVal.length == 0 && eVal.length == 0) {
        acolor = resetColor;
        ecolor = resetColor;
        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${eKey}${_prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
        expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${eKey}${_prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
    } else if (aVal.length == 0) {
        ecolor = wrongColor;
        acolor = wrongColor;
        let prettyVal = _prettyJson(eVal, indentation + 4, ecolor, ecomma);
        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${eKey}${_prettyJson(aVal, indentation, acolor, acomma)[0]}</code></div>`;
        acutalJsonString += lineBreak.repeat(prettyVal[1] - 1);
        expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${eKey}${prettyVal[0]}</code></div>`;
    } else if (eVal.length == 0) {
        ecolor = wrongColor;
        acolor = wrongColor;
        let prettyVal = _prettyJson(aVal, indentation + 4, acolor, acomma);
        expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${eKey}${_prettyJson(eVal, indentation, ecolor, ecomma)[0]}</code></div>`;
        expectedJsonString += lineBreak.repeat(prettyVal[1] - 1);
        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${eKey}${prettyVal[0]}</code></div>`;
    } else if (typeof aVal[0] == typeof eVal[0]) {
        expectedJsonString += `<div  style="background-color: ${resetColor}"><code>${eKey}[</code><br/></div>`;
        acutalJsonString += `<div  style="background-color: ${resetColor}"><code>${eKey}[</code><br/></div>`;
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
                let diff = _prettyJson(eVal[j], indentation + 8, extraColor, ecomma);
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
            let min = (aAlone.length > eAlone.length) ? eAlone.length: aAlone.length;
            for (let j = 0; j < aAlone.length; j++) {
                let aOnly = aAlone[j];
                if(min > j) {
                    acolor = wrongColor;
                } else {
                    acolor = extraColor;
                }
                acomma = (j==aAlone.length-1)?"":acomma;
                acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation+4)}${_prettyJson(aOnly, indentation+4, wrongColor)[0]}${acomma}</code><br/></div>`;
            }
            for (let j = 0; j < eAlone.length; j++) {
                let eOnly = eAlone[j];
                if(min > j) {
                    ecolor = wrongColor;
                } else {
                    ecolor = extraColor;
                }
                ecomma = (j==eAlone.length-1)?"":ecomma;
                expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation+4)}${_prettyJson(eOnly, indentation+4, wrongColor)[0]}${ecomma}</code><br/></div>`;
            }
            if (isaHigher) {
                while (diff) {
                    expectedJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation+4)}</code><br/></div>`;
                    --diff;
                }
            } else {
                while (diff) {
                    acutalJsonString += `<div  style="background-color: ${resetColor}"><code>${space.repeat(indentation+4)}</code><br/></div>`;
                    --diff;
                }
            }
        }
        acolor = resetColor;
        ecolor = resetColor;
        acutalJsonString += `<code style="background-color: ${acolor}" >${space.repeat(indentation)}]${acomma}</code><br/>`;
        expectedJsonString += `<code style="background-color: ${ecolor}" >${space.repeat(indentation)}]${ecomma}</code><br/>`;
    } else {
        ecolor = wrongColor;
        acolor = wrongColor;
        acomma = ",";
        ecomma = ",";
        let adiff, ediff ;
        let max = (aVal.length>eVal.length)?aVal.length:eVal.length;
        expectedJsonString += `<div  style="background-color: ${resetColor}"><code>${eKey}[</code><br/></div>`;
        acutalJsonString += `<div  style="background-color: ${resetColor}"><code>${eKey}[</code><br/></div>`;
        indentation = indentation+4;
        for(let j=0;j<max;j++) {
            acolor = (j==eVal.length)?extraColor:acolor;
            ecolor = (j==aVal.length)?extraColor:ecolor;
            acomma = (j==aVal.length-1)?"": acomma;
            ecomma = (j==eVal.length-1)?"": ecomma;
            if(j<aVal.length) {
                adiff = _prettyJson(aVal[j], indentation+4, acolor, acomma);
                acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey}${adiff[0]}</code></div>`;
                adiff = adiff[1];
            }else {
                adiff = 0;
            }

            if(j<eVal.length) {
                ediff = _prettyJson(eVal[j], indentation+4, ecolor, ecomma);
                expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey}${ediff[0]}</code></div>`;
                ediff = ediff[1];
            }else {
                ediff = 0;
            }

            if(adiff > ediff) {
                expectedJsonString += lineBreak.repeat(adiff - ediff);
            } else if(adiff < ediff) {
                acutalJsonString += lineBreak.repeat(ediff - adiff);
            }
        }
        indentation = indentation-4;
        acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}]${acomma}</code><br/>`;
        expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}]${ecomma}</code><br/>`;
    }
    return [acutalJsonString, expectedJsonString];
}

function compare(actual, expected, indentation) {
    console.log(actual, expected, typeof actual);
    let data = [];
    if(_isJSON(actual)) {
        data = compareTwoJsonObject(actual, expected, 4);
    } else if(_isArray(actual) && _isArray(expected)) {
        data = compareArray(actual, expected, null, 0);
    }
    return data;
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
    actual = JSON.parse(actual);
    expected = JSON.parse(expected);
    _compareAndPopualateResult(actual, expected);
}

function _compareAndPopualateResult(actual, expected) {
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

function share() {
    let actual = $('#textarealeft').val();
    let expected = $('#textarearight').val();
    actual = JSON.parse(actual);
    expected = JSON.parse(expected);

    //store in backend and get a short id url
    createJsonShare(actual, expected);
}



// Helper to get hash from end of URL or generate a random one.
function loadIfSaved(newDocument = false) {
    let host = window.location.origin;
    console.log(host, window.location.search);
    getSavedJsonShareId(window.location.search);
}

function getSavedJsonShareId(search) {
    let id = getParameterByName("id", search);
    getJsonShareData(id);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function createJsonShare(actual, expected) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("hiding");
            $('#loading').hide();
            console.log(this.responseText);
        }
    };

    let host = window.location.origin;
    if (host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("POST", host + '/json-share', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send(JSON.stringify({
        actual: actual,
        expected: expected
    }));

	$('#loading').show();
}

function getJsonShareData(jsonshareid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText, typeof this.responseText);
            let response = JSON.parse(this.responseText); 
            _compareAndPopualateResult(response.actual, response.expected);
            $('#loading').hide();
        }
    };

    let host = window.location.origin;
    if (host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("GET", host + '/json-share-data?id='+jsonshareid, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send();
	$('#loading').show();
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