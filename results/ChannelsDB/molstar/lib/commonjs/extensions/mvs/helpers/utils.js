"use strict";
/**
 * Copyright (c) 2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Adam Midlik <midlik@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexColor = exports.decodeColor = exports.stringHash = exports.filterDefined = exports.isAnyDefined = exports.isDefined = exports.NumberMap = exports.MultiMap = exports.safePromise = void 0;
const util_1 = require("../../../mol-data/util");
const color_1 = require("../../../mol-util/color");
const names_1 = require("../../../mol-util/color/names");
/** Try to await a promise and return an object with its result (if resolved) or with the error (if rejected) */
async function safePromise(promise) {
    try {
        const value = await promise;
        return { ok: true, value };
    }
    catch (error) {
        return { ok: false, error };
    }
}
exports.safePromise = safePromise;
/** A map where values are arrays. Handles missing keys when adding values. */
class MultiMap {
    constructor() {
        this._map = new Map();
    }
    /** Return the array of values assidned to a key (or `undefined` if no such values) */
    get(key) {
        return this._map.get(key);
    }
    /** Append value to a key (handles missing keys) */
    add(key, value) {
        if (!this._map.has(key)) {
            this._map.set(key, []);
        }
        this._map.get(key).push(value);
    }
}
exports.MultiMap = MultiMap;
/** Implementation of `Map` where keys are integers
 * and most keys are expected to be from interval `[0, limit)`.
 * For the keys within this interval, performance is better than `Map` (implemented by array).
 * For the keys out of this interval, performance is slightly worse than `Map`. */
class NumberMap {
    constructor(limit) {
        this.limit = limit;
        this.array = new Array(limit);
        this.map = new Map();
    }
    get(key) {
        if (0 <= key && key < this.limit)
            return this.array[key];
        else
            return this.map.get(key);
    }
    set(key, value) {
        if (0 <= key && key < this.limit)
            this.array[key] = value;
        else
            this.map.set(key, value);
    }
}
exports.NumberMap = NumberMap;
/** Return `true` if `value` is not `undefined` or `null`.
 * Prefer this over `value !== undefined`
 * (for maybe if we want to allow `null` in `AnnotationRow` in the future) */
function isDefined(value) {
    return value !== undefined && value !== null;
}
exports.isDefined = isDefined;
/** Return `true` if at least one of `values` is not `undefined` or `null`. */
function isAnyDefined(...values) {
    return values.some(v => isDefined(v));
}
exports.isAnyDefined = isAnyDefined;
/** Return filtered array containing all original elements except `undefined` or `null`. */
function filterDefined(elements) {
    return elements.filter(x => x !== undefined && x !== null);
}
exports.filterDefined = filterDefined;
/** Create an 8-hex-character hash for a given input string, e.g. 'spanish inquisition' -> '7f9ac4be' */
function stringHash32(input) {
    const uint32hash = (0, util_1.hashString)(input) >>> 0; // >>>0 converts to uint32, LOL
    return uint32hash.toString(16).padStart(8, '0');
}
/** Create an 16-hex-character hash for a given input string, e.g. 'spanish inquisition' -> '7f9ac4be544330be'*/
function stringHash(input) {
    const reversed = input.split('').reverse().join('');
    return stringHash32(input) + stringHash32(reversed);
}
exports.stringHash = stringHash;
/** Convert `colorString` (either X11 color name like 'magenta' or hex code like '#ff00ff') to Color.
 * Return `undefined` if `colorString` cannot be converted. */
function decodeColor(colorString) {
    if (colorString === undefined)
        return undefined;
    let result;
    if (exports.HexColor.is(colorString)) {
        if (colorString.length === 4) {
            // convert short form to full form (#f0f -> #ff00ff)
            colorString = `#${colorString[1]}${colorString[1]}${colorString[2]}${colorString[2]}${colorString[3]}${colorString[3]}`;
        }
        result = color_1.Color.fromHexStyle(colorString);
        if (result !== undefined && !isNaN(result))
            return result;
    }
    result = names_1.ColorNames[colorString.toLowerCase()];
    if (result !== undefined)
        return result;
    return undefined;
}
exports.decodeColor = decodeColor;
/** Regular expression matching a hexadecimal color string, e.g. '#FF1100' or '#f10' */
const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
exports.HexColor = {
    /** Decide if a string is a valid hexadecimal color string (6-digit or 3-digit, e.g. '#FF1100' or '#f10') */
    is(str) {
        return typeof str === 'string' && hexColorRegex.test(str);
    },
};
