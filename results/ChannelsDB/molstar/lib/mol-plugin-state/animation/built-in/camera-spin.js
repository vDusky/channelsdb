/**
 * Copyright (c) 2020-2022 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
import { clamp } from '../../../mol-math/interpolate';
import { Quat } from '../../../mol-math/linear-algebra/3d/quat';
import { Vec3 } from '../../../mol-math/linear-algebra/3d/vec3';
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { PluginStateAnimation } from '../model';
const _dir = Vec3(), _axis = Vec3(), _rot = Quat();
export const AnimateCameraSpin = PluginStateAnimation.create({
    name: 'built-in.animate-camera-spin',
    display: { name: 'Camera Spin', description: 'Spin the 3D scene around the x-axis in view space' },
    isExportable: true,
    params: () => ({
        durationInMs: PD.Numeric(4000, { min: 100, max: 20000, step: 100 }),
        speed: PD.Numeric(1, { min: 1, max: 10, step: 1 }, { description: 'How many times to spin in the specified duration.' }),
        direction: PD.Select('cw', [['cw', 'Clockwise'], ['ccw', 'Counter Clockwise']], { cycle: true })
    }),
    initialState: (_, ctx) => { var _a; return ({ snapshot: (_a = ctx.canvas3d) === null || _a === void 0 ? void 0 : _a.camera.getSnapshot() }); },
    getDuration: p => ({ kind: 'fixed', durationMs: p.durationInMs }),
    teardown: (_, state, ctx) => {
        var _a;
        (_a = ctx.canvas3d) === null || _a === void 0 ? void 0 : _a.requestCameraReset({ snapshot: state.snapshot, durationMs: 0 });
    },
    async apply(animState, t, ctx) {
        var _a, _b;
        if (t.current === 0) {
            return { kind: 'next', state: animState };
        }
        const snapshot = animState.snapshot;
        if (snapshot.radiusMax < 0.0001) {
            return { kind: 'finished' };
        }
        const phase = t.animation
            ? ((_a = t.animation) === null || _a === void 0 ? void 0 : _a.currentFrame) / (t.animation.frameCount + 1)
            : clamp(t.current / ctx.params.durationInMs, 0, 1);
        const angle = 2 * Math.PI * phase * ctx.params.speed * (ctx.params.direction === 'ccw' ? -1 : 1);
        Vec3.sub(_dir, snapshot.position, snapshot.target);
        Vec3.normalize(_axis, snapshot.up);
        Quat.setAxisAngle(_rot, _axis, angle);
        Vec3.transformQuat(_dir, _dir, _rot);
        const position = Vec3.add(Vec3(), snapshot.target, _dir);
        (_b = ctx.plugin.canvas3d) === null || _b === void 0 ? void 0 : _b.requestCameraReset({ snapshot: { ...snapshot, position }, durationMs: 0 });
        if (phase >= 0.99999) {
            return { kind: 'finished' };
        }
        return { kind: 'next', state: animState };
    }
});
