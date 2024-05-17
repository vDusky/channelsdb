/**
 * Copyright (c) 2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Adam Midlik <midlik@gmail.com>
 */
import { ComplexVisual } from '../../../../mol-repr/structure/complex-visual';
import { ParamDefinition as PD } from '../../../../mol-util/param-definition';
/** Parameter definition for "label-text" visual in "Custom Label" representation */
export type CustomLabelTextParams = typeof CustomLabelTextParams;
export declare const CustomLabelTextParams: {
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
    material: PD.Group<PD.Normalize<{
        metalness: number;
        roughness: number;
        bumpiness: number;
    }>>;
    alpha: PD.Numeric;
    ignoreHydrogens: PD.BooleanParam;
    ignoreHydrogensVariant: PD.Select<"all" | "non-polar">;
    quality: PD.Select<"custom" | "auto" | "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest">;
    background: PD.BooleanParam;
    backgroundColor: PD.Color;
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
    instanceGranularity: PD.BooleanParam;
    lod: PD.Vec3;
    cellSize: PD.Numeric;
    batchSize: PD.Numeric;
    sizeFactor: PD.Numeric;
    unitKinds: PD.MultiSelect<"spheres" | "atomic" | "gaussians">;
    includeParent: PD.BooleanParam;
    backgroundMargin: PD.Numeric;
    backgroundOpacity: PD.Numeric;
    borderWidth: PD.Numeric;
    offsetX: PD.Numeric;
    offsetY: PD.Numeric;
    offsetZ: PD.Numeric;
    tether: PD.BooleanParam;
    tetherLength: PD.Numeric;
    tetherBaseWidth: PD.Numeric;
    attachment: PD.Select<"middle-center" | "bottom-left" | "bottom-center" | "bottom-right" | "middle-left" | "middle-right" | "top-left" | "top-center" | "top-right">;
    fontFamily: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontFamily>;
    fontQuality: PD.Select<number>;
    fontStyle: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontStyle>;
    fontVariant: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontVariant>;
    fontWeight: PD.Select<import("../../../../mol-geo/geometry/text/font-atlas").FontWeight>;
    items: PD.ObjectList<PD.Normalize<{
        text: string;
        position: PD.NamedParams<PD.Normalize<{
            selector: any;
        }>, "selection"> | PD.NamedParams<PD.Normalize<{
            x: any;
            y: any;
            z: any;
            scale: any;
        }>, "x_y_z">;
    }>>;
};
/** Parameter values for "label-text" visual in "Custom Label" representation */
export type CustomLabelTextProps = PD.Values<CustomLabelTextParams>;
/** Create "label-text" visual for "Custom Label" representation */
export declare function CustomLabelTextVisual(materialId: number): ComplexVisual<CustomLabelTextParams>;
