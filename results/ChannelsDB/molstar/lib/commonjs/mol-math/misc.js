"use strict";
/**
 * Copyright (c) 2018-2021 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.spiral2d = exports.arcLength = exports.absMax = exports.isPowerOfTwo = exports.radToDeg = exports.degToRad = exports.PiDiv180 = exports.halfPI = void 0;
exports.halfPI = Math.PI / 2;
exports.PiDiv180 = Math.PI / 180;
function degToRad(deg) {
    return deg * exports.PiDiv180; // deg * Math.PI / 180
}
exports.degToRad = degToRad;
function radToDeg(rad) {
    return rad / exports.PiDiv180; // rad * 180 / Math.PI
}
exports.radToDeg = radToDeg;
function isPowerOfTwo(x) {
    return (x !== 0) && (x & (x - 1)) === 0;
}
exports.isPowerOfTwo = isPowerOfTwo;
/** return the value that has the largest absolute value */
function absMax(...values) {
    let max = 0;
    let absMax = 0;
    for (let i = 0, il = values.length; i < il; ++i) {
        const value = values[i];
        const abs = Math.abs(value);
        if (abs > absMax) {
            max = value;
            absMax = abs;
        }
    }
    return max;
}
exports.absMax = absMax;
/** Length of an arc with angle in radians */
function arcLength(angle, radius) {
    return angle * radius;
}
exports.arcLength = arcLength;
/** Create an outward spiral of given `radius` on a 2d grid */
function spiral2d(radius) {
    let x = 0;
    let y = 0;
    const delta = [0, -1];
    const size = radius * 2 + 1;
    const halfSize = size / 2;
    const out = [];
    for (let i = Math.pow(size, 2); i > 0; --i) {
        if ((-halfSize < x && x <= halfSize) && (-halfSize < y && y <= halfSize)) {
            out.push([x, y]);
        }
        if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
            [delta[0], delta[1]] = [-delta[1], delta[0]]; // change direction
        }
        x += delta[0];
        y += delta[1];
    }
    return out;
}
exports.spiral2d = spiral2d;
