/**
 * Copyright (c) 2020-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { StructureRepresentation, StructureRepresentationProvider } from '../representation';
import { RepresentationParamsGetter, RepresentationContext } from '../../../mol-repr/representation';
import { ThemeRegistryContext } from '../../../mol-theme/theme';
import { Structure } from '../../../mol-model/structure';
export declare const LineParams: {
    pointStyle: PD.Select<"square" | "circle" | "fuzzy">;
    multipleBonds: PD.Select<"off" | "symmetric" | "offset">;
    includeParent: PD.BooleanParam;
    sizeFactor: PD.Numeric;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    visuals: PD.MultiSelect<"intra-bond" | "inter-bond" | "element-point" | "element-cross">;
    lineSizeAttenuation: PD.BooleanParam;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    traceOnly: PD.BooleanParam;
    crosses: PD.Select<"all" | "lone">;
    crossSize: PD.Numeric;
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
    pointSizeAttenuation: PD.BooleanParam;
    stride: PD.Numeric;
    includeTypes: PD.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
    excludeTypes: PD.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
    aromaticBonds: PD.BooleanParam;
    linkScale: PD.Numeric;
    linkSpacing: PD.Numeric;
    aromaticDashCount: PD.Numeric;
    dashCount: PD.Numeric;
};
export type LineParams = typeof LineParams;
export declare function getLineParams(ctx: ThemeRegistryContext, structure: Structure): {
    pointStyle: PD.Select<"square" | "circle" | "fuzzy">;
    multipleBonds: PD.Select<"off" | "symmetric" | "offset">;
    includeParent: PD.BooleanParam;
    sizeFactor: PD.Numeric;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    visuals: PD.MultiSelect<"intra-bond" | "inter-bond" | "element-point" | "element-cross">;
    lineSizeAttenuation: PD.BooleanParam;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    traceOnly: PD.BooleanParam;
    crosses: PD.Select<"all" | "lone">;
    crossSize: PD.Numeric;
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
    pointSizeAttenuation: PD.BooleanParam;
    stride: PD.Numeric;
    includeTypes: PD.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
    excludeTypes: PD.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
    aromaticBonds: PD.BooleanParam;
    linkScale: PD.Numeric;
    linkSpacing: PD.Numeric;
    aromaticDashCount: PD.Numeric;
    dashCount: PD.Numeric;
};
export type LineRepresentation = StructureRepresentation<LineParams>;
export declare function LineRepresentation(ctx: RepresentationContext, getParams: RepresentationParamsGetter<Structure, LineParams>): LineRepresentation;
export declare const LineRepresentationProvider: StructureRepresentationProvider<{
    pointStyle: PD.Select<"square" | "circle" | "fuzzy">;
    multipleBonds: PD.Select<"off" | "symmetric" | "offset">;
    includeParent: PD.BooleanParam;
    sizeFactor: PD.Numeric;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    visuals: PD.MultiSelect<"intra-bond" | "inter-bond" | "element-point" | "element-cross">;
    lineSizeAttenuation: PD.BooleanParam;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    traceOnly: PD.BooleanParam;
    crosses: PD.Select<"all" | "lone">;
    crossSize: PD.Numeric;
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
    pointSizeAttenuation: PD.BooleanParam;
    stride: PD.Numeric;
    includeTypes: PD.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
    excludeTypes: PD.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
    aromaticBonds: PD.BooleanParam;
    linkScale: PD.Numeric;
    linkSpacing: PD.Numeric;
    aromaticDashCount: PD.Numeric;
    dashCount: PD.Numeric;
}, "line">;
