/**
 * Copyright (c) 2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Adam Midlik <midlik@gmail.com>
 */
import { MVSData } from '../../mvs-data';
import { ParamsOfKind, SubTreeOfKind } from '../generic/tree-schema';
import { MVSKind, MVSTree } from './mvs-tree';
/** Create a new MolViewSpec builder containing only a root node. Example of MVS builder usage:
 *
 * ```
 * const builder = createMVSBuilder();
 * builder.canvas({ background_color: 'white' });
 * const struct = builder.download({ url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1og2_updated.cif' }).parse({ format: 'mmcif' }).modelStructure();
 * struct.component().representation().color({ color: '#3050F8' });
 * console.log(JSON.stringify(builder.getState()));
 * ```
 */
export declare function createMVSBuilder(): Root;
/** Base class for MVS builder pointing to anything */
declare class _Base<TKind extends MVSKind> {
    protected readonly _root: Root;
    protected readonly _node: SubTreeOfKind<MVSTree, TKind>;
    protected constructor(_root: Root, _node: SubTreeOfKind<MVSTree, TKind>);
    /** Create a new node, append as child to current _node, and return the new node */
    protected addChild<TChildKind extends MVSKind>(kind: TChildKind, params: ParamsOfKind<MVSTree, TChildKind>): SubTreeOfKind<{
        kind: "root";
        params?: import("../generic/params-schema").ValuesFor<{}> | undefined;
    } & {
        children?: import("../generic/tree-schema").Tree<import("../generic/tree-schema").NodeFor<import("../generic/tree-schema").TreeSchema<{
            root: {};
            download: {
                url: import("../generic/params-schema").RequiredField<string>;
            };
            parse: {
                format: import("../generic/params-schema").RequiredField<"bcif" | "mmcif" | "pdb">;
            };
            structure: {
                type: import("../generic/params-schema").RequiredField<"model" | "assembly" | "symmetry" | "symmetry_mates">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                model_index: import("../generic/params-schema").OptionalField<number>;
                assembly_id: import("../generic/params-schema").OptionalField<string | null>;
                radius: import("../generic/params-schema").OptionalField<number>;
                ijk_min: import("../generic/params-schema").OptionalField<[number, number, number]>;
                ijk_max: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            transform: {
                rotation: import("../generic/params-schema").OptionalField<number[]>;
                translation: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            component: {
                selector: import("../generic/params-schema").RequiredField<"all" | "water" | "ion" | "protein" | "polymer" | "nucleic" | "branched" | "ligand" | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                } | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                }[]>;
            };
            component_from_uri: {
                /** Add a 'representation' node and return builder pointing to it. 'representation' node instructs to create a visual representation of a component. */
                field_values: import("../generic/params-schema").OptionalField<string[] | null>;
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            component_from_source: {
                field_values: import("../generic/params-schema").OptionalField<string[] | null>;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            representation: {
                type: import("../generic/params-schema").RequiredField<"cartoon" | "ball_and_stick" | "surface">;
            };
            color: {
                color: import("../generic/params-schema").RequiredField<"aliceblue" | "antiquewhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" | "blanchedalmond" | "blue" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" | "cornflower" | "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" | "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" | "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue" | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "fuchsia" | "gainsboro" | "ghostwhite" | "gold" | "goldenrod" | "gray" | "green" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" | "khaki" | "laserlemon" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" | "lightgoldenrod" | "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue" | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "lime" | "limegreen" | "linen" | "magenta" | "maroon" | "maroon2" | "maroon3" | "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" | "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "navy" | "oldlace" | "olive" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" | "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "purple" | "purple2" | "purple3" | "rebeccapurple" | "red" | "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "silver" | "skyblue" | "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "teal" | "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whitesmoke" | "yellow" | "yellowgreen" | `#${string}`>;
                selector: import("../generic/params-schema").OptionalField<"all" | "water" | "ion" | "protein" | "polymer" | "nucleic" | "branched" | "ligand" | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                } | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                }[]>;
            };
            color_from_uri: {
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            color_from_source: {
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            label: {
                text: import("../generic/params-schema").RequiredField<string>;
            };
            label_from_uri: {
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            label_from_source: {
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            tooltip: {
                text: import("../generic/params-schema").RequiredField<string>;
            };
            tooltip_from_uri: {
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            tooltip_from_source: {
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            focus: {
                direction: import("../generic/params-schema").OptionalField<[number, number, number]>;
                up: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            camera: {
                target: import("../generic/params-schema").RequiredField<[number, number, number]>;
                position: import("../generic/params-schema").RequiredField<[number, number, number]>;
                up: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            canvas: {
                background_color: import("../generic/params-schema").RequiredField<"aliceblue" | "antiquewhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" | "blanchedalmond" | "blue" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" | "cornflower" | "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" | "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" | "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue" | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "fuchsia" | "gainsboro" | "ghostwhite" | "gold" | "goldenrod" | "gray" | "green" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" | "khaki" | "laserlemon" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" | "lightgoldenrod" | "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue" | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "lime" | "limegreen" | "linen" | "magenta" | "maroon" | "maroon2" | "maroon3" | "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" | "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "navy" | "oldlace" | "olive" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" | "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "purple" | "purple2" | "purple3" | "rebeccapurple" | "red" | "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "silver" | "skyblue" | "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "teal" | "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whitesmoke" | "yellow" | "yellowgreen" | `#${string}`>;
            };
        }, "root">, "color" | "label" | "focus" | "canvas" | "representation" | "root" | "camera" | "download" | "structure" | "transform" | "parse" | "component" | "component_from_uri" | "component_from_source" | "color_from_uri" | "color_from_source" | "label_from_uri" | "label_from_source" | "tooltip" | "tooltip_from_uri" | "tooltip_from_source">, import("../generic/tree-schema").NodeFor<import("../generic/tree-schema").TreeSchema<{
            root: {};
            download: {
                url: import("../generic/params-schema").RequiredField<string>;
            };
            parse: {
                format: import("../generic/params-schema").RequiredField<"bcif" | "mmcif" | "pdb">;
            };
            structure: {
                type: import("../generic/params-schema").RequiredField<"model" | "assembly" | "symmetry" | "symmetry_mates">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                model_index: import("../generic/params-schema").OptionalField<number>;
                assembly_id: import("../generic/params-schema").OptionalField<string | null>;
                radius: import("../generic/params-schema").OptionalField<number>;
                ijk_min: import("../generic/params-schema").OptionalField<[number, number, number]>;
                ijk_max: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            transform: {
                rotation: import("../generic/params-schema").OptionalField<number[]>;
                translation: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            component: {
                selector: import("../generic/params-schema").RequiredField<"all" | "water" | "ion" | "protein" | "polymer" | "nucleic" | "branched" | "ligand" | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                } | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                }[]>;
            };
            component_from_uri: {
                /** Add a 'representation' node and return builder pointing to it. 'representation' node instructs to create a visual representation of a component. */
                field_values: import("../generic/params-schema").OptionalField<string[] | null>;
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            component_from_source: {
                field_values: import("../generic/params-schema").OptionalField<string[] | null>;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            representation: {
                type: import("../generic/params-schema").RequiredField<"cartoon" | "ball_and_stick" | "surface">;
            };
            color: {
                color: import("../generic/params-schema").RequiredField<"aliceblue" | "antiquewhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" | "blanchedalmond" | "blue" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" | "cornflower" | "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" | "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" | "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue" | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "fuchsia" | "gainsboro" | "ghostwhite" | "gold" | "goldenrod" | "gray" | "green" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" | "khaki" | "laserlemon" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" | "lightgoldenrod" | "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue" | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "lime" | "limegreen" | "linen" | "magenta" | "maroon" | "maroon2" | "maroon3" | "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" | "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "navy" | "oldlace" | "olive" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" | "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "purple" | "purple2" | "purple3" | "rebeccapurple" | "red" | "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "silver" | "skyblue" | "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "teal" | "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whitesmoke" | "yellow" | "yellowgreen" | `#${string}`>;
                selector: import("../generic/params-schema").OptionalField<"all" | "water" | "ion" | "protein" | "polymer" | "nucleic" | "branched" | "ligand" | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                } | {
                    label_entity_id?: string | undefined;
                    label_asym_id?: string | undefined;
                    auth_asym_id?: string | undefined;
                    label_seq_id?: number | undefined;
                    auth_seq_id?: number | undefined;
                    pdbx_PDB_ins_code?: string | undefined;
                    beg_label_seq_id?: number | undefined;
                    end_label_seq_id?: number | undefined;
                    beg_auth_seq_id?: number | undefined;
                    end_auth_seq_id?: number | undefined;
                    label_atom_id?: string | undefined;
                    auth_atom_id?: string | undefined;
                    type_symbol?: string | undefined;
                    atom_id?: number | undefined;
                    atom_index?: number | undefined;
                }[]>;
            };
            color_from_uri: {
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            color_from_source: {
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            label: {
                text: import("../generic/params-schema").RequiredField<string>;
            };
            label_from_uri: {
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            label_from_source: {
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            tooltip: {
                text: import("../generic/params-schema").RequiredField<string>;
            };
            tooltip_from_uri: {
                uri: import("../generic/params-schema").RequiredField<string>;
                format: import("../generic/params-schema").RequiredField<"bcif" | "cif" | "json">;
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            tooltip_from_source: {
                schema: import("../generic/params-schema").RequiredField<"residue" | "chain" | "entity" | "atom" | "whole_structure" | "auth_chain" | "auth_residue" | "residue_range" | "auth_residue_range" | "auth_atom" | "all_atomic">;
                block_header: import("../generic/params-schema").OptionalField<string | null>;
                block_index: import("../generic/params-schema").OptionalField<number>;
                category_name: import("../generic/params-schema").OptionalField<string | null>;
                field_name: import("../generic/params-schema").OptionalField<string>;
            };
            focus: {
                direction: import("../generic/params-schema").OptionalField<[number, number, number]>;
                up: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            camera: {
                target: import("../generic/params-schema").RequiredField<[number, number, number]>;
                position: import("../generic/params-schema").RequiredField<[number, number, number]>;
                up: import("../generic/params-schema").OptionalField<[number, number, number]>;
            };
            canvas: {
                background_color: import("../generic/params-schema").RequiredField<"aliceblue" | "antiquewhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" | "blanchedalmond" | "blue" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" | "cornflower" | "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" | "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" | "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue" | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "fuchsia" | "gainsboro" | "ghostwhite" | "gold" | "goldenrod" | "gray" | "green" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" | "khaki" | "laserlemon" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" | "lightgoldenrod" | "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue" | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "lime" | "limegreen" | "linen" | "magenta" | "maroon" | "maroon2" | "maroon3" | "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" | "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "navy" | "oldlace" | "olive" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" | "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "purple" | "purple2" | "purple3" | "rebeccapurple" | "red" | "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "silver" | "skyblue" | "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "teal" | "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whitesmoke" | "yellow" | "yellowgreen" | `#${string}`>;
            };
        }, "root">, "color" | "label" | "focus" | "canvas" | "representation" | "root" | "camera" | "download" | "structure" | "transform" | "parse" | "component" | "component_from_uri" | "component_from_source" | "color_from_uri" | "color_from_source" | "label_from_uri" | "label_from_source" | "tooltip" | "tooltip_from_uri" | "tooltip_from_source">>[] | undefined;
    }, TChildKind>;
}
/** MVS builder pointing to the 'root' node */
export declare class Root extends _Base<'root'> {
    constructor();
    /** Return the current state of the builder as object in MVS format. */
    getState(metadata?: Partial<Pick<MVSData['metadata'], 'title' | 'description' | 'description_format'>>): MVSData;
    /** Add a 'camera' node and return builder pointing to the root. 'camera' node instructs to set the camera position and orientation. */
    camera(params: ParamsOfKind<MVSTree, 'camera'>): Root;
    /** Add a 'canvas' node and return builder pointing to the root. 'canvas' node sets canvas properties. */
    canvas(params: ParamsOfKind<MVSTree, 'canvas'>): Root;
    /** Add a 'download' node and return builder pointing to it. 'download' node instructs to retrieve a data resource. */
    download(params: ParamsOfKind<MVSTree, 'download'>): Download;
}
/** MVS builder pointing to a 'download' node */
export declare class Download extends _Base<'download'> {
    /** Add a 'parse' node and return builder pointing to it. 'parse' node instructs to parse a data resource. */
    parse(params: ParamsOfKind<MVSTree, 'parse'>): Parse;
}
/** Subsets of 'structure' node params which will be passed to individual builder functions. */
declare const StructureParamsSubsets: {
    model: ("block_header" | "block_index" | "model_index")[];
    assembly: ("assembly_id" | "block_header" | "block_index" | "model_index")[];
    symmetry: ("block_header" | "block_index" | "model_index" | "ijk_min" | "ijk_max")[];
    symmetry_mates: ("radius" | "block_header" | "block_index" | "model_index")[];
};
/** MVS builder pointing to a 'parse' node */
export declare class Parse extends _Base<'parse'> {
    /** Add a 'structure' node representing a "model structure", i.e. includes all coordinates from the original model without applying any transformations.
     * Return builder pointing to the new node. */
    modelStructure(params?: Pick<ParamsOfKind<MVSTree, 'structure'>, typeof StructureParamsSubsets['model'][number]>): Structure;
    /** Add a 'structure' node representing an "assembly structure", i.e. may apply filters and symmetry operators to the original model coordinates.
     * Return builder pointing to the new node. */
    assemblyStructure(params?: Pick<ParamsOfKind<MVSTree, 'structure'>, typeof StructureParamsSubsets['assembly'][number]>): Structure;
    /** Add a 'structure' node representing a "symmetry structure", i.e. applies symmetry operators to build crystal unit cells within given Miller indices.
     * Return builder pointing to the new node. */
    symmetryStructure(params?: Pick<ParamsOfKind<MVSTree, 'structure'>, typeof StructureParamsSubsets['symmetry'][number]>): Structure;
    /** Add a 'structure' node representing a "symmetry mates structure", i.e. applies symmetry operators to build asymmetric units within a radius from the original model.
     * Return builder pointing to the new node. */
    symmetryMatesStructure(params?: Pick<ParamsOfKind<MVSTree, 'structure'>, typeof StructureParamsSubsets['symmetry_mates'][number]>): Structure;
}
/** MVS builder pointing to a 'structure' node */
export declare class Structure extends _Base<'structure'> {
    /** Add a 'component' node and return builder pointing to it. 'component' node instructs to create a component (i.e. a subset of the parent structure). */
    component(params?: Partial<ParamsOfKind<MVSTree, 'component'>>): Component;
    /** Add a 'component_from_uri' node and return builder pointing to it. 'component_from_uri' node instructs to create a component defined by an external annotation resource. */
    componentFromUri(params: ParamsOfKind<MVSTree, 'component_from_uri'>): Component;
    /** Add a 'component_from_source' node and return builder pointing to it. 'component_from_source' node instructs to create a component defined by an annotation resource included in the same file this structure was loaded from. Only applicable if the structure was loaded from an mmCIF or BinaryCIF file. */
    componentFromSource(params: ParamsOfKind<MVSTree, 'component_from_source'>): Component;
    /** Add a 'label_from_uri' node and return builder pointing back to the structure node. 'label_from_uri' node instructs to add labels (textual visual representations) to parts of a structure. The labels are defined by an external annotation resource. */
    labelFromUri(params: ParamsOfKind<MVSTree, 'label_from_uri'>): Structure;
    /** Add a 'label_from_source' node and return builder pointing back to the structure node. 'label_from_source' node instructs to add labels (textual visual representations) to parts of a structure. The labels are defined by an annotation resource included in the same file this structure was loaded from. Only applicable if the structure was loaded from an mmCIF or BinaryCIF file. */
    labelFromSource(params: ParamsOfKind<MVSTree, 'label_from_source'>): Structure;
    /** Add a 'tooltip_from_uri' node and return builder pointing back to the structure node. 'tooltip_from_uri' node instructs to add tooltips to parts of a structure. The tooltips are defined by an external annotation resource. */
    tooltipFromUri(params: ParamsOfKind<MVSTree, 'tooltip_from_uri'>): Structure;
    /** Add a 'tooltip_from_source' node and return builder pointing back to the structure node. 'tooltip_from_source' node instructs to add tooltips to parts of a structure. The tooltips are defined by an annotation resource included in the same file this structure was loaded from. Only applicable if the structure was loaded from an mmCIF or BinaryCIF file. */
    tooltipFromSource(params: ParamsOfKind<MVSTree, 'tooltip_from_source'>): Structure;
    /** Add a 'transform' node and return builder pointing back to the structure node. 'transform' node instructs to rotate and/or translate structure coordinates. */
    transform(params?: ParamsOfKind<MVSTree, 'transform'>): Structure;
}
/** MVS builder pointing to a 'component' or 'component_from_uri' or 'component_from_source' node */
export declare class Component extends _Base<'component' | 'component_from_uri' | 'component_from_source'> {
    /** Add a 'representation' node and return builder pointing to it. 'representation' node instructs to create a visual representation of a component. */
    representation(params?: Partial<ParamsOfKind<MVSTree, 'representation'>>): Representation;
    /** Add a 'label' node and return builder pointing back to the component node. 'label' node instructs to add a label (textual visual representation) to a component. */
    label(params: ParamsOfKind<MVSTree, 'label'>): Component;
    /** Add a 'tooltip' node and return builder pointing back to the component node. 'tooltip' node instructs to add a text which is not a part of the visualization but should be presented to the users when they interact with the component (typically, the tooltip will be shown somewhere on the screen when the user hovers over a visual representation of the component). */
    tooltip(params: ParamsOfKind<MVSTree, 'tooltip'>): Component;
    /** Add a 'focus' node and return builder pointing back to the component node. 'focus' node instructs to set the camera focus to a component (zoom in). */
    focus(params?: ParamsOfKind<MVSTree, 'focus'>): Component;
}
/** MVS builder pointing to a 'representation' node */
export declare class Representation extends _Base<'representation'> {
    /** Add a 'color' node and return builder pointing back to the representation node. 'color' node instructs to apply color to a visual representation. */
    color(params: ParamsOfKind<MVSTree, 'color'>): Representation;
    /** Add a 'color_from_uri' node and return builder pointing back to the representation node. 'color_from_uri' node instructs to apply colors to a visual representation. The colors are defined by an external annotation resource. */
    colorFromUri(params: ParamsOfKind<MVSTree, 'color_from_uri'>): Representation;
    /** Add a 'color_from_source' node and return builder pointing back to the representation node. 'color_from_source' node instructs to apply colors to a visual representation. The colors are defined by an annotation resource included in the same file this structure was loaded from. Only applicable if the structure was loaded from an mmCIF or BinaryCIF file. */
    colorFromSource(params: ParamsOfKind<MVSTree, 'color_from_source'>): Representation;
}
/** Demonstration of usage of MVS builder */
export declare function builderDemo(): MVSData;
export {};
