/**
 * Copyright (c) 2020-2024 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
export declare const image_frag = "\nprecision highp float;\nprecision highp int;\n\n#include common\n#include read_from_texture\n#include common_frag_params\n#include common_clip\n\nuniform vec2 uImageTexDim;\nuniform sampler2D tImageTex;\nuniform sampler2D tGroupTex;\n\nuniform vec2 uMarkerTexDim;\nuniform sampler2D tMarker;\n\nvarying vec2 vUv;\nvarying float vInstance;\n\n#if defined(dInterpolation_catmulrom) || defined(dInterpolation_mitchell) || defined(dInterpolation_bspline)\n    #define dInterpolation_cubic\n#endif\n\n#if defined(dInterpolation_cubic)\n    #if defined(dInterpolation_catmulrom) || defined(dInterpolation_mitchell)\n        #if defined(dInterpolation_catmulrom)\n            const float B = 0.0;\n            const float C = 0.5;\n        #elif defined(dInterpolation_mitchell)\n            const float B = 0.333;\n            const float C = 0.333;\n        #endif\n\n        float cubicFilter(float x){\n            float f = x;\n            if (f < 0.0) {\n                f = -f;\n            }\n            if (f < 1.0) {\n                return ((12.0 - 9.0 * B - 6.0 * C) * (f * f * f) +\n                    (-18.0 + 12.0 * B + 6.0 * C) * (f * f) +\n                    (6.0 - 2.0 * B)) / 6.0;\n            }else if (f >= 1.0 && f < 2.0){\n                return ((-B - 6.0 * C) * ( f * f * f)\n                    + (6.0 * B + 30.0 * C) * (f * f) +\n                    (-(12.0 * B) - 48.0 * C) * f +\n                    8.0 * B + 24.0 * C) / 6.0;\n            }else{\n                return 0.0;\n            }\n        }\n    #elif defined(dInterpolation_bspline)\n        float cubicFilter(float x) {\n            float f = x;\n            if (f < 0.0) {\n                f = -f;\n            }\n            if (f >= 0.0 && f <= 1.0){\n                return (2.0 / 3.0) + (0.5) * (f * f * f) - (f * f);\n            } else if (f > 1.0 && f <= 2.0) {\n                return 1.0 / 6.0 * pow((2.0 - f), 3.0);\n            }\n            return 1.0;\n        }\n    #endif\n\n    vec4 biCubic(sampler2D tex, vec2 texCoord) {\n        vec2 texelSize = 1.0 / uImageTexDim;\n        texCoord -= texelSize / 2.0;\n        vec4 nSum = vec4(0.0);\n        float nDenom = 0.0;\n        vec2 cell = fract(texCoord * uImageTexDim);\n        for (float m = -1.0; m <= 2.0; ++m) {\n            for (float n = -1.0; n <= 2.0; ++n) {\n                vec4 vecData = texture2D(tex, texCoord + texelSize * vec2(m, n));\n                float c = abs(cubicFilter(m - cell.x) * cubicFilter(-n + cell.y));\n                nSum += vecData * c;\n                nDenom += c;\n            }\n        }\n        return nSum / nDenom;\n    }\n#endif\n\nvoid main() {\n    #include fade_lod\n    #include clip_pixel\n\n    #if defined(dInterpolation_cubic)\n        vec4 imageData = biCubic(tImageTex, vUv);\n    #else\n        vec4 imageData = texture2D(tImageTex, vUv);\n    #endif\n    imageData.a = clamp(imageData.a, 0.0, 1.0);\n    if (imageData.a > 0.9) imageData.a = 1.0;\n\n    imageData.a *= uAlpha;\n    if (imageData.a < 0.05)\n        discard;\n\n    float fragmentDepth = gl_FragCoord.z;\n\n    if ((uRenderMask == MaskOpaque && imageData.a < 1.0) ||\n        (uRenderMask == MaskTransparent && imageData.a == 1.0)\n    ) {\n        discard;\n    }\n\n    #if defined(dRenderVariant_pick)\n        if (imageData.a < 0.3)\n            discard;\n        #ifdef requiredDrawBuffers\n            gl_FragColor = vec4(packIntToRGB(float(uObjectId)), 1.0);\n            gl_FragData[1] = vec4(packIntToRGB(vInstance), 1.0);\n            gl_FragData[2] = vec4(texture2D(tGroupTex, vUv).rgb, 1.0);\n            gl_FragData[3] = packDepthToRGBA(gl_FragCoord.z);\n        #else\n            gl_FragColor = vColor;\n            if (uPickType == 1) {\n                gl_FragColor = vec4(packIntToRGB(float(uObjectId)), 1.0);\n            } else if (uPickType == 2) {\n                gl_FragColor = vec4(packIntToRGB(vInstance), 1.0);\n            } else {\n                gl_FragColor = vec4(texture2D(tGroupTex, vUv).rgb, 1.0);\n            }\n        #endif\n    #elif defined(dRenderVariant_depth)\n        if (imageData.a < 0.05)\n            discard;\n        gl_FragColor = packDepthToRGBA(gl_FragCoord.z);\n    #elif defined(dRenderVariant_marking)\n        float marker = uMarker;\n        if (uMarker == -1.0) {\n            float group = unpackRGBToInt(texture2D(tGroupTex, vUv).rgb);\n            marker = readFromTexture(tMarker, vInstance * float(uGroupCount) + group, uMarkerTexDim).a;\n            marker = floor(marker * 255.0 + 0.5); // rounding required to work on some cards on win\n        }\n        if (uMarkingType == 1) {\n            if (marker > 0.0 || imageData.a < 0.05)\n                discard;\n            gl_FragColor = packDepthToRGBA(gl_FragCoord.z);\n        } else {\n            if (marker == 0.0 || imageData.a < 0.05)\n                discard;\n            float depthTest = 1.0;\n            if (uMarkingDepthTest) {\n                depthTest = (fragmentDepth >= getDepthPacked(gl_FragCoord.xy / uDrawingBufferSize)) ? 1.0 : 0.0;\n            }\n            bool isHighlight = intMod(marker, 2.0) > 0.1;\n            gl_FragColor = vec4(0.0, depthTest, isHighlight ? 1.0 : 0.0, 1.0);\n        }\n    #elif defined(dRenderVariant_color)\n        gl_FragColor = imageData;\n\n        float marker = uMarker;\n        if (uMarker == -1.0) {\n            float group = unpackRGBToInt(texture2D(tGroupTex, vUv).rgb);\n            marker = readFromTexture(tMarker, vInstance * float(uGroupCount) + group, uMarkerTexDim).a;\n            marker = floor(marker * 255.0 + 0.5); // rounding required to work on some cards on win\n        }\n\n        #include apply_marker_color\n        #include apply_fog\n        #include wboit_write\n        #include dpoit_write\n    #endif\n}\n";
