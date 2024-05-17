/**
 * Copyright (c) 2018-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author Gianluca Tomasello <giagitom@gmail.com>
 */
import { Structure } from '../../../mol-model/structure';
import { RepresentationContext, RepresentationParamsGetter } from '../../../mol-repr/representation';
import { ThemeRegistryContext } from '../../../mol-theme/theme';
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { StructureRepresentation, StructureRepresentationProvider } from '../representation';
export declare const CartoonParams: {
    sizeFactor: PD.Numeric;
    visuals: PD.MultiSelect<"polymer-trace" | "polymer-gap" | "nucleotide-ring" | "nucleotide-atomic-ring-fill" | "nucleotide-atomic-bond" | "nucleotide-atomic-element" | "nucleotide-block" | "direction-wedge">;
    bumpFrequency: PD.Numeric;
    colorMode: PD.Select<"default" | "interpolate">;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    includeParent: PD.BooleanParam;
    doubleSided: PD.BooleanParam;
    flipSided: PD.BooleanParam;
    flatShaded: PD.BooleanParam;
    ignoreLight: PD.BooleanParam;
    xrayShaded: PD.Select<boolean | "inverted">;
    transparentBackfaces: PD.Select<"off" | "on" | "opaque">;
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
    thicknessFactor: PD.Numeric;
    detail: PD.Numeric;
    tryUseImpostor: PD.BooleanParam;
    solidInterior: PD.BooleanParam;
    clipPrimitive: PD.BooleanParam;
    approximate: PD.BooleanParam;
    alphaThickness: PD.Numeric;
    lodLevels: PD.ObjectList<PD.Normalize<{
        minDistance: number;
        maxDistance: number;
        overlap: number;
        stride: number;
        scaleBias: number;
    }>>;
    radialSegments: PD.Numeric;
    sizeAspectRatio: PD.Numeric;
    aspectRatio: PD.Numeric;
    arrowFactor: PD.Numeric;
    tubularHelices: PD.BooleanParam;
    helixProfile: PD.Select<"square" | "elliptical" | "rounded">;
    nucleicProfile: PD.Select<"square" | "elliptical" | "rounded">;
    linearSegments: PD.Numeric;
};
export type CartoonParams = typeof CartoonParams;
export declare function getCartoonParams(ctx: ThemeRegistryContext, structure: Structure): {
    sizeFactor: PD.Numeric;
    visuals: PD.MultiSelect<"polymer-trace" | "polymer-gap" | "nucleotide-ring" | "nucleotide-atomic-ring-fill" | "nucleotide-atomic-bond" | "nucleotide-atomic-element" | "nucleotide-block" | "direction-wedge">;
    bumpFrequency: PD.Numeric;
    colorMode: PD.Select<"default" | "interpolate">;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    includeParent: PD.BooleanParam;
    doubleSided: PD.BooleanParam;
    flipSided: PD.BooleanParam;
    flatShaded: PD.BooleanParam;
    ignoreLight: PD.BooleanParam;
    xrayShaded: PD.Select<boolean | "inverted">;
    transparentBackfaces: PD.Select<"off" | "on" | "opaque">;
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
    thicknessFactor: PD.Numeric;
    detail: PD.Numeric;
    tryUseImpostor: PD.BooleanParam;
    solidInterior: PD.BooleanParam;
    clipPrimitive: PD.BooleanParam;
    approximate: PD.BooleanParam;
    alphaThickness: PD.Numeric;
    lodLevels: PD.ObjectList<PD.Normalize<{
        minDistance: number;
        maxDistance: number;
        overlap: number;
        stride: number;
        scaleBias: number;
    }>>;
    radialSegments: PD.Numeric;
    sizeAspectRatio: PD.Numeric;
    aspectRatio: PD.Numeric;
    arrowFactor: PD.Numeric;
    tubularHelices: PD.BooleanParam;
    helixProfile: PD.Select<"square" | "elliptical" | "rounded">;
    nucleicProfile: PD.Select<"square" | "elliptical" | "rounded">;
    linearSegments: PD.Numeric;
};
export type CartoonRepresentation = StructureRepresentation<CartoonParams>;
export declare function CartoonRepresentation(ctx: RepresentationContext, getParams: RepresentationParamsGetter<Structure, CartoonParams>): CartoonRepresentation;
export declare const CartoonRepresentationProvider: StructureRepresentationProvider<{
    sizeFactor: PD.Numeric;
    visuals: PD.MultiSelect<"polymer-trace" | "polymer-gap" | "nucleotide-ring" | "nucleotide-atomic-ring-fill" | "nucleotide-atomic-bond" | "nucleotide-atomic-element" | "nucleotide-block" | "direction-wedge">;
    bumpFrequency: PD.Numeric;
    colorMode: PD.Select<"default" | "interpolate">;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    includeParent: PD.BooleanParam;
    doubleSided: PD.BooleanParam;
    flipSided: PD.BooleanParam;
    flatShaded: PD.BooleanParam;
    ignoreLight: PD.BooleanParam;
    xrayShaded: PD.Select<boolean | "inverted">;
    transparentBackfaces: PD.Select<"off" | "on" | "opaque">;
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
    thicknessFactor: PD.Numeric;
    detail: PD.Numeric;
    tryUseImpostor: PD.BooleanParam;
    solidInterior: PD.BooleanParam;
    clipPrimitive: PD.BooleanParam;
    approximate: PD.BooleanParam;
    alphaThickness: PD.Numeric;
    lodLevels: PD.ObjectList<PD.Normalize<{
        minDistance: number;
        maxDistance: number;
        overlap: number;
        stride: number;
        scaleBias: number;
    }>>;
    radialSegments: PD.Numeric;
    sizeAspectRatio: PD.Numeric;
    aspectRatio: PD.Numeric;
    arrowFactor: PD.Numeric;
    tubularHelices: PD.BooleanParam;
    helixProfile: PD.Select<"square" | "elliptical" | "rounded">;
    nucleicProfile: PD.Select<"square" | "elliptical" | "rounded">;
    linearSegments: PD.Numeric;
}, "cartoon">;
