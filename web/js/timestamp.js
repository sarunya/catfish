function timestampToDate() {
    let input = readInput("timestamp");
    console.log(input);
    let result = convertToHumanDate(input);
    console.log(result);
    writeOutput(".top", result);
}

function base64Decode() {
    let text1 = readInput();
    let text2 = decodeBase64Value(text1);
    writeOutput(text2);
}

function readInput() {
    let text1 = $('#timestamp').val();
    return text1;
}

function writeOutput(div, result) {
    $('#UTC').html(`<b>UTC Time : </b> ${result[0]}`);
    $('#LocalTime').html(`<b>Local Time : </b> ${result[1]}`);
}

function convertToHumanDate(val) {
    let date = new Date(parseInt(val)*1000);
    return [date.toISOString(), date.toString()];
}

function decodeBase64Value(val) {
    //return new Buffer(val, 'base64').toString();
    return window.atob(val);
}