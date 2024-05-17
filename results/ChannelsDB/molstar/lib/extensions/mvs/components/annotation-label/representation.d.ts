/**
 * Copyright (c) 2023-2024 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Adam Midlik <midlik@gmail.com>
 */
import { Structure } from '../../../../mol-model/structure';
import { RepresentationContext, RepresentationParamsGetter } from '../../../../mol-repr/representation';
import { StructureRepresentation, StructureRepresentationProvider } from '../../../../mol-repr/structure/representation';
import { ParamDefinition as PD } from '../../../../mol-util/param-definition';
/** Parameter definition for representation type "MVS Annotation Label" */
export type MVSAnnotationLabelParams = typeof MVSAnnotationLabelParams;
export declare const MVSAnnotationLabelParams: {
    visuals: PD.MultiSelect<"label-text">;
    borderColor: {
        defaultValue: import("../../../../mol-util/color").Color;
        type: "color";
        isExpanded?: boolean | undefined;
        isOptional?: boolean | undefined;
        label?: string | undefined;
        description?: string | undefined;
        legend?: import("../../../../mol-util/legend").Legend | undefined;
        fieldLabels?: {
            [name: string]: string;
        } | undefined;
        isHidden?: boolean | undefined;
        shortLabel?: boolean | undefined;
        twoColumns?: boolean | undefined;
        isEssential?: boolean | undefined;
        category?: string | undefined;
        hideIf?: ((currentGroup: any) => boolean) | undefined;
        help?: ((value: any) => {
            description?: string | undefined;
            legend?: import("../../../../mol-util/legend").Legend | undefined;
        }) | undefined;
    };
    clip: PD.Group<PD.Normalize<{
        variant: import("../../../../mol-util/clip").Clip.Variant;
        objects: PD.Normalize<{
            type: any;
            invert: any;
            position: any;
            rotation: any;
            scale: any;
        }>[];
    }>>;
    alpha: PD.Numeric;
    backgroundColor: PD.Color;
    fontFamily: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontFamily>;
    fontStyle: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontStyle>;
    fontVariant: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontVariant>;
    fontWeight: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontWeight>;
    background: PD.BooleanParam;
    borderWidth: PD.Numeric;
    batchSize: PD.Numeric;
    material: PD.Group<PD.Normalize<{
        metalness: number;
        roughness: number;
        bumpiness: number;
    }>>;
    instanceGranularity: PD.BooleanParam;
    quality: PD.Select<"auto" | "medium" | "high" | "low" | "custom" | "highest" | "higher" | "lower" | "lowest">;
    lod: PD.Vec3;
    cellSize: PD.Numeric;
    sizeFactor: PD.Numeric;
    fontQuality: PD.Select<number>;
    offsetX: PD.Numeric;
    offsetY: PD.Numeric;
    offsetZ: PD.Numeric;
    backgroundMargin: PD.Numeric;
    backgroundOpacity: PD.Numeric;
    tether: PD.BooleanParam;
    tetherLength: PD.Numeric;
    tetherBaseWidth: PD.Numeric;
    attachment: PD.Select<"bottom-left" | "bottom-center" | "bottom-right" | "middle-left" | "middle-center" | "middle-right" | "top-left" | "top-center" | "top-right">;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    includeParent: PD.BooleanParam;
    unitKinds: PD.MultiSelect<"spheres" | "gaussians" | "atomic">;
    /** Parameter values for representation type "MVS Annotation Label" */
    annotationId: PD.Text<string>;
    fieldName: PD.Text<string>;
};
/** Parameter values for representation type "MVS Annotation Label" */
export type MVSAnnotationLabelProps = PD.ValuesFor<MVSAnnotationLabelParams>;
/** Structure representation type "MVS Annotation Label", allowing showing labels based on "MVS Annotations" custom props */
export type MVSAnnotationLabelRepresentation = StructureRepresentation<MVSAnnotationLabelParams>;
export declare function MVSAnnotationLabelRepresentation(ctx: RepresentationContext, getParams: RepresentationParamsGetter<Structure, MVSAnnotationLabelParams>): MVSAnnotationLabelRepresentation;
/** A thingy that is needed to register representation type "MVS Annotation Label", allowing showing labels based on "MVS Annotations" custom props */
export declare const MVSAnnotationLabelRepresentationProvider: StructureRepresentationProvider<{
    visuals: PD.MultiSelect<"label-text">;
    borderColor: {
        defaultValue: import("../../../../mol-util/color").Color;
        type: "color";
        isExpanded?: boolean | undefined;
        isOptional?: boolean | undefined;
        label?: string | undefined;
        description?: string | undefined;
        legend?: import("../../../../mol-util/legend").Legend | undefined;
        fieldLabels?: {
            [name: string]: string;
        } | undefined;
        isHidden?: boolean | undefined;
        shortLabel?: boolean | undefined;
        twoColumns?: boolean | undefined;
        isEssential?: boolean | undefined;
        category?: string | undefined;
        hideIf?: ((currentGroup: any) => boolean) | undefined;
        help?: ((value: any) => {
            description?: string | undefined;
            legend?: import("../../../../mol-util/legend").Legend | undefined;
        }) | undefined;
    };
    clip: PD.Group<PD.Normalize<{
        variant: import("../../../../mol-util/clip").Clip.Variant;
        objects: PD.Normalize<{
            type: any;
            invert: any;
            position: any;
            rotation: any;
            scale: any;
        }>[];
    }>>;
    alpha: PD.Numeric;
    backgroundColor: PD.Color;
    fontFamily: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontFamily>;
    fontStyle: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontStyle>;
    fontVariant: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontVariant>;
    fontWeight: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontWeight>;
    background: PD.BooleanParam;
    borderWidth: PD.Numeric;
    batchSize: PD.Numeric;
    material: PD.Group<PD.Normalize<{
        metalness: number;
        roughness: number;
        bumpiness: number;
    }>>;
    instanceGranularity: PD.BooleanParam;
    quality: PD.Select<"auto" | "medium" | "high" | "low" | "custom" | "highest" | "higher" | "lower" | "lowest">;
    lod: PD.Vec3;
    cellSize: PD.Numeric;
    sizeFactor: PD.Numeric;
    fontQuality: PD.Select<number>;
    offsetX: PD.Numeric;
    offsetY: PD.Numeric;
    offsetZ: PD.Numeric;
    backgroundMargin: PD.Numeric;
    backgroundOpacity: PD.Numeric;
    tether: PD.BooleanParam;
    tetherLength: PD.Numeric;
    tetherBaseWidth: PD.Numeric;
    attachment: PD.Select<"bottom-left" | "bottom-center" | "bottom-right" | "middle-left" | "middle-center" | "middle-right" | "top-left" | "top-center" | "top-right">;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    includeParent: PD.BooleanParam;
    unitKinds: PD.MultiSelect<"spheres" | "gaussians" | "atomic">;
    /** Parameter values for representation type "MVS Annotation Label" */
    annotationId: PD.Text<string>;
    fieldName: PD.Text<string>;
}, "mvs-annotation-label">;
