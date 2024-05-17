/**
 * Copyright (c) 2018-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { ValueCell } from '../../../mol-util';
import { Vec3, Vec4 } from '../../../mol-math/linear-algebra';
import { transformPositionArray, createGroupMapping } from '../../util';
import { createColors } from '../color-data';
import { createMarkers } from '../marker-data';
import { createSizes } from '../size-data';
import { LocationIterator, PositionLocation } from '../../util/location-iterator';
import { LinesBuilder } from './lines-builder';
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { calculateInvariantBoundingSphere, calculateTransformBoundingSphere } from '../../../mol-gl/renderable/util';
import { Sphere3D } from '../../../mol-math/geometry';
import { BaseGeometry } from '../base';
import { createEmptyOverpaint } from '../overpaint-data';
import { createEmptyTransparency } from '../transparency-data';
import { hashFnv32a } from '../../../mol-data/util';
import { createEmptyClipping } from '../clipping-data';
import { createEmptySubstance } from '../substance-data';
export var Lines;
(function (Lines) {
    function create(mappings, indices, groups, starts, ends, lineCount, lines) {
        return lines ?
            update(mappings, indices, groups, starts, ends, lineCount, lines) :
            fromArrays(mappings, indices, groups, starts, ends, lineCount);
    }
    Lines.create = create;
    function createEmpty(lines) {
        const mb = lines ? lines.mappingBuffer.ref.value : new Float32Array(0);
        const ib = lines ? lines.indexBuffer.ref.value : new Uint32Array(0);
        const gb = lines ? lines.groupBuffer.ref.value : new Float32Array(0);
        const sb = lines ? lines.startBuffer.ref.value : new Float32Array(0);
        const eb = lines ? lines.endBuffer.ref.value : new Float32Array(0);
        return create(mb, ib, gb, sb, eb, 0, lines);
    }
    Lines.createEmpty = createEmpty;
    function fromMesh(mesh, lines) {
        const vb = mesh.vertexBuffer.ref.value;
        const ib = mesh.indexBuffer.ref.value;
        const gb = mesh.groupBuffer.ref.value;
        const builder = LinesBuilder.create(mesh.triangleCount * 3, mesh.triangleCount / 10, lines);
        // TODO avoid duplicate lines
        for (let i = 0, il = mesh.triangleCount * 3; i < il; i += 3) {
            const i0 = ib[i], i1 = ib[i + 1], i2 = ib[i + 2];
            const x0 = vb[i0 * 3], y0 = vb[i0 * 3 + 1], z0 = vb[i0 * 3 + 2];
            const x1 = vb[i1 * 3], y1 = vb[i1 * 3 + 1], z1 = vb[i1 * 3 + 2];
            const x2 = vb[i2 * 3], y2 = vb[i2 * 3 + 1], z2 = vb[i2 * 3 + 2];
            builder.add(x0, y0, z0, x1, y1, z1, gb[i0]);
            builder.add(x0, y0, z0, x2, y2, z2, gb[i0]);
            builder.add(x1, y1, z1, x2, y2, z2, gb[i1]);
        }
        return builder.getLines();
    }
    Lines.fromMesh = fromMesh;
    function hashCode(lines) {
        return hashFnv32a([
            lines.lineCount, lines.mappingBuffer.ref.version, lines.indexBuffer.ref.version,
            lines.groupBuffer.ref.version, lines.startBuffer.ref.version, lines.endBuffer.ref.version
        ]);
    }
    function fromArrays(mappings, indices, groups, starts, ends, lineCount) {
        const boundingSphere = Sphere3D();
        let groupMapping;
        let currentHash = -1;
        let currentGroup = -1;
        const lines = {
            kind: 'lines',
            lineCount,
            mappingBuffer: ValueCell.create(mappings),
            indexBuffer: ValueCell.create(indices),
            groupBuffer: ValueCell.create(groups),
            startBuffer: ValueCell.create(starts),
            endBuffer: ValueCell.create(ends),
            get boundingSphere() {
                const newHash = hashCode(lines);
                if (newHash !== currentHash) {
                    const s = calculateInvariantBoundingSphere(lines.startBuffer.ref.value, lines.lineCount * 4, 4);
                    const e = calculateInvariantBoundingSphere(lines.endBuffer.ref.value, lines.lineCount * 4, 4);
                    Sphere3D.expandBySphere(boundingSphere, s, e);
                    currentHash = newHash;
                }
                return boundingSphere;
            },
            get groupMapping() {
                if (lines.groupBuffer.ref.version !== currentGroup) {
                    groupMapping = createGroupMapping(lines.groupBuffer.ref.value, lines.lineCount, 4);
                    currentGroup = lines.groupBuffer.ref.version;
                }
                return groupMapping;
            },
            setBoundingSphere(sphere) {
                Sphere3D.copy(boundingSphere, sphere);
                currentHash = hashCode(lines);
            }
        };
        return lines;
    }
    function update(mappings, indices, groups, starts, ends, lineCount, lines) {
        if (lineCount > lines.lineCount) {
            ValueCell.update(lines.mappingBuffer, mappings);
            ValueCell.update(lines.indexBuffer, indices);
        }
        lines.lineCount = lineCount;
        ValueCell.update(lines.groupBuffer, groups);
        ValueCell.update(lines.startBuffer, starts);
        ValueCell.update(lines.endBuffer, ends);
        return lines;
    }
    function transform(lines, t) {
        const start = lines.startBuffer.ref.value;
        transformPositionArray(t, start, 0, lines.lineCount * 4);
        ValueCell.update(lines.startBuffer, start);
        const end = lines.endBuffer.ref.value;
        transformPositionArray(t, end, 0, lines.lineCount * 4);
        ValueCell.update(lines.endBuffer, end);
    }
    Lines.transform = transform;
    //
    Lines.Params = {
        ...BaseGeometry.Params,
        sizeFactor: PD.Numeric(2, { min: 0, max: 10, step: 0.1 }),
        lineSizeAttenuation: PD.Boolean(false),
    };
    Lines.Utils = {
        Params: Lines.Params,
        createEmpty,
        createValues,
        createValuesSimple,
        updateValues,
        updateBoundingSphere,
        createRenderableState: BaseGeometry.createRenderableState,
        updateRenderableState: BaseGeometry.updateRenderableState,
        createPositionIterator
    };
    function createPositionIterator(lines, transform) {
        const groupCount = lines.lineCount * 4;
        const instanceCount = transform.instanceCount.ref.value;
        const location = PositionLocation();
        const p = location.position;
        const s = lines.startBuffer.ref.value;
        const e = lines.endBuffer.ref.value;
        const m = transform.aTransform.ref.value;
        const getLocation = (groupIndex, instanceIndex) => {
            const v = groupIndex % 4 === 0 ? s : e;
            if (instanceIndex < 0) {
                Vec3.fromArray(p, v, groupIndex * 3);
            }
            else {
                Vec3.transformMat4Offset(p, v, m, 0, groupIndex * 3, instanceIndex * 16);
            }
            return location;
        };
        return LocationIterator(groupCount, instanceCount, 2, getLocation);
    }
    function createValues(lines, transform, locationIt, theme, props) {
        const { instanceCount, groupCount } = locationIt;
        const positionIt = createPositionIterator(lines, transform);
        const color = createColors(locationIt, positionIt, theme.color);
        const size = createSizes(locationIt, theme.size);
        const marker = props.instanceGranularity
            ? createMarkers(instanceCount, 'instance')
            : createMarkers(instanceCount * groupCount, 'groupInstance');
        const overpaint = createEmptyOverpaint();
        const transparency = createEmptyTransparency();
        const material = createEmptySubstance();
        const clipping = createEmptyClipping();
        const counts = { drawCount: lines.lineCount * 2 * 3, vertexCount: lines.lineCount * 4, groupCount, instanceCount };
        const invariantBoundingSphere = Sphere3D.clone(lines.boundingSphere);
        const boundingSphere = calculateTransformBoundingSphere(invariantBoundingSphere, transform.aTransform.ref.value, instanceCount, 0);
        return {
            dGeometryType: ValueCell.create('lines'),
            aMapping: lines.mappingBuffer,
            aGroup: lines.groupBuffer,
            aStart: lines.startBuffer,
            aEnd: lines.endBuffer,
            elements: lines.indexBuffer,
            boundingSphere: ValueCell.create(boundingSphere),
            invariantBoundingSphere: ValueCell.create(invariantBoundingSphere),
            uInvariantBoundingSphere: ValueCell.create(Vec4.ofSphere(invariantBoundingSphere)),
            ...color,
            ...size,
            ...marker,
            ...overpaint,
            ...transparency,
            ...material,
            ...clipping,
            ...transform,
            ...BaseGeometry.createValues(props, counts),
            uSizeFactor: ValueCell.create(props.sizeFactor),
            dLineSizeAttenuation: ValueCell.create(props.lineSizeAttenuation),
            uDoubleSided: ValueCell.create(true),
            dFlipSided: ValueCell.create(false),
        };
    }
    function createValuesSimple(lines, props, colorValue, sizeValue, transform) {
        const s = BaseGeometry.createSimple(colorValue, sizeValue, transform);
        const p = { ...PD.getDefaultValues(Lines.Params), ...props };
        return createValues(lines, s.transform, s.locationIterator, s.theme, p);
    }
    function updateValues(values, props) {
        BaseGeometry.updateValues(values, props);
        ValueCell.updateIfChanged(values.uSizeFactor, props.sizeFactor);
        ValueCell.updateIfChanged(values.dLineSizeAttenuation, props.lineSizeAttenuation);
    }
    function updateBoundingSphere(values, lines) {
        const invariantBoundingSphere = Sphere3D.clone(lines.boundingSphere);
        const boundingSphere = calculateTransformBoundingSphere(invariantBoundingSphere, values.aTransform.ref.value, values.instanceCount.ref.value, 0);
        if (!Sphere3D.equals(boundingSphere, values.boundingSphere.ref.value)) {
            ValueCell.update(values.boundingSphere, boundingSphere);
        }
        if (!Sphere3D.equals(invariantBoundingSphere, values.invariantBoundingSphere.ref.value)) {
            ValueCell.update(values.invariantBoundingSphere, invariantBoundingSphere);
            ValueCell.update(values.uInvariantBoundingSphere, Vec4.fromSphere(values.uInvariantBoundingSphere.ref.value, invariantBoundingSphere));
        }
    }
})(Lines || (Lines = {}));
