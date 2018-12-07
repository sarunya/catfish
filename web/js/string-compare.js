let matrix = [];
let str1 , str2;

function showDiv(classname) {
    $(classname).show();
}

function hideDiv(classname) {
    $(classname).hide();
}


function newDiff() {
    hideDiv(".centerpos");
    showDiv(".initContainer");
}


function compareAndPopualateResult() {
    str1 = $('#textarealeft').val();
    str2 = $('#textarearight').val();
    let diff = compare();

    $('#left').html(diff[0]);
    $('#right').html(diff[1]);
    //showDiv(".centerpos");
    //hideDiv(".initContainer");

}

function compare() {
    lcs2DMatrix();
    return printLcs();
}

function max(a , b) {
    return (a>b)?a:b;
}

function lcs2DMatrix() {
    let n = str1.length;
    let m = str2.length;
    for(let i=0;i<=n;i++) {
        matrix[i] = [];
        for(let j=0; j<=m;j++) {
            if(i==0 || j==0) {
                matrix[i][j]  = 0;
            } else if(str1[i-1]==str2[j-1]) {
                matrix[i][j] = matrix[i-1][j-1] + 1;
            } else {
                matrix[i][j] = max(matrix[i-1][j], matrix[i][j-1]);
            }
        }
    }
}

function getHighlightedText(i1, i2, lcsi1, lcsi2) {
    let diffNum1 = lcsi1 - i1;
    let diffNum2 = lcsi2 - i2;
    let result1 = "";
    let result2 = "";
    console.log(diffNum1, diffNum2);
    if(diffNum1 == diffNum2) {
        result1 += `<span style="background-color: #f44a41">${str1.substr(i1, (diffNum2))}</span>`;
        result2 += `<span style="background-color: #f44a41">${str2.substr(i2, (diffNum1))}</span>`;
        i1 += diffNum2;
        i2 += diffNum1;        
        diffNum1 = 0;
        diffNum2 = 0;
    } else if(diffNum1 > diffNum2) {
        result1 += `<span style="background-color: #f44a41">${str1.substr(i1, (diffNum2))}</span>`;
        diffNum1 -= diffNum2;
        i1 += diffNum2;
    } else if(diffNum2 > diffNum1) {
        result2 += `<span style="background-color: #f44a41">${str2.substr(i2, (diffNum1))}</span>`;
        diffNum2 -= diffNum1;
        i2 += diffNum1;
    }

    if(i1 < lcsi1) {
        result1 += `<span style="background-color: #42f468">${str1.substr(i1, (diffNum1))}</span>`;
    }
    if(i2 < lcsi2) {
        result2 += `<span style="background-color: #42f468">${str2.substr(i2, (diffNum2))}</span>`;
    }
    return [result1, result2];
}


function getSentenceDiff(str1Index, str2Index) {
    let i1 = 0;
    let i2 = 0;
    let resultString1 = "";
    let resultString2 = "";
    for(let i = 0 ; i < str1Index.length; i++) {


        if(str1Index[i]>i1 || str2Index[i]>i2) {
            //resultString1 += str1.substr(i1, (str1Index[i]-i1));
            let resultStrings = getHighlightedText(i1, i2, str1Index[i], str2Index[i]);
            resultString1 += resultStrings[0];
            resultString2 += resultStrings[1];
            i1 = str1Index[i];
            i2 = str2Index[i];
        }
        resultString1 += str1[str1Index[i]];
        resultString2 += str1[str1Index[i]];
        ++i1;
        ++i2;
    }
    return [resultString1, resultString2];
}

function printLcs() {
    let i = str1.length;
    let j = str2.length;
    //let lcs = [];
    let str1Index = [];
    let str2Index = [];

    while(i > 0 && j > 0) {
        if(str1[i-1] == str2[j-1]) {
            //lcs.unshift(str1[i-1]);
            str1Index.unshift(i-1);
            str2Index.unshift(j-1);
            --i;
            --j;
        } else if(matrix[i][j-1] > matrix[i-1][j]) {
            --j;
        } else {
            --i;
        }
    }

    return getSentenceDiff(str1Index, str2Index);
}