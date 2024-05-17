/**
 * Copyright (c) 2018-2021 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
export declare const mesh_vert = "\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\n#include common\n#include read_from_texture\n#include common_vert_params\n#include color_vert_params\n#include common_clip\n#include texture3d_from_2d_linear\n\n#ifdef dGeometryType_textureMesh\n    uniform vec2 uGeoTexDim;\n    uniform sampler2D tPosition;\n    uniform sampler2D tGroup;\n    uniform sampler2D tNormal;\n#else\n    attribute vec3 aPosition;\n    attribute float aGroup;\n    attribute vec3 aNormal;\n#endif\nattribute mat4 aTransform;\nattribute float aInstance;\n\nvarying vec3 vNormal;\n\nvoid main(){\n    #include assign_group\n    #include assign_marker_varying\n    #include assign_clipping_varying\n    #include assign_position\n    #include assign_color_varying\n    #include clip_instance\n\n    #ifdef dGeometryType_textureMesh\n        vec3 normal = readFromTexture(tNormal, VertexID, uGeoTexDim).xyz;\n    #else\n        vec3 normal = aNormal;\n    #endif\n    mat3 normalMatrix = transpose3(inverse3(mat3(modelView)));\n    vec3 transformedNormal = normalize(normalMatrix * normalize(normal));\n    #if defined(dFlipSided)\n        if (!uDoubleSided) { // TODO checking uDoubleSided should not be required, ASR\n            transformedNormal = -transformedNormal;\n        }\n    #endif\n    vNormal = transformedNormal;\n}\n";
