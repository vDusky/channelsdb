"use strict";
/**
 * Copyright (c) 2018-2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleLegend = exports.TableLegend = void 0;
function TableLegend(table) {
    return { kind: 'table-legend', table };
}
exports.TableLegend = TableLegend;
function ScaleLegend(minLabel, maxLabel, colors) {
    return { kind: 'scale-legend', minLabel, maxLabel, colors };
}
exports.ScaleLegend = ScaleLegend;
