"use strict";
/**
 * Copyright (c) 2019-2021 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackRGBAToDepth = exports.unpackRGBToInt = exports.packIntToRGBArray = void 0;
const interpolate_1 = require("../mol-math/interpolate");
const linear_algebra_1 = require("../mol-math/linear-algebra");
/** encode positive integer as rgb byte triplet into array at offset */
function packIntToRGBArray(value, array, offset) {
    value = (0, interpolate_1.clamp)(Math.round(value), 0, 16777216 - 1) + 1;
    array[offset + 2] = value % 256;
    value = Math.floor(value / 256);
    array[offset + 1] = value % 256;
    value = Math.floor(value / 256);
    array[offset] = value % 256;
    return array;
}
exports.packIntToRGBArray = packIntToRGBArray;
/** decode positive integer encoded as rgb byte triplet */
function unpackRGBToInt(r, g, b) {
    return (Math.floor(r) * 256 * 256 + Math.floor(g) * 256 + Math.floor(b)) - 1;
}
exports.unpackRGBToInt = unpackRGBToInt;
const UnpackDownscale = 255 / 256; // 0..1 -> fraction (excluding 1)
const PackFactors = linear_algebra_1.Vec3.create(256 * 256 * 256, 256 * 256, 256);
const UnpackFactors = linear_algebra_1.Vec4.create(UnpackDownscale / PackFactors[0], UnpackDownscale / PackFactors[1], UnpackDownscale / PackFactors[2], UnpackDownscale / 1);
const tmpDepthRGBA = (0, linear_algebra_1.Vec4)();
function unpackRGBAToDepth(r, g, b, a) {
    linear_algebra_1.Vec4.set(tmpDepthRGBA, r / 255, g / 255, b / 255, a / 255);
    return linear_algebra_1.Vec4.dot(tmpDepthRGBA, UnpackFactors);
}
exports.unpackRGBAToDepth = unpackRGBAToDepth;
