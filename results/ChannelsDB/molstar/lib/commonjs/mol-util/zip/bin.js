"use strict";
/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 *
 * ported from https://github.com/photopea/UZIP.js/blob/master/UZIP.js
 * MIT License, Copyright (c) 2018 Photopea
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeUTF8 = exports.writeUTF8 = exports.readUTF8 = exports.writeUint = exports.readUint = exports.writeUshort = exports.readUshort = exports.toInt32 = exports.toUint32 = void 0;
function toUint32(x) {
    return x >>> 0;
}
exports.toUint32 = toUint32;
function toInt32(x) {
    return x >> 0;
}
exports.toInt32 = toInt32;
function readUshort(buff, p) {
    return (buff[p]) | (buff[p + 1] << 8);
}
exports.readUshort = readUshort;
function writeUshort(buff, p, n) {
    buff[p] = (n) & 255;
    buff[p + 1] = (n >> 8) & 255;
}
exports.writeUshort = writeUshort;
function readUint(buff, p) {
    return (buff[p + 3] * (256 * 256 * 256)) + ((buff[p + 2] << 16) | (buff[p + 1] << 8) | buff[p]);
}
exports.readUint = readUint;
function writeUint(buff, p, n) {
    buff[p] = n & 255;
    buff[p + 1] = (n >> 8) & 255;
    buff[p + 2] = (n >> 16) & 255;
    buff[p + 3] = (n >> 24) & 255;
}
exports.writeUint = writeUint;
function readASCII(buff, p, l) {
    let s = '';
    for (let i = 0; i < l; i++)
        s += String.fromCharCode(buff[p + i]);
    return s;
}
// function writeASCII(data: Uint8Array, p: number, s: string){
//     for(let i=0; i<s.length; i++) data[p+i] = s.charCodeAt(i);
// }
function pad(n) {
    return n.length < 2 ? '0' + n : n;
}
function readUTF8(buff, p, l) {
    let s = '', ns;
    for (let i = 0; i < l; i++)
        s += '%' + pad(buff[p + i].toString(16));
    try {
        ns = decodeURIComponent(s);
    }
    catch (e) {
        return readASCII(buff, p, l);
    }
    return ns;
}
exports.readUTF8 = readUTF8;
function writeUTF8(buff, p, str) {
    const strl = str.length;
    let i = 0;
    for (let ci = 0; ci < strl; ci++) {
        const code = str.charCodeAt(ci);
        if ((code & (0xffffffff - (1 << 7) + 1)) === 0) {
            buff[p + i] = (code);
            i++;
        }
        else if ((code & (0xffffffff - (1 << 11) + 1)) === 0) {
            buff[p + i] = (192 | (code >> 6));
            buff[p + i + 1] = (128 | ((code >> 0) & 63));
            i += 2;
        }
        else if ((code & (0xffffffff - (1 << 16) + 1)) === 0) {
            buff[p + i] = (224 | (code >> 12));
            buff[p + i + 1] = (128 | ((code >> 6) & 63));
            buff[p + i + 2] = (128 | ((code >> 0) & 63));
            i += 3;
        }
        else if ((code & (0xffffffff - (1 << 21) + 1)) === 0) {
            buff[p + i] = (240 | (code >> 18));
            buff[p + i + 1] = (128 | ((code >> 12) & 63));
            buff[p + i + 2] = (128 | ((code >> 6) & 63));
            buff[p + i + 3] = (128 | ((code >> 0) & 63));
            i += 4;
        }
        else
            throw new Error('e');
    }
    return i;
}
exports.writeUTF8 = writeUTF8;
function sizeUTF8(str) {
    const strl = str.length;
    let i = 0;
    for (let ci = 0; ci < strl; ci++) {
        const code = str.charCodeAt(ci);
        if ((code & (0xffffffff - (1 << 7) + 1)) === 0) {
            i++;
        }
        else if ((code & (0xffffffff - (1 << 11) + 1)) === 0) {
            i += 2;
        }
        else if ((code & (0xffffffff - (1 << 16) + 1)) === 0) {
            i += 3;
        }
        else if ((code & (0xffffffff - (1 << 21) + 1)) === 0) {
            i += 4;
        }
        else {
            throw new Error('e');
        }
    }
    return i;
}
exports.sizeUTF8 = sizeUTF8;
