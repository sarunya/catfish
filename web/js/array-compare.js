function comparethis() {
     let array1 = $('#array1').val()
    let array2 = $('#array2').val()
 
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

function compare(array1, array2) {
    array1 = array1.split("\n");
    array2 = array2.split("\n");

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