"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTest = exports.checkSorted = exports.copyArray = void 0;
const tslib_1 = require("tslib");
const B = tslib_1.__importStar(require("benchmark"));
const Sort = tslib_1.__importStar(require("../mol-data/util"));
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
}
function createTestData(n) {
    const data = new Int32Array(n); // new Array(n);
    for (let i = 0; i < n; i++) {
        data[i] = i;
        // data[i] = (n * Math.random()) | 0;
    }
    shuffle(data);
    return data;
}
function copyArray(xs) {
    const ret = new xs.constructor(xs.length);
    for (let i = 0, _i = xs.length; i < _i; i++)
        ret[i] = xs[i];
    return ret;
}
exports.copyArray = copyArray;
function checkSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}
exports.checkSorted = checkSorted;
function runTest(size) {
    const _data = createTestData(size);
    const dataCopies = [];
    let dataOffset = 0;
    function prepareData() {
        dataOffset = 0;
        for (let i = 0; i < 100; i++) {
            dataCopies[i] = copyArray(_data);
        }
    }
    function getData() {
        if (dataOffset < dataCopies.length)
            return dataCopies[dataOffset++];
        return copyArray(_data);
    }
    prepareData();
    const suite = new B.Suite();
    function le(x, y) { return x - y; }
    function name(n) { return `${n} (${size} elems)`; }
    // TODO: the data copying skewes the benchmark -- write a simple benchmark util that allows for a preparation step.
    suite
        .add(name('native'), () => Array.prototype.sort.call(getData(), le))
        .add(name('qsort'), () => Sort.sortArray(getData()))
        // .add(name('qsort'), () => Sort.sort(getData(), 0, _data.length, Sort.arrayLess, Sort.arraySwap))
        .add(name('native sorted'), () => Array.prototype.sort.call(_data, le))
        .add(name('qsort sorted'), () => Sort.sortArray(_data))
        // .add(name('qsort sorted'), () => Sort.sort(_data, 0, _data.length, Sort.arrayLess, Sort.arraySwap))
        .on('cycle', (e) => {
        prepareData();
        console.log(String(e.target));
    })
        .run();
    console.log('---------------------');
}
exports.runTest = runTest;
// runTest(10);
// runTest(100);
// runTest(1000);
runTest(10000);
// runTest(100000);
