"use strict";
/**
 * Copyright (c) 2017-2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicesOf = exports.deduplicate = exports.subtract = exports.intersect = exports.intersectionSize = exports.union = exports.isSubset = exports.areIntersecting = exports.findRange = exports.findPredecessorIndexInInterval = exports.findPredecessorIndex = exports.areEqual = exports.getAt = exports.has = exports.indexOfInRange = exports.indexOfInInterval = exports.indexOf = exports.toString = exports.hashCode = exports.size = exports.max = exports.min = exports.end = exports.start = exports.isRange = exports.is = exports.ofRange = exports.ofUnsortedArray = exports.ofSortedArray = exports.ofSingleton = exports.Empty = void 0;
const util_1 = require("../../util");
const interval_1 = require("../interval");
exports.Empty = [];
function ofSingleton(v) { return [v]; }
exports.ofSingleton = ofSingleton;
function ofSortedArray(xs) { return xs; }
exports.ofSortedArray = ofSortedArray;
function ofUnsortedArray(xs) { (0, util_1.sortArray)(xs); return xs; }
exports.ofUnsortedArray = ofUnsortedArray;
function ofRange(min, max) {
    if (max < min)
        return [];
    const ret = new Int32Array(max - min + 1);
    for (let i = min; i <= max; i++)
        ret[i - min] = i;
    return ret;
}
exports.ofRange = ofRange;
function is(xs) { return xs && (Array.isArray(xs) || !!xs.buffer); }
exports.is = is;
function isRange(xs) { return xs[xs.length - 1] - xs[0] + 1 === xs.length; }
exports.isRange = isRange;
function start(xs) { return xs[0]; }
exports.start = start;
function end(xs) { return xs[xs.length - 1] + 1; }
exports.end = end;
function min(xs) { return xs[0]; }
exports.min = min;
function max(xs) { return xs[xs.length - 1]; }
exports.max = max;
function size(xs) { return xs.length; }
exports.size = size;
function hashCode(xs) {
    // hash of tuple (size, min, max, mid)
    const s = xs.length;
    if (!s)
        return 0;
    if (s > 2)
        return (0, util_1.hash4)(s, xs[0], xs[s - 1], xs[s >> 1]);
    return (0, util_1.hash3)(s, xs[0], xs[s - 1]);
}
exports.hashCode = hashCode;
function toString(xs) {
    const s = xs.length;
    if (s > 5)
        return `[${xs[0]}, ${xs[1]}, ..., ${xs[s - 1]}], length ${s}`;
    return `[${xs.join(', ')}]`;
}
exports.toString = toString;
/** Returns the index of `x` in `set` or -1 if not found. */
function indexOf(xs, v) {
    const l = xs.length;
    return l === 0 ? -1 : xs[0] <= v && v <= xs[l - 1] ? binarySearchRange(xs, v, 0, l) : -1;
}
exports.indexOf = indexOf;
function indexOfInInterval(xs, v, bounds) {
    return indexOfInRange(xs, v, interval_1.Interval.start(bounds), interval_1.Interval.end(bounds));
}
exports.indexOfInInterval = indexOfInInterval;
function indexOfInRange(xs, v, s, e) {
    const l = xs.length;
    return l === 0 || e <= s ? -1 : xs[s] <= v && v <= xs[e - 1] ? binarySearchRange(xs, v, s, e) : -1;
}
exports.indexOfInRange = indexOfInRange;
function has(xs, v) { return indexOf(xs, v) >= 0; }
exports.has = has;
function getAt(xs, i) { return xs[i]; }
exports.getAt = getAt;
function areEqual(a, b) {
    if (a === b)
        return true;
    let aSize = a.length;
    if (aSize !== b.length || a[0] !== b[0] || a[aSize - 1] !== b[aSize - 1])
        return false;
    if (isRange(a))
        return true;
    aSize--;
    for (let i = 1; i < aSize; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.areEqual = areEqual;
/**
 * Returns 0 if `v` is smaller or equal the first element of `xs`
 * Returns length of `xs` if `v` is bigger than the last element of `xs`
 * Otherwise returns the first index where the value of `xs` is equal or bigger than `v`
 */
function findPredecessorIndex(xs, v) {
    const len = xs.length;
    if (v <= xs[0])
        return 0;
    if (v > xs[len - 1])
        return len;
    return binarySearchPredIndexRange(xs, v, 0, len);
}
exports.findPredecessorIndex = findPredecessorIndex;
function findPredecessorIndexInInterval(xs, v, bounds) {
    const s = interval_1.Interval.start(bounds), e = interval_1.Interval.end(bounds);
    const sv = xs[s];
    if (v <= sv)
        return s;
    if (e > s && v > xs[e - 1])
        return e;
    // do a linear search if there are only 10 or less items remaining
    if (v - sv <= 11)
        return linearSearchPredInRange(xs, v, s + 1, e);
    return binarySearchPredIndexRange(xs, v, s, e);
}
exports.findPredecessorIndexInInterval = findPredecessorIndexInInterval;
function findRange(xs, min, max) {
    return interval_1.Interval.ofBounds(findPredecessorIndex(xs, min), findPredecessorIndex(xs, max + 1));
}
exports.findRange = findRange;
function binarySearchRange(xs, value, start, end) {
    let min = start, max = end - 1;
    while (min <= max) {
        // do a linear search if there are only 10 or less items remaining
        if (min + 11 > max) {
            for (let i = min; i <= max; i++) {
                if (value === xs[i])
                    return i;
            }
            return -1;
        }
        const mid = (min + max) >> 1;
        const v = xs[mid];
        if (value < v)
            max = mid - 1;
        else if (value > v)
            min = mid + 1;
        else
            return mid;
    }
    return -1;
}
function binarySearchPredIndexRange(xs, value, start, end) {
    let min = start, max = end - 1;
    while (min < max) {
        // do a linear search if there are only 10 or less items remaining
        if (min + 11 > max) {
            for (let i = min; i <= max; i++) {
                if (value <= xs[i])
                    return i;
            }
            return max + 1;
        }
        const mid = (min + max) >> 1;
        const v = xs[mid];
        if (value < v)
            max = mid - 1;
        else if (value > v)
            min = mid + 1;
        else
            return mid;
    }
    if (min > max)
        return max + 1;
    return xs[min] >= value ? min : min + 1;
}
function linearSearchPredInRange(xs, value, start, end) {
    for (let i = start; i < end; i++) {
        if (value <= xs[i])
            return i;
    }
    return end;
}
function areIntersecting(a, b) {
    if (a === b)
        return true;
    let { startI: i, startJ: j, endI, endJ } = getSuitableIntersectionRange(a, b);
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y)
            i++;
        else if (x > y)
            j++;
        else
            return true;
    }
    return false;
}
exports.areIntersecting = areIntersecting;
function isSubset(a, b) {
    if (a === b)
        return true;
    const lenB = b.length;
    let { startI: i, startJ: j, endI, endJ } = getSuitableIntersectionRange(a, b);
    // must be able to advance by lenB elements
    if (endJ - j < lenB || endI - i < lenB)
        return false;
    let equal = 0;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            i++;
            j++;
            equal++;
        }
    }
    return equal === lenB;
}
exports.isSubset = isSubset;
function union(a, b) {
    if (a === b)
        return a;
    const lenA = a.length, lenB = b.length;
    if (lenA === 0)
        return b;
    if (lenB === 0)
        return a;
    if (a[0] > b[0])
        return union(b, a);
    const { startI, startJ, endI, endJ } = getSuitableIntersectionRange(a, b);
    const commonCount = getCommonCount(a, b, startI, startJ, endI, endJ);
    // A === B || B is subset of A ==> A
    if ((commonCount === lenA && commonCount === lenB) || commonCount === lenB)
        return a;
    // A is subset of B ===> B
    if (commonCount === lenA)
        return b;
    const indices = new Int32Array(lenA + lenB - commonCount);
    let i = 0, j = 0, offset = 0;
    // insert the "prefixes"
    for (i = 0; i < startI; i++)
        indices[offset++] = a[i];
    while (j < endJ && a[startI] > b[j])
        indices[offset++] = b[j++];
    // insert the common part
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            indices[offset++] = x;
            i++;
        }
        else if (x > y) {
            indices[offset++] = y;
            j++;
        }
        else {
            indices[offset++] = x;
            i++;
            j++;
        }
    }
    // insert the remaining common part
    for (; i < endI; i++)
        indices[offset++] = a[i];
    for (; j < endJ; j++)
        indices[offset++] = b[j];
    // insert the "tail"
    for (; i < lenA; i++)
        indices[offset++] = a[i];
    for (; j < lenB; j++)
        indices[offset++] = b[j];
    return ofSortedArray(indices);
}
exports.union = union;
function intersectionSize(a, b) {
    if (a === b)
        return size(a);
    const { startI, startJ, endI, endJ } = getSuitableIntersectionRange(a, b);
    return getCommonCount(a, b, startI, startJ, endI, endJ);
}
exports.intersectionSize = intersectionSize;
function getCommonCount(a, b, startI, startJ, endI, endJ) {
    let i = startI, j = startJ;
    let commonCount = 0;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            i++;
            j++;
            commonCount++;
        }
    }
    return commonCount;
}
function intersect(a, b) {
    if (a === b)
        return a;
    const { startI, startJ, endI, endJ } = getSuitableIntersectionRange(a, b);
    const commonCount = getCommonCount(a, b, startI, startJ, endI, endJ);
    const lenA = a.length, lenB = b.length;
    // no common elements
    if (!commonCount)
        return exports.Empty;
    // A === B || B is subset of A ==> B
    if ((commonCount === lenA && commonCount === lenB) || commonCount === lenB)
        return b;
    // A is subset of B ==> A
    if (commonCount === lenA)
        return a;
    const indices = new Int32Array(commonCount);
    let offset = 0;
    let i = startI;
    let j = startJ;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            indices[offset++] = x;
            i++;
            j++;
        }
    }
    return ofSortedArray(indices);
}
exports.intersect = intersect;
function subtract(a, b) {
    if (a === b)
        return exports.Empty;
    const lenA = a.length;
    const { startI: sI, startJ: sJ, endI, endJ } = getSuitableIntersectionRange(a, b);
    let i = sI, j = sJ;
    let commonCount = 0;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            i++;
            j++;
            commonCount++;
        }
    }
    // A isnt intersecting B ===> A
    if (!commonCount)
        return a;
    // A === B || A is subset of B ===> Empty
    if (commonCount >= lenA)
        return exports.Empty;
    const indices = new Int32Array(lenA - commonCount);
    let offset = 0;
    // insert the "prefix"
    for (let k = 0; k < sI; k++)
        indices[offset++] = a[k];
    i = sI;
    j = sJ;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            indices[offset++] = x;
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            i++;
            j++;
        }
    }
    // insert the "tail"
    for (; i < lenA; i++)
        indices[offset++] = a[i];
    return ofSortedArray(indices);
}
exports.subtract = subtract;
function deduplicate(xs) {
    if (xs.length < 2)
        return xs;
    let count = 1;
    for (let i = 0, _i = xs.length - 1; i < _i; i++) {
        if (xs[i] !== xs[i + 1])
            count++;
    }
    if (count === xs.length)
        return xs;
    const ret = new Int32Array(count);
    let o = 0;
    for (let i = 0, _i = xs.length - 1; i < _i; i++) {
        if (xs[i] !== xs[i + 1])
            ret[o++] = xs[i];
    }
    ret[o] = xs[xs.length - 1];
    return ret;
}
exports.deduplicate = deduplicate;
function indicesOf(a, b) {
    if (areEqual(a, b))
        return ofSortedArray((0, util_1.createRangeArray)(0, a.length - 1));
    const { startI: sI, startJ: sJ, endI, endJ } = getSuitableIntersectionRange(a, b);
    let i = sI, j = sJ;
    let commonCount = 0;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            i++;
            j++;
            commonCount++;
        }
    }
    const lenA = a.length;
    // no common elements
    if (!commonCount)
        return exports.Empty;
    // A is subset of B ==> A
    if (commonCount === lenA)
        return ofSortedArray((0, util_1.createRangeArray)(0, a.length - 1));
    const indices = new Int32Array(commonCount);
    let offset = 0;
    i = sI;
    j = sJ;
    while (i < endI && j < endJ) {
        const x = a[i], y = b[j];
        if (x < y) {
            i++;
        }
        else if (x > y) {
            j++;
        }
        else {
            indices[offset++] = i;
            i++;
            j++;
        }
    }
    return ofSortedArray(indices);
}
exports.indicesOf = indicesOf;
const _maxIntRangeRet = { startI: 0, startJ: 0, endI: 0, endJ: 0 };
// for small sets, just gets the whole range, for large sets does a bunch of binary searches
function getSuitableIntersectionRange(a, b) {
    const la = a.length, lb = b.length;
    const ratio = la / lb;
    if (la >= 128 || lb >= 128 || ratio <= 0.34 || ratio >= 2.99) {
        _maxIntRangeRet.startI = findPredecessorIndex(a, start(b));
        _maxIntRangeRet.startJ = findPredecessorIndex(b, start(a));
        _maxIntRangeRet.endI = findPredecessorIndex(a, end(b));
        _maxIntRangeRet.endJ = findPredecessorIndex(b, end(a));
    }
    else {
        _maxIntRangeRet.startI = 0;
        _maxIntRangeRet.startJ = 0;
        _maxIntRangeRet.endI = la;
        _maxIntRangeRet.endJ = lb;
    }
    return _maxIntRangeRet;
}
