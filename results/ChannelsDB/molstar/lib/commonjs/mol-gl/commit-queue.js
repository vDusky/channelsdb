"use strict";
/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitQueue = void 0;
const generic_1 = require("../mol-data/generic");
class CommitQueue {
    constructor() {
        this.removeList = (0, generic_1.LinkedList)();
        this.removeMap = new Map();
        this.addList = (0, generic_1.LinkedList)();
        this.addMap = new Map();
    }
    get isEmpty() {
        return this.removeList.count === 0 && this.addList.count === 0;
    }
    get size() {
        return this.removeMap.size + this.addMap.size;
    }
    add(o) {
        if (this.removeMap.has(o)) {
            const a = this.removeMap.get(o);
            this.removeMap.delete(o);
            this.removeList.remove(a);
        }
        if (this.addMap.has(o))
            return;
        const b = this.addList.addLast(o);
        this.addMap.set(o, b);
    }
    remove(o) {
        if (this.addMap.has(o)) {
            const a = this.addMap.get(o);
            this.addMap.delete(o);
            this.addList.remove(a);
        }
        if (this.removeMap.has(o))
            return;
        const b = this.removeList.addLast(o);
        this.removeMap.set(o, b);
    }
    tryGetRemove() {
        const o = this.removeList.removeFirst();
        if (o)
            this.removeMap.delete(o);
        return o;
    }
    tryGetAdd() {
        const o = this.addList.removeFirst();
        if (o)
            this.addMap.delete(o);
        return o;
    }
}
exports.CommitQueue = CommitQueue;
