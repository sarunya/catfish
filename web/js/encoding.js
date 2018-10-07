function base64Encode() {
    let text1 = readInput();
    let text2 = encodeBase64Value(text1);
    writeOutput(text2);
}

function base64Decode() {
    let text1 = readInput();
    let text2 = decodeBase64Value(text1);
    writeOutput(text2);
}

function readInput() {
    let text1 = $('#text1').val();
    return text1;
}

function writeOutput(val) {
    $('#text2').val(val);
}

function encodeBase64Value(val) {
    //return new Buffer(val).toString('base64');
    return window.btoa(val);
}

function decodeBase64Value(val) {
    //return new Buffer(val, 'base64').toString();
    return window.atob(val);
}