/**
 * Copyright (c) 2019-2022 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { ValueCell } from '../../mol-util/value-cell';
import { Vec2, Vec3, Vec4 } from '../../mol-math/linear-algebra';
import { createTextureImage } from '../../mol-gl/renderable/util';
import { Color } from '../../mol-util/color';
import { createNullTexture } from '../../mol-gl/webgl/texture';
export function applyOverpaintColor(array, start, end, color) {
    for (let i = start; i < end; ++i) {
        Color.toArray(color, array, i * 4);
        array[i * 4 + 3] = 255;
    }
    return true;
}
export function clearOverpaint(array, start, end) {
    array.fill(0, start * 4, end * 4);
    return true;
}
export function createOverpaint(count, type, overpaintData) {
    const overpaint = createTextureImage(Math.max(1, count), 4, Uint8Array, overpaintData && overpaintData.tOverpaint.ref.value.array);
    if (overpaintData) {
        ValueCell.update(overpaintData.tOverpaint, overpaint);
        ValueCell.update(overpaintData.uOverpaintTexDim, Vec2.create(overpaint.width, overpaint.height));
        ValueCell.updateIfChanged(overpaintData.dOverpaint, count > 0);
        ValueCell.updateIfChanged(overpaintData.dOverpaintType, type);
        return overpaintData;
    }
    else {
        return {
            tOverpaint: ValueCell.create(overpaint),
            uOverpaintTexDim: ValueCell.create(Vec2.create(overpaint.width, overpaint.height)),
            dOverpaint: ValueCell.create(count > 0),
            tOverpaintGrid: ValueCell.create(createNullTexture()),
            uOverpaintGridDim: ValueCell.create(Vec3.create(1, 1, 1)),
            uOverpaintGridTransform: ValueCell.create(Vec4.create(0, 0, 0, 1)),
            dOverpaintType: ValueCell.create(type),
            uOverpaintStrength: ValueCell.create(1),
        };
    }
}
const emptyOverpaintTexture = { array: new Uint8Array(4), width: 1, height: 1 };
export function createEmptyOverpaint(overpaintData) {
    if (overpaintData) {
        ValueCell.update(overpaintData.tOverpaint, emptyOverpaintTexture);
        ValueCell.update(overpaintData.uOverpaintTexDim, Vec2.create(1, 1));
        return overpaintData;
    }
    else {
        return {
            tOverpaint: ValueCell.create(emptyOverpaintTexture),
            uOverpaintTexDim: ValueCell.create(Vec2.create(1, 1)),
            dOverpaint: ValueCell.create(false),
            tOverpaintGrid: ValueCell.create(createNullTexture()),
            uOverpaintGridDim: ValueCell.create(Vec3.create(1, 1, 1)),
            uOverpaintGridTransform: ValueCell.create(Vec4.create(0, 0, 0, 1)),
            dOverpaintType: ValueCell.create('groupInstance'),
            uOverpaintStrength: ValueCell.create(1),
        };
    }
}
