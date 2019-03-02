function comparethis() {
    let array1 = $('#array1').val()
    let array2 = $('#array2').val()
 
    array1 = array1.split("\n");
    array2 = array2.split("\n");
    showShare();
    compare(array1, array2);
 }

function isRemoveSpaces() {
    return $(":checkbox[value='spaces']").prop("checked");
}

function isIgnoreCase() {
    return $(":checkbox[value='case']").prop("checked");
}

function isRemoveDuplicates() {
    return $(":checkbox[value='duplicates']").prop("checked");
}

function setRemoveSpaces(value) {
    return $(":checkbox[value='spaces']").prop("checked", value);
}

function setIgnoreCase(value) {
    return $(":checkbox[value='case']").prop("checked", value);
}

function setRemoveDuplicates(value) {
    return $(":checkbox[value='duplicates']").prop("checked", value);
}

function compare(array1, array2) {
    if (isRemoveSpaces()) {
        array1 = removeSpacesFromArray(array1);
        array2 = removeSpacesFromArray(array2);
    }

    if(isIgnoreCase()) {
        array1 = convertAllToLowerCase(array1);
        array2 = convertAllToLowerCase(array2);
    }

    if (isRemoveDuplicates()) {
        array1 = removeDuplicates(array1);
        array2 = removeDuplicates(array2);
    }

    let ignoreCase = isIgnoreCase();

    setArrayAndLength('#array1', array1);
    setArrayAndLength('#array2', array2);

    let array1or2 = union(array1, array2, ignoreCase);
    setArrayAndLength('#array1or2', array1or2);

    let array1and2 = intersection(array1, array2, ignoreCase);
    setArrayAndLength('#array1and2', array1and2);

    let array1only = differencearr(array1, array2, ignoreCase);
    setArrayAndLength('#array1only', array1only);

    let array2only = differencearr(array2, array1, ignoreCase);
    setArrayAndLength('#array2only', array2only);
}

function setArrayAndLength(id, array) {

    if(isRemoveDuplicates(array)) {
        array = removeDuplicates(array);
    }

    $(id).val(array.join("\n"));

    let element = $(id).siblings("p");
    let value = element.text();
    value = value.split(":");
    value = value[0];
    element.text(`${value} : (${array.length})`);
}

function removeSpacesFromArray(array) {
    for (let index = 0; index < array.length; index++) {
        array[index] = array[index].trim();
        if (array[index] === "") {
            if (index > -1) {
                array.splice(index, 1);
            }
        }
    }
    return array;
}

function convertAllToLowerCase(array) {
    for(let index=0; index < array.length; index++) {
        array[index] = array[index].toLowerCase();
    }
    return array;
}

function removeDuplicates(array) {
    let unique = [];
    for(let index=0; index < array.length; index++) {
        if(unique.indexOf(array[index])<0) {
            unique.push(array[index]);
        }
    }
    return unique;
}

function differencearr(a1, a2, isIgnoreCase) {
    a1 = JSON.parse(JSON.stringify(a1));
    a2 = JSON.parse(JSON.stringify(a2));
    let result = [];
    if (!isIgnoreCase) {
        let i = 0;
        while (i < a1.length) {
            if (a2.indexOf(a1[i]) == -1) {
                result.push(a1[i]);
            }
            ++i;
        }
        return result;
    } else {
        a2 = a2.join("\n").toLowerCase();
        a2 = a2.split("\n");
        let result = JSON.parse(JSON.stringify(a1));
        let removedIndex = 0;
        for (let index = 0; index < a1.length; index++) {
            if (a2.indexOf(a1[index].toLowerCase()) > -1) {
                result.splice(index - removedIndex, 1);
                ++removedIndex;
            }
        }
        return result;
    }
}

function union(a1, a2, isIgnoreCase) {
    a2 = JSON.parse(JSON.stringify(a2));
    if (!isIgnoreCase) {
        return a1.concat(a2);
    } else {
        a2 = differencearr(a1, a2);
        return a1.concat(a2);
    }
}

function intersection(a1, a2, isIgnoreCase) {
    a2 = JSON.parse(JSON.stringify(a2));
    let result = [];
    if (!isIgnoreCase) {
        let i = 0;
        j = 0;
        while (i < a1.length) {
            if (a2.indexOf(a1[i]) >= 0) {
                result.push(a1[i]);
            }
            ++i;
        }
        return result;
    } else {
        a2 = a2.join("\n").toLowerCase();
        a2 = a2.split("\n");
        let result = [];
        for (let index = 0; index < a1.length; index++) {
            if (a2.indexOf(a1[index].toLowerCase()) > -1) {
                result.push(a1[index]);
            }
        }
        return result;
    }
}

function share() {
    let actual = $('#array1').val();
    let expected = $('#array2').val();
    actual = actual.split("\n");
    expected = expected.split("\n");

    // actual = JSON.parse(actual);
    // expected = JSON.parse(expected);
    let useroptions = {
        removeSpaces : isRemoveSpaces(),
        ignoreCase : isIgnoreCase(),
        removeDuplicate : isRemoveDuplicates()
    };

    //store in backend and get a short id url
    createArrayShare(actual, expected, useroptions);
}

function createArrayShare(actual, expected, useroptions) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            hideLoading();
            let id = JSON.parse(this.responseText);
            id = id.id;
            prompt("share url: ", window.location.href + "?id=" + id);
        }
        else if (this.readyState == 4 && this.status != 200) {
            hideLoading();
            alert("Error in creating share. Please try again");
        }
    };

    let host = window.location.origin;
    if (host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("POST", host + '/array-share', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send(JSON.stringify({
        actual: actual,
        expected: expected,
        userOptions: useroptions
    }));

    showLoading();
}

// Helper to get hash from end of URL or generate a random one.
function loadIfSaved() {
    let id = getSavedShareId();
    if (id) {
        getShareData(id);
        hideShare();
    } else {
        showShare();
    }
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

function loadShareDataHtml(payload) {
    setArrayAndLength('#array1', payload.actual);
    setArrayAndLength('#array2', payload.expected);
    setRemoveSpaces(payload.array_data.removeSpaces);
    setIgnoreCase(payload.array_data.ignoreCase);
    setRemoveDuplicates(payload.array_data.removeDuplicate);
    comparethis();
}


function getShareData(jsonshareid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            if(response.error) {
                alert("The Array Difference document you request is not found/expired");
                window.location.href = window.location.origin+window.location.pathname;
            } else {
                loadShareDataHtml(response);
            }
            hideLoading();
        }
        else if (this.readyState == 4 && this.status != 200) {
            hideLoading();
            alert("Error in creating share. Please try again");
        }
    };

    let host = window.location.origin;
    if (host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("GET", host + '/array-share-data?id=' + jsonshareid, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send();
    showLoading();
}

function getSavedShareId() {
    let search = window.location.search;
    return getParameterByName("id", search);
}

function hideLoading() {
    $(".se-pre-con").hide();
}

function showLoading() {
    $(".se-pre-con").show();
}

function hideShare() {
    $("#share").hide();
}

function showShare() {
    $("#share").show();
}
