"use strict";
/**
 * Copyright (c) 2018-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const render_object_1 = require("./render-object");
const object3d_1 = require("./object3d");
const sphere3d_1 = require("../mol-math/geometry/primitives/sphere3d");
const commit_queue_1 = require("./commit-queue");
const now_1 = require("../mol-util/now");
const array_1 = require("../mol-util/array");
const boundary_helper_1 = require("../mol-math/geometry/boundary-helper");
const util_1 = require("../mol-data/util");
const interpolate_1 = require("../mol-math/interpolate");
const boundaryHelper = new boundary_helper_1.BoundaryHelper('98');
function calculateBoundingSphere(renderables, boundingSphere, onlyVisible) {
    boundaryHelper.reset();
    for (let i = 0, il = renderables.length; i < il; ++i) {
        if (onlyVisible && !renderables[i].state.visible)
            continue;
        const boundingSphere = renderables[i].values.boundingSphere.ref.value;
        if (!boundingSphere.radius)
            continue;
        boundaryHelper.includeSphere(boundingSphere);
    }
    boundaryHelper.finishedIncludeStep();
    for (let i = 0, il = renderables.length; i < il; ++i) {
        if (onlyVisible && !renderables[i].state.visible)
            continue;
        const boundingSphere = renderables[i].values.boundingSphere.ref.value;
        if (!boundingSphere.radius)
            continue;
        boundaryHelper.radiusSphere(boundingSphere);
    }
    return boundaryHelper.getSphere(boundingSphere);
}
function renderableSort(a, b) {
    const drawProgramIdA = a.getProgram('color').id;
    const drawProgramIdB = b.getProgram('color').id;
    const materialIdA = a.materialId;
    const materialIdB = b.materialId;
    if (drawProgramIdA !== drawProgramIdB) {
        // sort by program id to minimize gl state changes
        return drawProgramIdA - drawProgramIdB;
    }
    else if (materialIdA !== materialIdB) {
        // sort by material id to minimize gl state changes
        return materialIdA - materialIdB;
    }
    else {
        return a.id - b.id;
    }
}
var Scene;
(function (Scene) {
    function create(ctx, transparency = 'blended') {
        const renderableMap = new Map();
        const renderables = [];
        const boundingSphere = (0, sphere3d_1.Sphere3D)();
        const boundingSphereVisible = (0, sphere3d_1.Sphere3D)();
        const primitives = [];
        const volumes = [];
        let boundingSphereDirty = true;
        let boundingSphereVisibleDirty = true;
        let markerAverageDirty = true;
        let opacityAverageDirty = true;
        let hasOpaqueDirty = true;
        let markerAverage = 0;
        let opacityAverage = 0;
        let hasOpaque = false;
        const object3d = object3d_1.Object3D.create();
        const { view, position, direction, up } = object3d;
        function add(o) {
            if (!renderableMap.has(o)) {
                const renderable = (0, render_object_1.createRenderable)(ctx, o, transparency);
                renderables.push(renderable);
                if (o.type === 'direct-volume') {
                    volumes.push(renderable);
                }
                else {
                    primitives.push(renderable);
                }
                renderableMap.set(o, renderable);
                boundingSphereDirty = true;
                boundingSphereVisibleDirty = true;
            }
            else {
                console.warn(`RenderObject with id '${o.id}' already present`);
            }
        }
        function remove(o) {
            const renderable = renderableMap.get(o);
            if (renderable) {
                renderable.dispose();
                (0, array_1.arraySetRemove)(renderables, renderable);
                (0, array_1.arraySetRemove)(primitives, renderable);
                (0, array_1.arraySetRemove)(volumes, renderable);
                renderableMap.delete(o);
                boundingSphereDirty = true;
                boundingSphereVisibleDirty = true;
            }
        }
        const commitBulkSize = 100;
        function commit(maxTimeMs) {
            const start = (0, now_1.now)();
            let i = 0;
            while (true) {
                const o = commitQueue.tryGetRemove();
                if (!o)
                    break;
                remove(o);
                if (++i % commitBulkSize === 0 && (0, now_1.now)() - start > maxTimeMs)
                    return false;
            }
            while (true) {
                const o = commitQueue.tryGetAdd();
                if (!o)
                    break;
                add(o);
                if (++i % commitBulkSize === 0 && (0, now_1.now)() - start > maxTimeMs)
                    return false;
            }
            renderables.sort(renderableSort);
            markerAverageDirty = true;
            opacityAverageDirty = true;
            hasOpaqueDirty = true;
            return true;
        }
        const commitQueue = new commit_queue_1.CommitQueue();
        let visibleHash = -1;
        function computeVisibleHash() {
            let hash = 23;
            for (let i = 0, il = renderables.length; i < il; ++i) {
                if (!renderables[i].state.visible)
                    continue;
                hash = (31 * hash + renderables[i].id) | 0;
            }
            hash = (0, util_1.hash1)(hash);
            if (hash === -1)
                hash = 0;
            return hash;
        }
        function syncVisibility() {
            const newVisibleHash = computeVisibleHash();
            if (newVisibleHash !== visibleHash) {
                boundingSphereVisibleDirty = true;
                markerAverageDirty = true;
                opacityAverageDirty = true;
                hasOpaqueDirty = true;
                visibleHash = newVisibleHash;
                return true;
            }
            else {
                return false;
            }
        }
        function calculateMarkerAverage() {
            if (primitives.length === 0)
                return 0;
            let count = 0;
            let markerAverage = 0;
            for (let i = 0, il = primitives.length; i < il; ++i) {
                if (!primitives[i].state.visible)
                    continue;
                markerAverage += primitives[i].values.markerAverage.ref.value;
                count += 1;
            }
            return count > 0 ? markerAverage / count : 0;
        }
        function calculateOpacityAverage() {
            var _a, _b;
            if (primitives.length === 0)
                return 0;
            let count = 0;
            let opacityAverage = 0;
            for (let i = 0, il = primitives.length; i < il; ++i) {
                const p = primitives[i];
                if (!p.state.visible)
                    continue;
                // TODO: simplify, handle in renderable.state???
                // uAlpha is updated in "render" so we need to recompute it here
                const alpha = (0, interpolate_1.clamp)(p.values.alpha.ref.value * p.state.alphaFactor, 0, 1);
                const xray = ((_a = p.values.dXrayShaded) === null || _a === void 0 ? void 0 : _a.ref.value) ? 0.5 : 1;
                const fuzzy = ((_b = p.values.dPointStyle) === null || _b === void 0 ? void 0 : _b.ref.value) === 'fuzzy' ? 0.5 : 1;
                const text = p.values.dGeometryType.ref.value === 'text' ? 0.5 : 1;
                opacityAverage += (1 - p.values.transparencyAverage.ref.value) * alpha * xray * fuzzy * text;
                count += 1;
            }
            return count > 0 ? opacityAverage / count : 0;
        }
        function calculateHasOpaque() {
            var _a;
            if (primitives.length === 0)
                return false;
            for (let i = 0, il = primitives.length; i < il; ++i) {
                const p = primitives[i];
                if (!p.state.visible)
                    continue;
                if (p.state.opaque)
                    return true;
                if (p.state.alphaFactor === 1 && p.values.alpha.ref.value === 1 && p.values.transparencyAverage.ref.value !== 1)
                    return true;
                if (((_a = p.values.dTransparentBackfaces) === null || _a === void 0 ? void 0 : _a.ref.value) === 'opaque')
                    return true;
            }
            return false;
        }
        return {
            view, position, direction, up,
            renderables,
            primitives: { view, position, direction, up, renderables: primitives },
            volumes: { view, position, direction, up, renderables: volumes },
            syncVisibility,
            setTransparency: (value) => {
                transparency = value;
                for (let i = 0, il = renderables.length; i < il; ++i) {
                    renderables[i].setTransparency(value);
                }
            },
            update(objects, keepBoundingSphere) {
                var _a;
                object3d_1.Object3D.update(object3d);
                if (objects) {
                    for (let i = 0, il = objects.length; i < il; ++i) {
                        (_a = renderableMap.get(objects[i])) === null || _a === void 0 ? void 0 : _a.update();
                    }
                }
                else {
                    for (let i = 0, il = renderables.length; i < il; ++i) {
                        renderables[i].update();
                    }
                }
                if (!keepBoundingSphere) {
                    boundingSphereDirty = true;
                    boundingSphereVisibleDirty = true;
                }
                else {
                    syncVisibility();
                }
                markerAverageDirty = true;
                opacityAverageDirty = true;
                hasOpaqueDirty = true;
            },
            add: (o) => commitQueue.add(o),
            remove: (o) => commitQueue.remove(o),
            commit: (maxTime = Number.MAX_VALUE) => commit(maxTime),
            get commitQueueSize() { return commitQueue.size; },
            get needsCommit() { return !commitQueue.isEmpty; },
            has: (o) => {
                return renderableMap.has(o);
            },
            clear: () => {
                for (let i = 0, il = renderables.length; i < il; ++i) {
                    renderables[i].dispose();
                }
                renderables.length = 0;
                primitives.length = 0;
                volumes.length = 0;
                renderableMap.clear();
                boundingSphereDirty = true;
                boundingSphereVisibleDirty = true;
            },
            forEach: (callbackFn) => {
                renderableMap.forEach(callbackFn);
            },
            get count() {
                return renderables.length;
            },
            get boundingSphere() {
                if (boundingSphereDirty) {
                    calculateBoundingSphere(renderables, boundingSphere, false);
                    boundingSphereDirty = false;
                }
                return boundingSphere;
            },
            get boundingSphereVisible() {
                if (boundingSphereVisibleDirty) {
                    calculateBoundingSphere(renderables, boundingSphereVisible, true);
                    boundingSphereVisibleDirty = false;
                }
                return boundingSphereVisible;
            },
            get markerAverage() {
                if (markerAverageDirty) {
                    markerAverage = calculateMarkerAverage();
                    markerAverageDirty = false;
                }
                return markerAverage;
            },
            get opacityAverage() {
                if (opacityAverageDirty) {
                    opacityAverage = calculateOpacityAverage();
                    opacityAverageDirty = false;
                }
                return opacityAverage;
            },
            get hasOpaque() {
                if (hasOpaqueDirty) {
                    hasOpaque = calculateHasOpaque();
                    hasOpaqueDirty = false;
                }
                return hasOpaque;
            },
        };
    }
    Scene.create = create;
})(Scene || (exports.Scene = Scene = {}));
