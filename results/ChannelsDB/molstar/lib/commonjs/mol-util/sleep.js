"use strict";
/**
 * Copyright (c) 2019 Mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
exports.sleep = sleep;
