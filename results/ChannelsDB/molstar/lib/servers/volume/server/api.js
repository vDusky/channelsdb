/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * Taken/adapted from DensityServer (https://github.com/dsehnal/DensityServer)
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
import * as File from '../common/file';
import { execute } from './query/execute';
import { ConsoleLogger } from '../../../mol-util/console-logger';
import * as DataFormat from '../common/data-format';
import { LimitsConfig } from '../config';
import { fileHandleFromDescriptor } from '../../common/file-handle';
export function getOutputFilename(source, id, { asBinary, box, detail, forcedSamplingLevel }) {
    function n(s) { return (s || '').replace(/[ \n\t]/g, '').toLowerCase(); }
    function r(v) { return Math.round(10 * v) / 10; }
    const det = forcedSamplingLevel !== void 0
        ? `l${forcedSamplingLevel}`
        : `d${Math.min(Math.max(0, detail | 0), LimitsConfig.maxOutputSizeInVoxelCountByPrecisionLevel.length - 1)}`;
    const boxInfo = box.kind === 'Cell'
        ? 'cell'
        : `${box.kind === 'Cartesian' ? 'cartn' : 'frac'}_${r(box.a[0])}_${r(box.a[1])}_${r(box.a[2])}_${r(box.b[0])}_${r(box.b[1])}_${r(box.b[2])}`;
    return `${n(source)}_${n(id)}-${boxInfo}_${det}.${asBinary ? 'bcif' : 'cif'}`;
}
/** Reads the header and includes information about available detail levels */
export async function getExtendedHeaderJson(filename, sourceId) {
    ConsoleLogger.log('Header', sourceId);
    try {
        if (!filename || !File.exists(filename)) {
            ConsoleLogger.error(`Header ${sourceId}`, 'File not found.');
            return void 0;
        }
        const header = { ...await readHeader(filename, sourceId) };
        const { sampleCount } = header.sampling[0];
        const maxVoxelCount = sampleCount[0] * sampleCount[1] * sampleCount[2];
        const precisions = LimitsConfig.maxOutputSizeInVoxelCountByPrecisionLevel
            .map((maxVoxels, precision) => ({ precision, maxVoxels }));
        const availablePrecisions = [];
        for (const p of precisions) {
            availablePrecisions.push(p);
            if (p.maxVoxels > maxVoxelCount)
                break;
        }
        header.availablePrecisions = availablePrecisions;
        header.isAvailable = true;
        return JSON.stringify(header, null, 2);
    }
    catch (e) {
        ConsoleLogger.error(`Header ${sourceId}`, e);
        return void 0;
    }
}
export async function queryBox(params, outputProvider) {
    return await execute(params, outputProvider);
}
async function readHeader(filename, sourceId) {
    let file;
    try {
        if (!filename)
            return void 0;
        file = fileHandleFromDescriptor(await File.openRead(filename), filename);
        const header = await DataFormat.readHeader(file);
        return header.header;
    }
    catch (e) {
        ConsoleLogger.error(`Info ${sourceId}`, e);
        return void 0;
    }
    finally {
        if (file)
            file.close();
    }
}
