/**
 * Copyright (c) 2018-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { UnitsVisual } from '../units-visual';
export declare const PolymerTraceMeshParams: {
    sizeFactor: PD.Numeric;
    aspectRatio: PD.Numeric;
    arrowFactor: PD.Numeric;
    tubularHelices: PD.BooleanParam;
    helixProfile: PD.Select<"square" | "elliptical" | "rounded">;
    nucleicProfile: PD.Select<"square" | "elliptical" | "rounded">;
    detail: PD.Numeric;
    linearSegments: PD.Numeric;
    radialSegments: PD.Numeric;
};
export declare const DefaultPolymerTraceMeshProps: PD.Values<{
    sizeFactor: PD.Numeric;
    aspectRatio: PD.Numeric;
    arrowFactor: PD.Numeric;
    tubularHelices: PD.BooleanParam;
    helixProfile: PD.Select<"square" | "elliptical" | "rounded">;
    nucleicProfile: PD.Select<"square" | "elliptical" | "rounded">;
    detail: PD.Numeric;
    linearSegments: PD.Numeric;
    radialSegments: PD.Numeric;
}>;
export type PolymerTraceMeshProps = typeof DefaultPolymerTraceMeshProps;
export declare const PolymerTraceParams: {
    sizeFactor: PD.Numeric;
    aspectRatio: PD.Numeric;
    arrowFactor: PD.Numeric;
    tubularHelices: PD.BooleanParam;
    helixProfile: PD.Select<"square" | "elliptical" | "rounded">;
    nucleicProfile: PD.Select<"square" | "elliptical" | "rounded">;
    detail: PD.Numeric;
    linearSegments: PD.Numeric;
    radialSegments: PD.Numeric;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    includeParent: PD.BooleanParam;
    doubleSided: PD.BooleanParam;
    flipSided: PD.BooleanParam;
    flatShaded: PD.BooleanParam;
    ignoreLight: PD.BooleanParam;
    xrayShaded: PD.Select<boolean | "inverted">;
    transparentBackfaces: PD.Select<"off" | "on" | "opaque">;
    bumpFrequency: PD.Numeric;
    bumpAmplitude: PD.Numeric;
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
export type PolymerTraceParams = typeof PolymerTraceParams;
export declare function PolymerTraceVisual(materialId: number): UnitsVisual<PolymerTraceParams>;
