/**
 * Copyright (c) 2018-2021 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { Structure } from '../../mol-model/structure';
import { RepresentationRegistry, RepresentationProvider } from '../representation';
import { StructureRepresentationState } from './representation';
export declare class StructureRepresentationRegistry extends RepresentationRegistry<Structure, StructureRepresentationState> {
    constructor();
}
export declare namespace StructureRepresentationRegistry {
    export const BuiltIn: {
        cartoon: import("./representation").StructureRepresentationProvider<{
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"polymer-trace" | "polymer-gap" | "nucleotide-ring" | "nucleotide-atomic-ring-fill" | "nucleotide-atomic-bond" | "nucleotide-atomic-element" | "nucleotide-block" | "direction-wedge">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            colorMode: import("../../mol-util/param-definition").ParamDefinition.Select<"default" | "interpolate">;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            thicknessFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tryUseImpostor: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            solidInterior: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            clipPrimitive: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            approximate: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            alphaThickness: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            lodLevels: import("../../mol-util/param-definition").ParamDefinition.ObjectList<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                minDistance: number;
                maxDistance: number;
                overlap: number;
                stride: number;
                scaleBias: number;
            }>>;
            radialSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeAspectRatio: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aspectRatio: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            arrowFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tubularHelices: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            helixProfile: import("../../mol-util/param-definition").ParamDefinition.Select<"square" | "elliptical" | "rounded">;
            nucleicProfile: import("../../mol-util/param-definition").ParamDefinition.Select<"square" | "elliptical" | "rounded">;
            linearSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "cartoon">;
        backbone: import("./representation").StructureRepresentationProvider<{
            sizeAspectRatio: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"polymer-gap" | "polymer-backbone-cylinder" | "polymer-backbone-sphere">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            colorMode: import("../../mol-util/param-definition").ParamDefinition.Select<"default" | "interpolate">;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            radialSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tryUseImpostor: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            solidInterior: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            clipPrimitive: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            approximate: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            alphaThickness: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            lodLevels: import("../../mol-util/param-definition").ParamDefinition.ObjectList<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                minDistance: number;
                maxDistance: number;
                overlap: number;
                stride: number;
                scaleBias: number;
            }>>;
        }, "backbone">;
        'ball-and-stick': import("./representation").StructureRepresentationProvider<{
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeAspectRatio: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"element-sphere" | "intra-bond" | "inter-bond">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tryUseImpostor: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            adjustCylinderLength: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            includeTypes: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
            excludeTypes: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            aromaticBonds: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            multipleBonds: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "symmetric" | "offset">;
            linkScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            aromaticScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticDashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            stubCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            radialSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            colorMode: import("../../mol-util/param-definition").ParamDefinition.Select<"default" | "interpolate">;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            solidInterior: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            stride: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            clipPrimitive: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            approximate: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            alphaThickness: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            lodLevels: import("../../mol-util/param-definition").ParamDefinition.ObjectList<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                minDistance: number;
                maxDistance: number;
                overlap: number;
                stride: number;
                scaleBias: number;
            }>>;
        }, "ball-and-stick">;
        carbohydrate: import("./representation").StructureRepresentationProvider<{
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"carbohydrate-symbol" | "carbohydrate-link" | "carbohydrate-terminal-link">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            terminalLinkSizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            aromaticScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticDashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            stubCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            radialSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            colorMode: import("../../mol-util/param-definition").ParamDefinition.Select<"default" | "interpolate">;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkSizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "carbohydrate">;
        ellipsoid: import("./representation").StructureRepresentationProvider<{
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            adjustCylinderLength: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeAspectRatio: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"intra-bond" | "inter-bond" | "ellipsoid-mesh">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tryUseImpostor: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            includeTypes: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
            excludeTypes: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            aromaticBonds: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            multipleBonds: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "symmetric" | "offset">;
            linkScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticDashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            stubCap: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            radialSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            colorMode: import("../../mol-util/param-definition").ParamDefinition.Select<"default" | "interpolate">;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            solidInterior: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "ellipsoid">;
        'gaussian-surface': import("./representation").StructureRepresentationProvider<{
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"gaussian-surface-mesh" | "structure-gaussian-surface-mesh" | "gaussian-surface-wireframe">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            lineSizeAttenuation: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            resolution: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            radiusOffset: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            smoothness: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tryUseGpu: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            smoothColors: import("../../mol-util/param-definition").ParamDefinition.Mapped<import("../../mol-util/param-definition").ParamDefinition.NamedParams<import("../../mol-util/param-definition").ParamDefinition.Normalize<unknown>, "off"> | import("../../mol-util/param-definition").ParamDefinition.NamedParams<import("../../mol-util/param-definition").ParamDefinition.Normalize<unknown>, "auto"> | import("../../mol-util/param-definition").ParamDefinition.NamedParams<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                resolutionFactor: number;
                sampleStride: number;
            }>, "on">>;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "gaussian-surface">;
        'gaussian-volume': import("./representation").StructureRepresentationProvider<{
            jumpLength: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"gaussian-volume" | "units-gaussian-volume">;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            resolution: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            radiusOffset: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            smoothness: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            controlPoints: import("../../mol-util/param-definition").ParamDefinition.LineGraph;
            stepsPerCell: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "gaussian-volume">;
        label: import("./representation").StructureRepresentationProvider<{
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"label-text">;
            background: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            backgroundMargin: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            backgroundColor: import("../../mol-util/param-definition").ParamDefinition.Color;
            backgroundOpacity: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            borderWidth: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            level: import("../../mol-util/param-definition").ParamDefinition.Select<"residue" | "chain" | "element">;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            chainScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            residueScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            elementScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            borderColor: import("../../mol-util/param-definition").ParamDefinition.Color;
            offsetX: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            offsetY: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            offsetZ: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tether: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            tetherLength: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            tetherBaseWidth: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            attachment: import("../../mol-util/param-definition").ParamDefinition.Select<"middle-center" | "bottom-left" | "bottom-center" | "bottom-right" | "middle-left" | "middle-right" | "top-left" | "top-center" | "top-right">;
            fontFamily: import("../../mol-util/param-definition").ParamDefinition.Select<import("../../mol-geo/geometry/text/font-atlas").FontFamily>;
            fontQuality: import("../../mol-util/param-definition").ParamDefinition.Select<number>;
            fontStyle: import("../../mol-util/param-definition").ParamDefinition.Select<import("../../mol-geo/geometry/text/font-atlas").FontStyle>;
            fontVariant: import("../../mol-util/param-definition").ParamDefinition.Select<import("../../mol-geo/geometry/text/font-atlas").FontVariant>;
            fontWeight: import("../../mol-util/param-definition").ParamDefinition.Select<import("../../mol-geo/geometry/text/font-atlas").FontWeight>;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "label">;
        line: import("./representation").StructureRepresentationProvider<{
            pointStyle: import("../../mol-util/param-definition").ParamDefinition.Select<"square" | "circle" | "fuzzy">;
            multipleBonds: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "symmetric" | "offset">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"intra-bond" | "inter-bond" | "element-point" | "element-cross">;
            lineSizeAttenuation: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            crosses: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "lone">;
            crossSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            pointSizeAttenuation: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            stride: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            includeTypes: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
            excludeTypes: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"covalent" | "computed" | "aromatic" | "metal-coordination" | "hydrogen-bond" | "disulfide">;
            aromaticBonds: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            linkScale: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linkSpacing: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            aromaticDashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            dashCount: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "line">;
        'molecular-surface': import("./representation").StructureRepresentationProvider<{
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"molecular-surface-mesh" | "structure-molecular-surface-mesh" | "molecular-surface-wireframe">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            probeRadius: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            resolution: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            probePositions: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            lineSizeAttenuation: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            smoothColors: import("../../mol-util/param-definition").ParamDefinition.Mapped<import("../../mol-util/param-definition").ParamDefinition.NamedParams<import("../../mol-util/param-definition").ParamDefinition.Normalize<unknown>, "off"> | import("../../mol-util/param-definition").ParamDefinition.NamedParams<import("../../mol-util/param-definition").ParamDefinition.Normalize<unknown>, "auto"> | import("../../mol-util/param-definition").ParamDefinition.NamedParams<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                resolutionFactor: number;
                sampleStride: number;
            }>, "on">>;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "molecular-surface">;
        orientation: import("./representation").StructureRepresentationProvider<{
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"orientation-ellipsoid-mesh">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "orientation">;
        point: import("./representation").StructureRepresentationProvider<{
            pointSizeAttenuation: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            stride: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            pointStyle: import("../../mol-util/param-definition").ParamDefinition.Select<"square" | "circle" | "fuzzy">;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "point">;
        putty: import("./representation").StructureRepresentationProvider<{
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"polymer-gap" | "polymer-tube">;
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            radialSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            linearSegments: import("../../mol-util/param-definition").ParamDefinition.Numeric;
        }, "putty">;
        spacefill: import("./representation").StructureRepresentationProvider<{
            bumpFrequency: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            visuals: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"element-sphere" | "structure-element-sphere">;
            sizeFactor: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            detail: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            ignoreHydrogens: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreHydrogensVariant: import("../../mol-util/param-definition").ParamDefinition.Select<"all" | "non-polar">;
            traceOnly: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            tryUseImpostor: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            stride: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            unitKinds: import("../../mol-util/param-definition").ParamDefinition.MultiSelect<"spheres" | "atomic" | "gaussians">;
            includeParent: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            doubleSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            ignoreLight: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            xrayShaded: import("../../mol-util/param-definition").ParamDefinition.Select<boolean | "inverted">;
            transparentBackfaces: import("../../mol-util/param-definition").ParamDefinition.Select<"off" | "on" | "opaque">;
            solidInterior: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            clipPrimitive: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            approximate: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            alphaThickness: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            bumpAmplitude: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            lodLevels: import("../../mol-util/param-definition").ParamDefinition.ObjectList<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                minDistance: number;
                maxDistance: number;
                overlap: number;
                stride: number;
                scaleBias: number;
            }>>;
            alpha: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            quality: import("../../mol-util/param-definition").ParamDefinition.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
            material: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                metalness: number;
                roughness: number;
                bumpiness: number;
            }>>;
            clip: import("../../mol-util/param-definition").ParamDefinition.Group<import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                variant: import("../../mol-util/clip").Clip.Variant;
                objects: import("../../mol-util/param-definition").ParamDefinition.Normalize<{
                    type: any;
                    invert: any;
                    position: any;
                    rotation: any;
                    scale: any;
                }>[];
            }>>;
            instanceGranularity: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            lod: import("../../mol-util/param-definition").ParamDefinition.Vec3;
            cellSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            batchSize: import("../../mol-util/param-definition").ParamDefinition.Numeric;
            flipSided: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
            flatShaded: import("../../mol-util/param-definition").ParamDefinition.BooleanParam;
        }, "spacefill">;
    };
    type _BuiltIn = typeof BuiltIn;
    export type BuiltIn = keyof _BuiltIn;
    export type BuiltInParams<T extends BuiltIn> = Partial<RepresentationProvider.ParamValues<_BuiltIn[T]>>;
    export {};
}
