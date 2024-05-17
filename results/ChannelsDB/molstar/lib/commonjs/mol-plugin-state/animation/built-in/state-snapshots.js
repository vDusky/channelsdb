"use strict";
/**
 * Copyright (c) 2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimateStateSnapshots = void 0;
const model_1 = require("../model");
async function setPartialSnapshot(plugin, entry, first = false) {
    var _a;
    if (entry.snapshot.data) {
        await plugin.runTask(plugin.state.data.setSnapshot(entry.snapshot.data));
    }
    if (entry.snapshot.camera) {
        (_a = plugin.canvas3d) === null || _a === void 0 ? void 0 : _a.requestCameraReset({
            snapshot: entry.snapshot.camera.current,
            durationMs: first || entry.snapshot.camera.transitionStyle === 'instant'
                ? 0 : entry.snapshot.camera.transitionDurationInMs
        });
    }
}
exports.AnimateStateSnapshots = model_1.PluginStateAnimation.create({
    name: 'built-in.animate-state-snapshots',
    display: { name: 'State Snapshots' },
    isExportable: true,
    params: () => ({}),
    canApply(plugin) {
        const entries = plugin.managers.snapshot.state.entries;
        if (entries.size < 2) {
            return { canApply: false, reason: 'At least 2 states required.' };
        }
        if (entries.some(e => !!(e === null || e === void 0 ? void 0 : e.snapshot.startAnimation))) {
            return { canApply: false, reason: 'Nested animations not supported.' };
        }
        return { canApply: plugin.managers.snapshot.state.entries.size > 1 };
    },
    setup(_, __, plugin) {
        const pivot = plugin.managers.snapshot.state.entries.get(0);
        setPartialSnapshot(plugin, pivot, true);
    },
    getDuration: (_, plugin) => {
        return {
            kind: 'fixed',
            durationMs: plugin.managers.snapshot.state.entries.toArray().reduce((a, b) => { var _a; return a + ((_a = b.snapshot.durationInMs) !== null && _a !== void 0 ? _a : 0); }, 0)
        };
    },
    initialState: (_, plugin) => {
        const snapshots = plugin.managers.snapshot.state.entries.toArray();
        return {
            totalDuration: snapshots.reduce((a, b) => { var _a; return a + ((_a = b.snapshot.durationInMs) !== null && _a !== void 0 ? _a : 0); }, 0),
            snapshots,
            currentIndex: 0
        };
    },
    async apply(animState, t, ctx) {
        var _a;
        if (t.current >= animState.totalDuration) {
            return { kind: 'finished' };
        }
        let ctime = 0, i = 0;
        for (const s of animState.snapshots) {
            ctime += (_a = s.snapshot.durationInMs) !== null && _a !== void 0 ? _a : 0;
            if (t.current < ctime) {
                break;
            }
            i++;
        }
        if (i >= animState.snapshots.length)
            return { kind: 'finished' };
        if (i === animState.currentIndex) {
            return { kind: 'skip' };
        }
        setPartialSnapshot(ctx.plugin, animState.snapshots[i]);
        return { kind: 'next', state: { ...animState, currentIndex: i } };
    }
});
