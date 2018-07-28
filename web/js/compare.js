function compare() {
    let array1 = document.getElementById("array1").value;
    let array2 = document.getElementById("array2").value;
    compareArray(array1, array2, isRemoveSpaces(), isIgnoreCase(), isRemoveDuplicates());
}

function isRemoveSpaces() {
    return document.getElementById("spaces").checked;
}

function isIgnoreCase() {
    return document.getElementById("case").checked;
}

function isRemoveDuplicates() {
    return document.getElementById("case").checked;
}

function compareArray(array1, array2, isRemoveSpaces, isIgnoreCase, isRemoveDuplicates) {
    array1 = array1.split("\n");
    array2 = array2.split("\n");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

            setArrayAndLength('array1or2', data.or);

            setArrayAndLength('array1and2', data.and);

            setArrayAndLength('array1only', data.array1only);

            setArrayAndLength('array2only', data.array2only);
        }
    };

    let host = window.location.origin;
    if(host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("POST",host+'/array-companison', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send(JSON.stringify({
        array1: array1,
        array2: array2,
        isRemoveSpaces: isRemoveSpaces,
        isIgnoreCase: isIgnoreCase,
        isRemoveDuplicates: isRemoveDuplicates
    }));

}


function setArrayAndLength(id, array) {
    document.getElementById(id).innerHTML = array.join("\n");
    let element = document.getElementById(id).previousElementSibling;
    let value = element.innerHTML;
    value = value.split(":");
    value = value[0];
    element.innerHTML = `${value} : (${array.length})`;
}