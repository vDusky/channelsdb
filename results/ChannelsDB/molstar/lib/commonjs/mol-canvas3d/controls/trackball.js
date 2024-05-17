"use strict";
/**
 * Copyright (c) 2018-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 *
 * This code has been modified from https://github.com/mrdoob/three.js/,
 * copyright (c) 2010-2018 three.js authors. MIT License
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackballControls = exports.TrackballControlsParams = exports.DefaultTrackballBindings = void 0;
const linear_algebra_1 = require("../../mol-math/linear-algebra");
const util_1 = require("../camera/util");
const input_observer_1 = require("../../mol-util/input/input-observer");
const param_definition_1 = require("../../mol-util/param-definition");
const misc_1 = require("../../mol-math/misc");
const binding_1 = require("../../mol-util/binding");
const B = input_observer_1.ButtonsType;
const M = input_observer_1.ModifiersKeys;
const Trigger = binding_1.Binding.Trigger;
const Key = binding_1.Binding.TriggerKey;
exports.DefaultTrackballBindings = {
    dragRotate: (0, binding_1.Binding)([Trigger(B.Flag.Primary, M.create())], 'Rotate', 'Drag using ${triggers}'),
    dragRotateZ: (0, binding_1.Binding)([Trigger(B.Flag.Primary, M.create({ shift: true, control: true }))], 'Rotate around z-axis (roll)', 'Drag using ${triggers}'),
    dragPan: (0, binding_1.Binding)([
        Trigger(B.Flag.Secondary, M.create()),
        Trigger(B.Flag.Primary, M.create({ control: true }))
    ], 'Pan', 'Drag using ${triggers}'),
    dragZoom: binding_1.Binding.Empty,
    dragFocus: (0, binding_1.Binding)([Trigger(B.Flag.Forth, M.create())], 'Focus', 'Drag using ${triggers}'),
    dragFocusZoom: (0, binding_1.Binding)([Trigger(B.Flag.Auxilary, M.create())], 'Focus and zoom', 'Drag using ${triggers}'),
    scrollZoom: (0, binding_1.Binding)([Trigger(B.Flag.Auxilary, M.create())], 'Zoom', 'Scroll using ${triggers}'),
    scrollFocus: (0, binding_1.Binding)([Trigger(B.Flag.Auxilary, M.create({ shift: true }))], 'Clip', 'Scroll using ${triggers}'),
    scrollFocusZoom: binding_1.Binding.Empty,
    keyMoveForward: (0, binding_1.Binding)([Key('KeyW')], 'Move forward', 'Press ${triggers}'),
    keyMoveBack: (0, binding_1.Binding)([Key('KeyS')], 'Move back', 'Press ${triggers}'),
    keyMoveLeft: (0, binding_1.Binding)([Key('KeyA')], 'Move left', 'Press ${triggers}'),
    keyMoveRight: (0, binding_1.Binding)([Key('KeyD')], 'Move right', 'Press ${triggers}'),
    keyMoveUp: (0, binding_1.Binding)([Key('KeyR')], 'Move up', 'Press ${triggers}'),
    keyMoveDown: (0, binding_1.Binding)([Key('KeyF')], 'Move down', 'Press ${triggers}'),
    keyRollLeft: (0, binding_1.Binding)([Key('KeyQ')], 'Roll left', 'Press ${triggers}'),
    keyRollRight: (0, binding_1.Binding)([Key('KeyE')], 'Roll right', 'Press ${triggers}'),
    keyPitchUp: (0, binding_1.Binding)([Key('ArrowUp', M.create({ shift: true }))], 'Pitch up', 'Press ${triggers}'),
    keyPitchDown: (0, binding_1.Binding)([Key('ArrowDown', M.create({ shift: true }))], 'Pitch down', 'Press ${triggers}'),
    keyYawLeft: (0, binding_1.Binding)([Key('ArrowLeft', M.create({ shift: true }))], 'Yaw left', 'Press ${triggers}'),
    keyYawRight: (0, binding_1.Binding)([Key('ArrowRight', M.create({ shift: true }))], 'Yaw right', 'Press ${triggers}'),
    boostMove: (0, binding_1.Binding)([Key('ShiftLeft')], 'Boost move', 'Press ${triggers}'),
    enablePointerLock: (0, binding_1.Binding)([Key('Space', M.create({ control: true }))], 'Enable pointer lock', 'Press ${triggers}'),
};
exports.TrackballControlsParams = {
    noScroll: param_definition_1.ParamDefinition.Boolean(true, { isHidden: true }),
    rotateSpeed: param_definition_1.ParamDefinition.Numeric(5.0, { min: 1, max: 10, step: 1 }),
    zoomSpeed: param_definition_1.ParamDefinition.Numeric(7.0, { min: 1, max: 15, step: 1 }),
    panSpeed: param_definition_1.ParamDefinition.Numeric(1.0, { min: 0.1, max: 5, step: 0.1 }),
    moveSpeed: param_definition_1.ParamDefinition.Numeric(0.75, { min: 0.1, max: 3, step: 0.1 }),
    boostMoveFactor: param_definition_1.ParamDefinition.Numeric(5.0, { min: 0.1, max: 10, step: 0.1 }),
    flyMode: param_definition_1.ParamDefinition.Boolean(false),
    animate: param_definition_1.ParamDefinition.MappedStatic('off', {
        off: param_definition_1.ParamDefinition.EmptyGroup(),
        spin: param_definition_1.ParamDefinition.Group({
            speed: param_definition_1.ParamDefinition.Numeric(1, { min: -20, max: 20, step: 1 }),
        }, { description: 'Spin the 3D scene around the x-axis in view space' }),
        rock: param_definition_1.ParamDefinition.Group({
            speed: param_definition_1.ParamDefinition.Numeric(0.3, { min: -5, max: 5, step: 0.1 }),
            angle: param_definition_1.ParamDefinition.Numeric(10, { min: 0, max: 90, step: 1 }, { description: 'How many degrees to rotate in each direction.' }),
        }, { description: 'Rock the 3D scene around the x-axis in view space' })
    }),
    staticMoving: param_definition_1.ParamDefinition.Boolean(true, { isHidden: true }),
    dynamicDampingFactor: param_definition_1.ParamDefinition.Numeric(0.2, {}, { isHidden: true }),
    minDistance: param_definition_1.ParamDefinition.Numeric(0.01, {}, { isHidden: true }),
    maxDistance: param_definition_1.ParamDefinition.Numeric(1e150, {}, { isHidden: true }),
    gestureScaleFactor: param_definition_1.ParamDefinition.Numeric(1, {}, { isHidden: true }),
    maxWheelDelta: param_definition_1.ParamDefinition.Numeric(0.02, {}, { isHidden: true }),
    bindings: param_definition_1.ParamDefinition.Value(exports.DefaultTrackballBindings, { isHidden: true }),
    /**
     * minDistance = minDistanceFactor * boundingSphere.radius + minDistancePadding
     * maxDistance = max(maxDistanceFactor * boundingSphere.radius, maxDistanceMin)
     */
    autoAdjustMinMaxDistance: param_definition_1.ParamDefinition.MappedStatic('on', {
        off: param_definition_1.ParamDefinition.EmptyGroup(),
        on: param_definition_1.ParamDefinition.Group({
            minDistanceFactor: param_definition_1.ParamDefinition.Numeric(0),
            minDistancePadding: param_definition_1.ParamDefinition.Numeric(5),
            maxDistanceFactor: param_definition_1.ParamDefinition.Numeric(10),
            maxDistanceMin: param_definition_1.ParamDefinition.Numeric(20)
        })
    }, { isHidden: true })
};
var TrackballControls;
(function (TrackballControls) {
    function create(input, camera, scene, props = {}) {
        const p = {
            ...param_definition_1.ParamDefinition.getDefaultValues(exports.TrackballControlsParams),
            ...props,
            // include default bindings for backwards state compatibility
            bindings: { ...exports.DefaultTrackballBindings, ...props.bindings }
        };
        const b = p.bindings;
        const viewport = util_1.Viewport.clone(camera.viewport);
        let disposed = false;
        const dragSub = input.drag.subscribe(onDrag);
        const interactionEndSub = input.interactionEnd.subscribe(onInteractionEnd);
        const wheelSub = input.wheel.subscribe(onWheel);
        const pinchSub = input.pinch.subscribe(onPinch);
        const gestureSub = input.gesture.subscribe(onGesture);
        const keyDownSub = input.keyDown.subscribe(onKeyDown);
        const keyUpSub = input.keyUp.subscribe(onKeyUp);
        const moveSub = input.move.subscribe(onMove);
        const lockSub = input.lock.subscribe(onLock);
        const leaveSub = input.leave.subscribe(onLeave);
        let _isInteracting = false;
        // For internal use
        const lastPosition = (0, linear_algebra_1.Vec3)();
        const _eye = (0, linear_algebra_1.Vec3)();
        const _rotPrev = (0, linear_algebra_1.Vec2)();
        const _rotCurr = (0, linear_algebra_1.Vec2)();
        const _rotLastAxis = (0, linear_algebra_1.Vec3)();
        let _rotLastAngle = 0;
        const _rollPrev = (0, linear_algebra_1.Vec2)();
        const _rollCurr = (0, linear_algebra_1.Vec2)();
        let _rollLastAngle = 0;
        let _pitchLastAngle = 0;
        let _yawLastAngle = 0;
        const _zoomStart = (0, linear_algebra_1.Vec2)();
        const _zoomEnd = (0, linear_algebra_1.Vec2)();
        const _focusStart = (0, linear_algebra_1.Vec2)();
        const _focusEnd = (0, linear_algebra_1.Vec2)();
        const _panStart = (0, linear_algebra_1.Vec2)();
        const _panEnd = (0, linear_algebra_1.Vec2)();
        // Initial values for reseting
        const target0 = linear_algebra_1.Vec3.clone(camera.target);
        const position0 = linear_algebra_1.Vec3.clone(camera.position);
        const up0 = linear_algebra_1.Vec3.clone(camera.up);
        const mouseOnScreenVec2 = (0, linear_algebra_1.Vec2)();
        function getMouseOnScreen(pageX, pageY) {
            return linear_algebra_1.Vec2.set(mouseOnScreenVec2, (pageX - viewport.x) / viewport.width, (pageY - viewport.y) / viewport.height);
        }
        const mouseOnCircleVec2 = (0, linear_algebra_1.Vec2)();
        function getMouseOnCircle(pageX, pageY) {
            return linear_algebra_1.Vec2.set(mouseOnCircleVec2, (pageX - viewport.width * 0.5 - viewport.x) / (viewport.width * 0.5), (viewport.height + 2 * (viewport.y - pageY)) / viewport.width // viewport.width intentional
            );
        }
        function getRotateFactor() {
            const aspectRatio = (input.width / input.height) || 1;
            return p.rotateSpeed * input.pixelRatio * aspectRatio;
        }
        const rotAxis = (0, linear_algebra_1.Vec3)();
        const rotQuat = (0, linear_algebra_1.Quat)();
        const rotEyeDir = (0, linear_algebra_1.Vec3)();
        const rotObjUpDir = (0, linear_algebra_1.Vec3)();
        const rotObjSideDir = (0, linear_algebra_1.Vec3)();
        const rotMoveDir = (0, linear_algebra_1.Vec3)();
        function rotateCamera() {
            const dx = _rotCurr[0] - _rotPrev[0];
            const dy = _rotCurr[1] - _rotPrev[1];
            linear_algebra_1.Vec3.set(rotMoveDir, dx, dy, 0);
            const angle = linear_algebra_1.Vec3.magnitude(rotMoveDir) * getRotateFactor();
            if (angle) {
                linear_algebra_1.Vec3.sub(_eye, camera.position, camera.target);
                linear_algebra_1.Vec3.normalize(rotEyeDir, _eye);
                linear_algebra_1.Vec3.normalize(rotObjUpDir, camera.up);
                linear_algebra_1.Vec3.normalize(rotObjSideDir, linear_algebra_1.Vec3.cross(rotObjSideDir, rotObjUpDir, rotEyeDir));
                linear_algebra_1.Vec3.setMagnitude(rotObjUpDir, rotObjUpDir, dy);
                linear_algebra_1.Vec3.setMagnitude(rotObjSideDir, rotObjSideDir, dx);
                linear_algebra_1.Vec3.add(rotMoveDir, rotObjUpDir, rotObjSideDir);
                linear_algebra_1.Vec3.normalize(rotAxis, linear_algebra_1.Vec3.cross(rotAxis, rotMoveDir, _eye));
                linear_algebra_1.Quat.setAxisAngle(rotQuat, rotAxis, angle);
                linear_algebra_1.Vec3.transformQuat(_eye, _eye, rotQuat);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, rotQuat);
                linear_algebra_1.Vec3.copy(_rotLastAxis, rotAxis);
                _rotLastAngle = angle;
            }
            else if (!p.staticMoving && _rotLastAngle) {
                _rotLastAngle *= Math.sqrt(1.0 - p.dynamicDampingFactor);
                linear_algebra_1.Vec3.sub(_eye, camera.position, camera.target);
                linear_algebra_1.Quat.setAxisAngle(rotQuat, _rotLastAxis, _rotLastAngle);
                linear_algebra_1.Vec3.transformQuat(_eye, _eye, rotQuat);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, rotQuat);
            }
            linear_algebra_1.Vec2.copy(_rotPrev, _rotCurr);
        }
        const rollQuat = (0, linear_algebra_1.Quat)();
        const rollDir = (0, linear_algebra_1.Vec3)();
        function rollCamera() {
            const k = (keyState.rollRight - keyState.rollLeft) / 45;
            const dx = (_rollCurr[0] - _rollPrev[0]) * -Math.sign(_rollCurr[1]);
            const dy = (_rollCurr[1] - _rollPrev[1]) * -Math.sign(_rollCurr[0]);
            const angle = -p.rotateSpeed * (-dx + dy) + k;
            if (angle) {
                linear_algebra_1.Vec3.normalize(rollDir, _eye);
                linear_algebra_1.Quat.setAxisAngle(rollQuat, rollDir, angle);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, rollQuat);
                _rollLastAngle = angle;
            }
            else if (!p.staticMoving && _rollLastAngle) {
                _rollLastAngle *= Math.sqrt(1.0 - p.dynamicDampingFactor);
                linear_algebra_1.Vec3.normalize(rollDir, _eye);
                linear_algebra_1.Quat.setAxisAngle(rollQuat, rollDir, _rollLastAngle);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, rollQuat);
            }
            linear_algebra_1.Vec2.copy(_rollPrev, _rollCurr);
        }
        const pitchQuat = (0, linear_algebra_1.Quat)();
        const pitchDir = (0, linear_algebra_1.Vec3)();
        function pitchCamera() {
            const m = (keyState.pitchUp - keyState.pitchDown) / (p.flyMode ? 360 : 90);
            const angle = -p.rotateSpeed * m;
            if (angle) {
                linear_algebra_1.Vec3.cross(pitchDir, _eye, camera.up);
                linear_algebra_1.Vec3.normalize(pitchDir, pitchDir);
                linear_algebra_1.Quat.setAxisAngle(pitchQuat, pitchDir, angle);
                linear_algebra_1.Vec3.transformQuat(_eye, _eye, pitchQuat);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, pitchQuat);
                _pitchLastAngle = angle;
            }
            else if (!p.staticMoving && _pitchLastAngle) {
                _pitchLastAngle *= Math.sqrt(1.0 - p.dynamicDampingFactor);
                linear_algebra_1.Vec3.cross(pitchDir, _eye, camera.up);
                linear_algebra_1.Vec3.normalize(pitchDir, pitchDir);
                linear_algebra_1.Quat.setAxisAngle(pitchQuat, pitchDir, _pitchLastAngle);
                linear_algebra_1.Vec3.transformQuat(_eye, _eye, pitchQuat);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, pitchQuat);
            }
        }
        const yawQuat = (0, linear_algebra_1.Quat)();
        const yawDir = (0, linear_algebra_1.Vec3)();
        function yawCamera() {
            const m = (keyState.yawRight - keyState.yawLeft) / (p.flyMode ? 360 : 90);
            const angle = -p.rotateSpeed * m;
            if (angle) {
                linear_algebra_1.Vec3.normalize(yawDir, camera.up);
                linear_algebra_1.Quat.setAxisAngle(yawQuat, yawDir, angle);
                linear_algebra_1.Vec3.transformQuat(_eye, _eye, yawQuat);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, yawQuat);
                _yawLastAngle = angle;
            }
            else if (!p.staticMoving && _yawLastAngle) {
                _yawLastAngle *= Math.sqrt(1.0 - p.dynamicDampingFactor);
                linear_algebra_1.Vec3.normalize(yawDir, camera.up);
                linear_algebra_1.Quat.setAxisAngle(yawQuat, yawDir, _yawLastAngle);
                linear_algebra_1.Vec3.transformQuat(_eye, _eye, yawQuat);
                linear_algebra_1.Vec3.transformQuat(camera.up, camera.up, yawQuat);
            }
        }
        function zoomCamera() {
            const factor = 1.0 + (_zoomEnd[1] - _zoomStart[1]) * p.zoomSpeed;
            if (factor !== 1.0 && factor > 0.0) {
                linear_algebra_1.Vec3.scale(_eye, _eye, factor);
            }
            if (p.staticMoving) {
                linear_algebra_1.Vec2.copy(_zoomStart, _zoomEnd);
            }
            else {
                _zoomStart[1] += (_zoomEnd[1] - _zoomStart[1]) * p.dynamicDampingFactor;
            }
        }
        function focusCamera() {
            const factor = (_focusEnd[1] - _focusStart[1]) * p.zoomSpeed;
            if (factor !== 0.0) {
                const radius = Math.max(1, camera.state.radius + camera.state.radius * factor);
                camera.setState({ radius });
            }
            if (p.staticMoving) {
                linear_algebra_1.Vec2.copy(_focusStart, _focusEnd);
            }
            else {
                _focusStart[1] += (_focusEnd[1] - _focusStart[1]) * p.dynamicDampingFactor;
            }
        }
        const panMouseChange = (0, linear_algebra_1.Vec2)();
        const panObjUp = (0, linear_algebra_1.Vec3)();
        const panOffset = (0, linear_algebra_1.Vec3)();
        function panCamera() {
            linear_algebra_1.Vec2.sub(panMouseChange, linear_algebra_1.Vec2.copy(panMouseChange, _panEnd), _panStart);
            if (linear_algebra_1.Vec2.squaredMagnitude(panMouseChange)) {
                const factor = input.pixelRatio * p.panSpeed;
                panMouseChange[0] *= (1 / camera.zoom) * camera.viewport.width * factor;
                panMouseChange[1] *= (1 / camera.zoom) * camera.viewport.height * factor;
                linear_algebra_1.Vec3.cross(panOffset, linear_algebra_1.Vec3.copy(panOffset, _eye), camera.up);
                linear_algebra_1.Vec3.setMagnitude(panOffset, panOffset, panMouseChange[0]);
                linear_algebra_1.Vec3.setMagnitude(panObjUp, camera.up, panMouseChange[1]);
                linear_algebra_1.Vec3.add(panOffset, panOffset, panObjUp);
                linear_algebra_1.Vec3.add(camera.position, camera.position, panOffset);
                linear_algebra_1.Vec3.add(camera.target, camera.target, panOffset);
                if (p.staticMoving) {
                    linear_algebra_1.Vec2.copy(_panStart, _panEnd);
                }
                else {
                    linear_algebra_1.Vec2.sub(panMouseChange, _panEnd, _panStart);
                    linear_algebra_1.Vec2.scale(panMouseChange, panMouseChange, p.dynamicDampingFactor);
                    linear_algebra_1.Vec2.add(_panStart, _panStart, panMouseChange);
                }
            }
        }
        const keyState = {
            moveUp: 0, moveDown: 0, moveLeft: 0, moveRight: 0, moveForward: 0, moveBack: 0,
            pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0,
            boostMove: 0,
        };
        const moveDir = (0, linear_algebra_1.Vec3)();
        const moveEye = (0, linear_algebra_1.Vec3)();
        function moveCamera(deltaT) {
            linear_algebra_1.Vec3.sub(moveEye, camera.position, camera.target);
            const minDistance = Math.max(camera.state.minNear, p.minDistance);
            linear_algebra_1.Vec3.setMagnitude(moveEye, moveEye, minDistance);
            const moveSpeed = deltaT * (60 / 1000) * p.moveSpeed * (keyState.boostMove === 1 ? p.boostMoveFactor : 1);
            if (keyState.moveForward === 1) {
                linear_algebra_1.Vec3.normalize(moveDir, moveEye);
                linear_algebra_1.Vec3.scaleAndSub(camera.position, camera.position, moveDir, moveSpeed);
                if (p.flyMode || input.pointerLock) {
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
                }
            }
            if (keyState.moveBack === 1) {
                linear_algebra_1.Vec3.normalize(moveDir, moveEye);
                linear_algebra_1.Vec3.scaleAndAdd(camera.position, camera.position, moveDir, moveSpeed);
                if (p.flyMode || input.pointerLock) {
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
                }
            }
            if (keyState.moveLeft === 1) {
                linear_algebra_1.Vec3.cross(moveDir, moveEye, camera.up);
                linear_algebra_1.Vec3.normalize(moveDir, moveDir);
                if (p.flyMode || input.pointerLock) {
                    linear_algebra_1.Vec3.scaleAndAdd(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
                }
                else {
                    linear_algebra_1.Vec3.scaleAndSub(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, _eye);
                }
            }
            if (keyState.moveRight === 1) {
                linear_algebra_1.Vec3.cross(moveDir, moveEye, camera.up);
                linear_algebra_1.Vec3.normalize(moveDir, moveDir);
                if (p.flyMode || input.pointerLock) {
                    linear_algebra_1.Vec3.scaleAndSub(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
                }
                else {
                    linear_algebra_1.Vec3.scaleAndAdd(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, _eye);
                }
            }
            if (keyState.moveUp === 1) {
                linear_algebra_1.Vec3.normalize(moveDir, camera.up);
                if (p.flyMode || input.pointerLock) {
                    linear_algebra_1.Vec3.scaleAndAdd(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
                }
                else {
                    linear_algebra_1.Vec3.scaleAndSub(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, _eye);
                }
            }
            if (keyState.moveDown === 1) {
                linear_algebra_1.Vec3.normalize(moveDir, camera.up);
                if (p.flyMode || input.pointerLock) {
                    linear_algebra_1.Vec3.scaleAndSub(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
                }
                else {
                    linear_algebra_1.Vec3.scaleAndAdd(camera.position, camera.position, moveDir, moveSpeed);
                    linear_algebra_1.Vec3.sub(camera.target, camera.position, _eye);
                }
            }
            if (p.flyMode || input.pointerLock) {
                const cameraDistance = linear_algebra_1.Vec3.distance(camera.position, scene.boundingSphereVisible.center);
                camera.setState({ minFar: cameraDistance + scene.boundingSphereVisible.radius });
            }
        }
        /**
         * Ensure the distance between object and target is within the min/max distance
         * and not too large compared to `camera.state.radiusMax`
         */
        function checkDistances() {
            const maxDistance = Math.min(Math.max(camera.state.radiusMax * 1000, 0.01), p.maxDistance);
            if (linear_algebra_1.Vec3.squaredMagnitude(_eye) > maxDistance * maxDistance) {
                linear_algebra_1.Vec3.setMagnitude(_eye, _eye, maxDistance);
                linear_algebra_1.Vec3.add(camera.position, camera.target, _eye);
                linear_algebra_1.Vec2.copy(_zoomStart, _zoomEnd);
                linear_algebra_1.Vec2.copy(_focusStart, _focusEnd);
            }
            if (linear_algebra_1.Vec3.squaredMagnitude(_eye) < p.minDistance * p.minDistance) {
                linear_algebra_1.Vec3.setMagnitude(_eye, _eye, p.minDistance);
                linear_algebra_1.Vec3.add(camera.position, camera.target, _eye);
                linear_algebra_1.Vec2.copy(_zoomStart, _zoomEnd);
                linear_algebra_1.Vec2.copy(_focusStart, _focusEnd);
            }
        }
        function outsideViewport(x, y) {
            x *= input.pixelRatio;
            y *= input.pixelRatio;
            return (x > viewport.x + viewport.width ||
                input.height - y > viewport.y + viewport.height ||
                x < viewport.x ||
                input.height - y < viewport.y);
        }
        let lastUpdated = -1;
        /** Update the object's position, direction and up vectors */
        function update(t) {
            if (lastUpdated === t)
                return;
            const deltaT = t - lastUpdated;
            if (lastUpdated > 0) {
                if (p.animate.name === 'spin')
                    spin(deltaT);
                else if (p.animate.name === 'rock')
                    rock(deltaT);
            }
            linear_algebra_1.Vec3.sub(_eye, camera.position, camera.target);
            rotateCamera();
            rollCamera();
            pitchCamera();
            yawCamera();
            zoomCamera();
            focusCamera();
            panCamera();
            linear_algebra_1.Vec3.add(camera.position, camera.target, _eye);
            checkDistances();
            if (lastUpdated > 0) {
                // clamp the maximum step size at 15 frames to avoid too big jumps
                // TODO: make this a parameter?
                moveCamera(Math.min(deltaT, 15 * 1000 / 60));
            }
            linear_algebra_1.Vec3.sub(_eye, camera.position, camera.target);
            checkDistances();
            if (linear_algebra_1.Vec3.squaredDistance(lastPosition, camera.position) > linear_algebra_1.EPSILON) {
                linear_algebra_1.Vec3.copy(lastPosition, camera.position);
            }
            lastUpdated = t;
        }
        /** Reset object's vectors and the target vector to their initial values */
        function reset() {
            linear_algebra_1.Vec3.copy(camera.target, target0);
            linear_algebra_1.Vec3.copy(camera.position, position0);
            linear_algebra_1.Vec3.copy(camera.up, up0);
            linear_algebra_1.Vec3.sub(_eye, camera.position, camera.target);
            linear_algebra_1.Vec3.copy(lastPosition, camera.position);
        }
        // listeners
        function onDrag({ x, y, pageX, pageY, buttons, modifiers, isStart }) {
            const isOutside = outsideViewport(x, y);
            if (isStart && isOutside)
                return;
            if (!isStart && !_isInteracting)
                return;
            _isInteracting = true;
            resetRock(); // start rocking from the center after interactions
            const dragRotate = binding_1.Binding.match(b.dragRotate, buttons, modifiers);
            const dragRotateZ = binding_1.Binding.match(b.dragRotateZ, buttons, modifiers);
            const dragPan = binding_1.Binding.match(b.dragPan, buttons, modifiers);
            const dragZoom = binding_1.Binding.match(b.dragZoom, buttons, modifiers);
            const dragFocus = binding_1.Binding.match(b.dragFocus, buttons, modifiers);
            const dragFocusZoom = binding_1.Binding.match(b.dragFocusZoom, buttons, modifiers);
            getMouseOnCircle(pageX, pageY);
            getMouseOnScreen(pageX, pageY);
            const pr = input.pixelRatio;
            const vx = (x * pr - viewport.width / 2 - viewport.x) / viewport.width;
            const vy = -(input.height - y * pr - viewport.height / 2 - viewport.y) / viewport.height;
            if (isStart) {
                if (dragRotate) {
                    linear_algebra_1.Vec2.copy(_rotCurr, mouseOnCircleVec2);
                    linear_algebra_1.Vec2.copy(_rotPrev, _rotCurr);
                }
                if (dragRotateZ) {
                    linear_algebra_1.Vec2.set(_rollCurr, vx, vy);
                    linear_algebra_1.Vec2.copy(_rollPrev, _rollCurr);
                }
                if (dragZoom || dragFocusZoom) {
                    linear_algebra_1.Vec2.copy(_zoomStart, mouseOnScreenVec2);
                    linear_algebra_1.Vec2.copy(_zoomEnd, _zoomStart);
                }
                if (dragFocus) {
                    linear_algebra_1.Vec2.copy(_focusStart, mouseOnScreenVec2);
                    linear_algebra_1.Vec2.copy(_focusEnd, _focusStart);
                }
                if (dragPan) {
                    linear_algebra_1.Vec2.copy(_panStart, mouseOnScreenVec2);
                    linear_algebra_1.Vec2.copy(_panEnd, _panStart);
                }
            }
            if (dragRotate)
                linear_algebra_1.Vec2.copy(_rotCurr, mouseOnCircleVec2);
            if (dragRotateZ)
                linear_algebra_1.Vec2.set(_rollCurr, vx, vy);
            if (dragZoom || dragFocusZoom)
                linear_algebra_1.Vec2.copy(_zoomEnd, mouseOnScreenVec2);
            if (dragFocus)
                linear_algebra_1.Vec2.copy(_focusEnd, mouseOnScreenVec2);
            if (dragFocusZoom) {
                const dist = linear_algebra_1.Vec3.distance(camera.state.position, camera.state.target);
                camera.setState({ radius: dist / 5 });
            }
            if (dragPan)
                linear_algebra_1.Vec2.copy(_panEnd, mouseOnScreenVec2);
        }
        function onInteractionEnd() {
            _isInteracting = false;
        }
        function onWheel({ x, y, spinX, spinY, dz, buttons, modifiers }) {
            if (outsideViewport(x, y))
                return;
            let delta = (0, misc_1.absMax)(spinX * 0.075, spinY * 0.075, dz * 0.0001);
            if (delta < -p.maxWheelDelta)
                delta = -p.maxWheelDelta;
            else if (delta > p.maxWheelDelta)
                delta = p.maxWheelDelta;
            if (binding_1.Binding.match(b.scrollZoom, buttons, modifiers)) {
                _zoomEnd[1] += delta;
            }
            if (binding_1.Binding.match(b.scrollFocus, buttons, modifiers)) {
                _focusEnd[1] += delta;
            }
        }
        function onPinch({ fractionDelta, buttons, modifiers }) {
            if (binding_1.Binding.match(b.scrollZoom, buttons, modifiers)) {
                _isInteracting = true;
                _zoomEnd[1] += p.gestureScaleFactor * fractionDelta;
            }
        }
        function onGesture({ deltaScale }) {
            _isInteracting = true;
            _zoomEnd[1] += p.gestureScaleFactor * deltaScale;
        }
        function onMove({ movementX, movementY }) {
            if (!input.pointerLock || movementX === undefined || movementY === undefined)
                return;
            const cx = viewport.width * 0.5 - viewport.x;
            const cy = viewport.height * 0.5 - viewport.y;
            linear_algebra_1.Vec2.copy(_rotPrev, getMouseOnCircle(cx, cy));
            linear_algebra_1.Vec2.copy(_rotCurr, getMouseOnCircle(movementX + cx, movementY + cy));
        }
        function onKeyDown({ modifiers, code, key, x, y }) {
            if (outsideViewport(x, y))
                return;
            if (binding_1.Binding.matchKey(b.keyMoveForward, code, modifiers, key)) {
                keyState.moveForward = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyMoveBack, code, modifiers, key)) {
                keyState.moveBack = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyMoveLeft, code, modifiers, key)) {
                keyState.moveLeft = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyMoveRight, code, modifiers, key)) {
                keyState.moveRight = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyMoveUp, code, modifiers, key)) {
                keyState.moveUp = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyMoveDown, code, modifiers, key)) {
                keyState.moveDown = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyRollLeft, code, modifiers, key)) {
                keyState.rollLeft = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyRollRight, code, modifiers, key)) {
                keyState.rollRight = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyPitchUp, code, modifiers, key)) {
                keyState.pitchUp = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyPitchDown, code, modifiers, key)) {
                keyState.pitchDown = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyYawLeft, code, modifiers, key)) {
                keyState.yawLeft = 1;
            }
            else if (binding_1.Binding.matchKey(b.keyYawRight, code, modifiers, key)) {
                keyState.yawRight = 1;
            }
            if (binding_1.Binding.matchKey(b.boostMove, code, modifiers, key)) {
                keyState.boostMove = 1;
            }
            if (binding_1.Binding.matchKey(b.enablePointerLock, code, modifiers, key)) {
                input.requestPointerLock(viewport);
            }
        }
        function onKeyUp({ modifiers, code, key, x, y }) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (outsideViewport(x, y))
                return;
            let isModifierCode = false;
            if (code.startsWith('Alt')) {
                isModifierCode = true;
                modifiers.alt = true;
            }
            else if (code.startsWith('Shift')) {
                isModifierCode = true;
                modifiers.shift = true;
            }
            else if (code.startsWith('Control')) {
                isModifierCode = true;
                modifiers.control = true;
            }
            else if (code.startsWith('Meta')) {
                isModifierCode = true;
                modifiers.meta = true;
            }
            const codes = [];
            if (isModifierCode) {
                if (keyState.moveForward)
                    codes.push(((_a = b.keyMoveForward.triggers[0]) === null || _a === void 0 ? void 0 : _a.code) || '');
                if (keyState.moveBack)
                    codes.push(((_b = b.keyMoveBack.triggers[0]) === null || _b === void 0 ? void 0 : _b.code) || '');
                if (keyState.moveLeft)
                    codes.push(((_c = b.keyMoveLeft.triggers[0]) === null || _c === void 0 ? void 0 : _c.code) || '');
                if (keyState.moveRight)
                    codes.push(((_d = b.keyMoveRight.triggers[0]) === null || _d === void 0 ? void 0 : _d.code) || '');
                if (keyState.moveUp)
                    codes.push(((_e = b.keyMoveUp.triggers[0]) === null || _e === void 0 ? void 0 : _e.code) || '');
                if (keyState.moveDown)
                    codes.push(((_f = b.keyMoveDown.triggers[0]) === null || _f === void 0 ? void 0 : _f.code) || '');
                if (keyState.rollLeft)
                    codes.push(((_g = b.keyRollLeft.triggers[0]) === null || _g === void 0 ? void 0 : _g.code) || '');
                if (keyState.rollRight)
                    codes.push(((_h = b.keyRollRight.triggers[0]) === null || _h === void 0 ? void 0 : _h.code) || '');
                if (keyState.pitchUp)
                    codes.push(((_j = b.keyPitchUp.triggers[0]) === null || _j === void 0 ? void 0 : _j.code) || '');
                if (keyState.pitchDown)
                    codes.push(((_k = b.keyPitchDown.triggers[0]) === null || _k === void 0 ? void 0 : _k.code) || '');
                if (keyState.yawLeft)
                    codes.push(((_l = b.keyYawLeft.triggers[0]) === null || _l === void 0 ? void 0 : _l.code) || '');
                if (keyState.yawRight)
                    codes.push(((_m = b.keyYawRight.triggers[0]) === null || _m === void 0 ? void 0 : _m.code) || '');
            }
            else {
                codes.push(code);
            }
            for (const code of codes) {
                if (binding_1.Binding.matchKey(b.keyMoveForward, code, modifiers, key)) {
                    keyState.moveForward = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyMoveBack, code, modifiers, key)) {
                    keyState.moveBack = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyMoveLeft, code, modifiers, key)) {
                    keyState.moveLeft = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyMoveRight, code, modifiers, key)) {
                    keyState.moveRight = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyMoveUp, code, modifiers, key)) {
                    keyState.moveUp = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyMoveDown, code, modifiers, key)) {
                    keyState.moveDown = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyRollLeft, code, modifiers, key)) {
                    keyState.rollLeft = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyRollRight, code, modifiers, key)) {
                    keyState.rollRight = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyPitchUp, code, modifiers, key)) {
                    keyState.pitchUp = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyPitchDown, code, modifiers, key)) {
                    keyState.pitchDown = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyYawLeft, code, modifiers, key)) {
                    keyState.yawLeft = 0;
                }
                else if (binding_1.Binding.matchKey(b.keyYawRight, code, modifiers, key)) {
                    keyState.yawRight = 0;
                }
            }
            if (binding_1.Binding.matchKey(b.boostMove, code, modifiers, key)) {
                keyState.boostMove = 0;
            }
        }
        function initCameraMove() {
            linear_algebra_1.Vec3.sub(moveEye, camera.position, camera.target);
            const minDistance = Math.max(camera.state.minNear, p.minDistance);
            linear_algebra_1.Vec3.setMagnitude(moveEye, moveEye, minDistance);
            linear_algebra_1.Vec3.sub(camera.target, camera.position, moveEye);
            const cameraDistance = linear_algebra_1.Vec3.distance(camera.position, scene.boundingSphereVisible.center);
            camera.setState({ minFar: cameraDistance + scene.boundingSphereVisible.radius });
        }
        function resetCameraMove() {
            const { center, radius } = scene.boundingSphereVisible;
            const cameraDistance = linear_algebra_1.Vec3.distance(camera.position, center);
            if (cameraDistance > radius) {
                const focus = camera.getFocus(center, radius);
                camera.setState({ ...focus, minFar: 0 });
            }
            else {
                camera.setState({
                    minFar: 0,
                    radius: scene.boundingSphereVisible.radius,
                });
            }
        }
        function onLock(isLocked) {
            if (isLocked) {
                initCameraMove();
            }
            else {
                resetCameraMove();
            }
        }
        function unsetKeyState() {
            keyState.moveForward = 0;
            keyState.moveBack = 0;
            keyState.moveLeft = 0;
            keyState.moveRight = 0;
            keyState.moveUp = 0;
            keyState.moveDown = 0;
            keyState.rollLeft = 0;
            keyState.rollRight = 0;
            keyState.pitchUp = 0;
            keyState.pitchDown = 0;
            keyState.yawLeft = 0;
            keyState.yawRight = 0;
            keyState.boostMove = 0;
        }
        function onLeave() {
            unsetKeyState();
        }
        function dispose() {
            if (disposed)
                return;
            disposed = true;
            dragSub.unsubscribe();
            wheelSub.unsubscribe();
            pinchSub.unsubscribe();
            gestureSub.unsubscribe();
            interactionEndSub.unsubscribe();
            keyDownSub.unsubscribe();
            keyUpSub.unsubscribe();
            moveSub.unsubscribe();
            lockSub.unsubscribe();
            leaveSub.unsubscribe();
        }
        const _spinSpeed = linear_algebra_1.Vec2.create(0.005, 0);
        function spin(deltaT) {
            if (p.animate.name !== 'spin' || p.animate.params.speed === 0 || _isInteracting)
                return;
            const frameSpeed = p.animate.params.speed / 1000;
            _spinSpeed[0] = 60 * Math.min(Math.abs(deltaT), 1000 / 8) / 1000 * frameSpeed;
            linear_algebra_1.Vec2.add(_rotCurr, _rotPrev, _spinSpeed);
        }
        let _rockPhase = 0;
        const _rockSpeed = linear_algebra_1.Vec2.create(0.005, 0);
        function rock(deltaT) {
            if (p.animate.name !== 'rock' || p.animate.params.speed === 0 || _isInteracting)
                return;
            const dt = deltaT / 1000 * p.animate.params.speed;
            const maxAngle = (0, misc_1.degToRad)(p.animate.params.angle) / getRotateFactor();
            const angleA = Math.sin(_rockPhase * Math.PI * 2) * maxAngle;
            const angleB = Math.sin((_rockPhase + dt) * Math.PI * 2) * maxAngle;
            _rockSpeed[0] = angleB - angleA;
            linear_algebra_1.Vec2.add(_rotCurr, _rotPrev, _rockSpeed);
            _rockPhase += dt;
            if (_rockPhase >= 1) {
                _rockPhase = 0;
            }
        }
        function resetRock() {
            _rockPhase = 0;
        }
        function start(t) {
            lastUpdated = -1;
            update(t);
        }
        return {
            viewport,
            get isAnimating() { return p.animate.name !== 'off'; },
            get isMoving() {
                return (keyState.moveForward === 1 || keyState.moveBack === 1 ||
                    keyState.moveLeft === 1 || keyState.moveRight === 1 ||
                    keyState.moveUp === 1 || keyState.moveDown === 1 ||
                    keyState.rollLeft === 1 || keyState.rollRight === 1 ||
                    keyState.pitchUp === 1 || keyState.pitchDown === 1 ||
                    keyState.yawLeft === 1 || keyState.yawRight === 1);
            },
            get props() { return p; },
            setProps: (props) => {
                var _a;
                if (((_a = props.animate) === null || _a === void 0 ? void 0 : _a.name) === 'rock' && p.animate.name !== 'rock') {
                    resetRock(); // start rocking from the center
                }
                if (props.flyMode !== undefined && props.flyMode !== p.flyMode) {
                    if (props.flyMode) {
                        initCameraMove();
                    }
                    else {
                        resetCameraMove();
                    }
                }
                Object.assign(p, props);
                Object.assign(b, props.bindings);
            },
            start,
            update,
            reset,
            dispose
        };
    }
    TrackballControls.create = create;
})(TrackballControls || (exports.TrackballControls = TrackballControls = {}));
