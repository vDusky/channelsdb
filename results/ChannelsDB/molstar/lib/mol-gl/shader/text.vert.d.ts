/**
 * Copyright (c) 2019-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
export declare const text_vert = "\nprecision highp float;\nprecision highp int;\n\n#include common\n#include read_from_texture\n#include common_vert_params\n#include color_vert_params\n#include size_vert_params\n#include common_clip\n\nuniform mat4 uModelView;\n\nattribute vec3 aPosition;\nattribute vec2 aMapping;\nattribute float aDepth;\nattribute vec2 aTexCoord;\nattribute mat4 aTransform;\nattribute float aInstance;\nattribute float aGroup;\n\nuniform float uOffsetX;\nuniform float uOffsetY;\nuniform float uOffsetZ;\n\nuniform float uIsOrtho;\nuniform float uPixelRatio;\nuniform vec4 uViewport;\n\nvarying vec2 vTexCoord;\n\n#include matrix_scale\n\nvoid main(void){\n    #include assign_group\n    #include assign_color_varying\n    #include assign_marker_varying\n    #include assign_clipping_varying\n    #include assign_size\n\n    vTexCoord = aTexCoord;\n\n    float scale = matrixScale(uModelView);\n\n    float offsetX = uOffsetX * scale;\n    float offsetY = uOffsetY * scale;\n    float offsetZ = (uOffsetZ + aDepth * 0.95) * scale;\n\n    vec4 position4 = vec4(aPosition, 1.0);\n    vec4 mvPosition = uModelView * aTransform * position4;\n\n    vModelPosition = (uModel * aTransform * position4).xyz; // for clipping in frag shader\n\n    // TODO\n    // #ifdef FIXED_SIZE\n    //     if (ortho) {\n    //         scale /= pixelRatio * ((uViewport.w / 2.0) / -uCameraPosition.z) * 0.1;\n    //     } else {\n    //         scale /= pixelRatio * ((uViewport.w / 2.0) / -mvPosition.z) * 0.1;\n    //     }\n    // #endif\n\n    vec4 mvCorner = vec4(mvPosition.xyz, 1.0);\n\n    if (vTexCoord.x == 10.0) { // indicates background plane\n        // move a bit to the back, taking distance to camera into account to avoid z-fighting\n        offsetZ -= 0.001 * distance(uCameraPosition, (uProjection * mvCorner).xyz);\n    }\n\n    mvCorner.xy += aMapping * size * scale;\n    mvCorner.x += offsetX;\n    mvCorner.y += offsetY;\n\n    if (uIsOrtho == 1.0) {\n        mvCorner.z += offsetZ;\n    } else {\n        mvCorner.xyz += normalize(-mvCorner.xyz) * offsetZ;\n    }\n\n    gl_Position = uProjection * mvCorner;\n\n    vViewPosition = -mvCorner.xyz;\n\n    #include clip_instance\n}\n";
