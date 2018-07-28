const _ = require("lodash");

class ArrayComparison {
    constructor(dependencies) {
    }

    compare(body) {
        try {
            let me = this;
            let array1 = body.array1;
            let array2 = body.array2;
            let isRemoveDuplicates = body.isRemoveDuplicates || false;
            let isRemoveSpaces = body.isRemoveSpaces || false;
            let ignoreCase = body.isIgnoreCase || false;

            if (isRemoveSpaces) {
                me.removeSpacesFromArray(array1);
                me.removeSpacesFromArray(array2);
            }
            if (isRemoveDuplicates) {
                array1 = me.removeDuplicates(array1, ignoreCase);
                array2 = me.removeDuplicates(array2, ignoreCase);
            }
            let array1or2 = me.union(array1, array2, ignoreCase);

            let array1and2 = me.intersection(array1, array2, ignoreCase);

            let array1only = me.difference(array1, array2, ignoreCase);

            let array2only = me.difference(array2, array1, ignoreCase);

            if(isRemoveDuplicates) {
                array1or2 = _.uniq(array1or2);
                array1and2 = _.uniq(array1and2);
                array1only = _.uniq(array1only);
                array2only = _.uniq(array2only);
            }

            return {
                or: array1or2,
                and: array1and2,
                array1only: array1only,
                array2only: array2only
            }
        } catch (error) {
            console.log("error is", error);
            return {};
        }
    }

    removeDuplicates(array, isIgnoreCase) {
        if (!isIgnoreCase) {
            return _.uniq(array);
        } else {
            let result = [];
            array = _.sortBy(array);
            let arrayCopy = _.cloneDeep(array);
            for (let index = 0; index < array.length; index++) {
                arrayCopy[index] = arrayCopy[index].toLowerCase().trim();
            }
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(_.lastIndexOf(arrayCopy, element.toLowerCase().trim()) == index) {
                    result.push(element);
                }
            }
            return result;
        }
    }

    removeSpacesFromArray(array) {
        for (let index = 0; index < array.length; index++) {
            array[index] = array[index].trim();
        }
        array = _.remove(array, function (data) {
            return data === "";
        })
        return array;
    }

    difference(a1, a2, isIgnoreCase) {
        a1 = _.cloneDeep(a1);
        a2 = _.cloneDeep(a2);
        if (!isIgnoreCase) {
            return _.difference(a1, a2);
        } else {
            a2 = _.join(a2, "\n").toLowerCase();
            a2 = a2.split("\n");
            let result = _.cloneDeep(a1);
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

    union(a1, a2, isIgnoreCase) {
        let me = this;
        a2 = _.cloneDeep(a2);
        if (!isIgnoreCase) {
            return _.union(a1, a2);
        } else {
            a2 = me.difference(a1, a2);
            return _.union(a1, a2);
        }
    }

    intersection(a1, a2, isIgnoreCase) {
        a2 = _.cloneDeep(a2);
        if (!isIgnoreCase) {
            return _.intersection(a1, a2);
        } else {
            a2 = _.join(a2, "\n").toLowerCase();
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
}

module.exports = ArrayComparison;