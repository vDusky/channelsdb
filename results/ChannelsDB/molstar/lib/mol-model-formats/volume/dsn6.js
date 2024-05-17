/**
 * Copyright (c) 2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { Task } from '../../mol-task';
import { SpacegroupCell, Box3D } from '../../mol-math/geometry';
import { Tensor, Vec3 } from '../../mol-math/linear-algebra';
import { degToRad } from '../../mol-math/misc';
import { arrayMin, arrayMax, arrayMean, arrayRms } from '../../mol-util/array';
import { CustomProperties } from '../../mol-model/custom-property';
export function volumeFromDsn6(source, params) {
    return Task.create('Create Volume', async (ctx) => {
        const { header, values } = source;
        const size = Vec3.create(header.xlen, header.ylen, header.zlen);
        if (params && params.voxelSize)
            Vec3.mul(size, size, params.voxelSize);
        const angles = Vec3.create(degToRad(header.alpha), degToRad(header.beta), degToRad(header.gamma));
        const cell = SpacegroupCell.create('P 1', size, angles);
        const grid = [header.xRate, header.yRate, header.zRate];
        const extent = [header.xExtent, header.yExtent, header.zExtent];
        const gridOrigin = [header.xStart, header.yStart, header.zStart];
        const origin_frac = Vec3.create(gridOrigin[0] / grid[0], gridOrigin[1] / grid[1], gridOrigin[2] / grid[2]);
        const dimensions_frac = Vec3.create(extent[0] / grid[0], extent[1] / grid[1], extent[2] / grid[2]);
        const space = Tensor.Space(extent, [0, 1, 2], Float32Array);
        const data = Tensor.create(space, Tensor.Data1(values));
        return {
            label: params === null || params === void 0 ? void 0 : params.label,
            entryId: params === null || params === void 0 ? void 0 : params.entryId,
            grid: {
                transform: { kind: 'spacegroup', cell, fractionalBox: Box3D.create(origin_frac, Vec3.add(Vec3.zero(), origin_frac, dimensions_frac)) },
                cells: data,
                stats: {
                    min: arrayMin(values),
                    max: arrayMax(values),
                    mean: arrayMean(values),
                    sigma: header.sigma !== undefined ? header.sigma : arrayRms(values)
                },
            },
            sourceData: Dsn6Format.create(source),
            customProperties: new CustomProperties(),
            _propertyData: Object.create(null),
        };
    });
}
//
export { Dsn6Format };
var Dsn6Format;
(function (Dsn6Format) {
    function is(x) {
        return (x === null || x === void 0 ? void 0 : x.kind) === 'dsn6';
    }
    Dsn6Format.is = is;
    function create(dsn6) {
        return { kind: 'dsn6', name: dsn6.name, data: dsn6 };
    }
    Dsn6Format.create = create;
})(Dsn6Format || (Dsn6Format = {}));
