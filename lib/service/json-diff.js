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

class AssertionHelper {


    _isObject(a) {
        return (!!a) && (a.constructor === Object);
    };

    _isArray(a) {
        return (!!a) && (a.constructor === Array);
    };

    //check if given json is an array
    _isJSON(x) {
        const me = this;
        try {
            return (me._isObject(x) && JSON.parse(JSON.stringify(x)) && !me._isArray(x));
        } catch (e) {
            return false;
        }
    }

    _prettyJson(json, indentation, color) {
        const me = this;
        let linesInJson = 1;
        let jsonStr = JSON.stringify(json, null, indentation);
        if (indentation && (me._isJSON(json) || (me._isArray(json) && json.length > 0))) {
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

    _removeFromArray(array, index) {
        array.splice(index, 1);
    }

    _keys(object) {
        return Object.keys(object);
    }

    _difference(data1, data2) {
        let difference = [];
        for(var i=0;i<data1.length;i++) {
            if(data2.indexOf(data1[i]) == -1) {
                difference.push(data1[i]);
            }
        }
        return difference;
    }

    _intersection(data1, data2) {
        let intersection = [];
        for(var i=0;i<data1.length;i++) {
            if(data2.indexOf(data1[i]) >= 0) {
                intersection.push(data1[i]);
            }
        }
        return intersection;
    }

    compareTwoJsonObject(actual, expected, indentation) {
        const me = this;
        let initindentation = indentation - 4;
        let actualKeys = me._keys(actual);
        let expectedKeys = me._keys(expected);
        let acolor = resetColor;
        let ecolor = resetColor;
        let acutalJsonString = `<code style="background-color: ${acolor}" >{</code><br/>`;
        let expectedJsonString = `<code style="background-color: ${ecolor}" >{</code><br/>`;
        let missingKeysInActual = me._difference(actualKeys, expectedKeys);
        let acomma = ",";
        let ecomma = ",";
        if (initindentation) {
            acutalJsonString = "{</br>";
            expectedJsonString = "{</br>";
        }

        for(let i=0; i<expectedKeys.length; i++) {
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
                if (me._isJSON(aVal)) {
                    let diff = me.compareTwoJsonObject(aVal, eVal, indentation + 4);
                    acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : ${diff[0]}${acomma}</code><br/>`;
                    expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : ${diff[1]}${ecomma}</code><br/>`;
                } else if (me._isArray(aVal)) {
                    if (aVal.length == 0 && eVal.length == 0) {
                        acolor = resetColor;
                        ecolor = resetColor;
                        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${me._prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
                        expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${me._prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
                    } 
                    else if (aVal.length == 0 ) {
                        ecolor = wrongColor;
                        acolor = wrongColor;
                        let prettyVal = me._prettyJson(eVal, indentation + 4, ecolor);
                        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${me._prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
                        acutalJsonString += lineBreak.repeat(prettyVal[1] - 1);
                        expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${ecomma}</code><br/></div>`;
                    } 
                    else if (eVal.length == 0) {
                        ecolor = wrongColor;
                        acolor = wrongColor;
                        let prettyVal = me._prettyJson(aVal, indentation + 4, acolor);
                        expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${me._prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
                        expectedJsonString += lineBreak.repeat(prettyVal[1] - 1);
                        acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${acomma}</code><br/></div>`;
                    }
                    else if (typeof aVal[0] == typeof eVal[0]) {
                        expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : [</code><br/>`;
                        acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation)}${eKey} : [</code><br/>`;
                        if (me._isJSON(aVal[0])) {
                            let i = 0, j = 0;
                            while(i<aVal.length && j<eVal.length) {
                                let diff = me.compareTwoJsonObject(aVal[i], eVal[j], indentation + 8);
                                acomma = ",";
                                ecomma = ",";
                                if(i==aVal.length-1) {
                                    acomma = "";
                                }
                                if(j==eVal.length-1) {
                                    ecomma = "";
                                }
                                acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation+4)}${diff[0]}${acomma}</code><br/>`;
                                expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation+4)}${diff[1]}${ecomma}</code><br/>`;
                                ++i; ++j;
                            }
                            while(i<aVal.length) {
                                let diff = me._prettyJson(aVal[i], indentation + 8, extraColor);
                                if(i==aVal.length-1) {
                                    acomma = "";
                                }
                                acutalJsonString += `<div  style="background-color: ${extraColor}"><code>${space.repeat(indentation+4)}${diff[0]}${acomma}</code><br/></div>`;
                                expectedJsonString += lineBreak.repeat(diff[1]);
                                ++i; 
                            }
                            while(j < eVal.length) {
                                if(j==eVal.length-1) {
                                    ecomma = "";
                                }
                                let diff = me._prettyJson(eVal[j], indentation + 4, extraColor);
                                expectedJsonString += `<div  style="background-color: ${extraColor}"><code>${space.repeat(indentation+4)}${diff[0]}${acomma}</code><br/></div>`;
                                acutalJsonString += lineBreak.repeat(diff[1]);
                                ++j; 
                            }
                        } else {
                            let common = me._intersection(aVal, eVal);
                            let aAlone = me._difference(aVal, eVal);
                            let eAlone = me._difference(eVal, aVal);
                            for(let j=0; j<common.length;j++) {
                                let commonVal = common[j];
                                acutalJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation+4)}${me._prettyJson(commonVal, indentation+4, resetColor)[0]}${acomma}</code><br/>`;
                                expectedJsonString += `<code style="background-color: ${resetColor}" >${space.repeat(indentation+4)}${me._prettyJson(commonVal, indentation+4, resetColor)[0]}${ecomma}</code><br/>`;
                            }
                            let diff = (aAlone.length > eAlone.length) ? (aAlone.length - eAlone.length) : eAlone.length - aAlone.length;
                            let isaHigher = (aAlone.length > eAlone.length) ? true : false;
                            for(let j=0; j<aAlone.length; j++)  {
                                let aOnly = aAlone[j];
                                acutalJsonString += `<code style="background-color: ${wrongColor}" >${space.repeat(indentation+4)}${me._prettyJson(aOnly, indentation+4, wrongColor)[0]}${acomma}</code><br/>`;
                            }
                            for(let j=0; j<eAlone.length; j++)  {
                                let eOnly = eAlone[j];
                                expectedJsonString += `<code style="background-color: ${wrongColor}" >${space.repeat(indentation+4)}${me._prettyJson(eOnly, indentation+4, wrongColor)[0]}${ecomma}</code><br/>`;
                            }
                            if (isaHigher) {
                                while (diff) {
                                    expectedJsonString += `<code style="background-color: ${wrongColor}" >${space.repeat(indentation+4)} ${ecomma}</code><br/>`;
                                    --diff;
                                }
                            } else {
                                while (diff) {
                                    expectedJsonString += `<code style="background-color: ${wrongColor}" >${space.repeat(indentation+4)} ${ecomma}</code><br/>`;
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
                    acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${me._prettyJson(aVal, indentation, acolor)[0]}${acomma}</code><br/></div>`;
                    expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${me._prettyJson(eVal, indentation, ecolor)[0]}${ecomma}</code><br/></div>`;
                }
            } else if (typeof actual[eKey] == "undefined") {
                ecolor = extraColor
                let prettyVal = me._prettyJson(eVal, indentation + 4, ecolor);
                acutalJsonString += lineBreak.repeat(prettyVal[1]);
                expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${prettyVal[0]}${ecomma}</code><br/></div>`;
            } else {
                acolor = wrongColor;
                ecolor = wrongColor;
                let actualErr = me._prettyJson(aVal, indentation + 4, acolor);
                let expectedErr = me._prettyJson(eVal, indentation + 4, ecolor);
                let acbr = 0,
                    expbr = 0;
                if (actualErr[1] < expectedErr[1]) {
                    acbr = expectedErr[1] - actualErr[1];
                } else if (expectedErr[1] < actualErr[1]) {
                    expbr = actualErr[1] - expectedErr[1];
                }
                acutalJsonString += `<div  style="background-color: ${acolor}"><code>${space.repeat(indentation)}${eKey} : ${actualErr[0]}${acomma}</code></br></div>${lineBreak.repeat(acbr)}`;
                expectedJsonString += `<div  style="background-color: ${ecolor}"><code>${space.repeat(indentation)}${eKey} : ${expectedErr[0]}${ecomma}</code></br></div>${lineBreak.repeat(expbr)}`;
            }
        }

        for(let i=0; i<missingKeysInActual.length; i++){
            let aKey = missingKeysInActual[i];
            acolor = extraColor
            let prettyVal = me._prettyJson(actual[aKey], indentation + 4, acolor);
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

    getDiffDiv(actual, expected, indentation) {
        const me = this;
        let diff = me.compareTwoJsonObject(actual, expected, 4);
        let value = `<style>
        /* Split the screen in half */
        .divideit {
        height: 90%;
        width: 50%;
        position: fixed;
        z-index: 1;
        top: 0;
        overflow-x: scroll;
        
        padding-top: 20px;
        }

        /* Control the left side */
        .leftside {
        left: 0;
        background-color: bisque;
        }

        /* Control the right side */
        .rightside {
        right: 0;
        background-color: white;
        }

        body{
            overflow: scroll;
        }

        /* If you want the content centered horizontally and vertically */
        .centerpos {
            position: relative;
            margin: 0 auto;
            display: block;
            align: center;
        }
        
        pre.codeblock.left {
            width: 45%;
            display: inline-block;
            vertical-align: top;
            margin-left: 1em;
        }

        pre.codeblock.right {
            width: 45%;
            display: inline-block;
            vertical-align: top;
            margin-left: 2em;
        }

        pre.codeBlock, div.codeBlock {
            background-color: #eee;
            overflow: auto;
            margin: 0 0 1em;
            padding: .5em 1em;
        }

        div, pre {
            margin: 0;
            padding: 0;
            border: 0;
            font: inherit;
            vertical-align: baseline;
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
                border-color:  #484B49;
                padding: 0 .5em;
                margin-right: .5em;
                color: #484B49;
                -webkit-user-select: none;
            }

        </style>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
            </head>
            <body>
                    <div class="centerpos">
                        <pre class="codeblock left">${diff[0]}</pre>
                        <pre class="codeblock right">${diff[1]}</pre>
                    </div>
                </div>
            </body>
        </html>`

        console.log(value);
    }
}



module.exports = AssertionHelper;