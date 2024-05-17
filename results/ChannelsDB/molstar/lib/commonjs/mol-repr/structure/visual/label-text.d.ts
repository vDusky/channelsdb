/**
 * Copyright (c) 2019-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 */
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { ComplexVisual } from '../complex-visual';
export declare const LabelTextParams: {
    background: PD.BooleanParam;
    backgroundMargin: PD.Numeric;
    backgroundColor: PD.Color;
    backgroundOpacity: PD.Numeric;
    borderWidth: PD.Numeric;
    level: PD.Select<"residue" | "chain" | "element">;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    chainScale: PD.Numeric;
    residueScale: PD.Numeric;
    elementScale: PD.Numeric;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    includeParent: PD.BooleanParam;
    sizeFactor: PD.Numeric;
    borderColor: PD.Color;
    offsetX: PD.Numeric;
    offsetY: PD.Numeric;
    offsetZ: PD.Numeric;
    tether: PD.BooleanParam;
    tetherLength: PD.Numeric;
    tetherBaseWidth: PD.Numeric;
    attachment: PD.Select<"middle-center" | "bottom-left" | "bottom-center" | "bottom-right" | "middle-left" | "middle-right" | "top-left" | "top-center" | "top-right">;
    fontFamily: PD.Select<import("../../../mol-geo/geometry/text/font-atlas").FontFamily>;
    fontQuality: PD.Select<number>;
    fontStyle: PD.Select<import("../../../mol-geo/geometry/text/font-atlas").FontStyle>;
    fontVariant: PD.Select<import("../../../mol-geo/geometry/text/font-atlas").FontVariant>;
    fontWeight: PD.Select<import("../../../mol-geo/geometry/text/font-atlas").FontWeight>;
    alpha: PD.Numeric;
    quality: PD.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
    material: PD.Group<PD.Normalize<{
        metalness: number;
        roughness: number;
        bumpiness: number;
    }>>;
    clip: PD.Group<PD.Normalize<{
        variant: import("../../../mol-util/clip").Clip.Variant;
        objects: PD.Normalize<{
            type: any;
            invert: any;
            position: any;
            rotation: any;
            scale: any;
        }>[];
    }>>;
    instanceGranularity: PD.BooleanParam;
    lod: PD.Vec3;
    cellSize: PD.Numeric;
    batchSize: PD.Numeric;
};
export type LabelTextParams = typeof LabelTextParams;
export type LabelTextProps = PD.Values<LabelTextParams>;
export type LabelLevels = LabelTextProps['level'];
export declare function LabelTextVisual(materialId: number): ComplexVisual<LabelTextParams>;
