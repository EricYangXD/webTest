function cockTailSort(arr) {
    for (let i = 0, l = arr.length; i < l / 2; i++) {
        // 有序标记，每一轮的初始是true
        let isSorted = true;
        //奇数轮，从左向右比较和交换
        for (let j = i, len = arr.length; j < len - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                //有元素交换，所以不是有序，标记变为false
                isSorted = false;
            }
        }
        if (isSorted) {
            break;
        }
        //偶数轮，从右向左比较和交换
        for (let j = arr.length - i - 1; j > i; j--) {
            if (arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                //有元素交换，所以不是有序，标记变为false
                isSorted = false;
            }
        }
        if (isSorted) {
            break;
        }
    }
    return arr;
}

function bubbleSort(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
        for (let j = i + 1, len = arr.length; j < len; j++) {
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
    return arr;
}

function realBubbleSort(arr) {
    for (let i = 0, l = arr.length - 1; i < l; i++) {
        for (let j = 0, len = arr.length - i - 1; j < len; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    var left = [],
        right = [];
    for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}

function insertSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            let guard = arr[i];
            let j = i - 1;
            arr[i] = arr[j];
            while (j >= 0 && guard < arr[j]) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = guard;
        }
    }
    return arr;
}

/* test */
var arr = [3, 5, 1, 2, 21, 32, 23, 0, -5, 4, 8, 9];
// var arr = [33, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(bubbleSort(arr));
// console.log(cockTailSort(arr));
// console.log(realBubbleSort(arr));
// console.log(arr.sort());
console.log(arr);
// console.log(quickSort(arr));
// console.log(arr.slice(1, 3));
// console.log(arr.splice(1, 3));
// console.log(insertSort(arr));
console.log(arr);