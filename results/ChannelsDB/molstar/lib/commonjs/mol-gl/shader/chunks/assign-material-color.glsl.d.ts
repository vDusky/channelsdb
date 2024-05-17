export declare const assign_material_color = "\n#if defined(dNeedsMarker)\n    float marker = uMarker;\n    if (uMarker == -1.0) {\n        marker = floor(vMarker * 255.0 + 0.5); // rounding required to work on some cards on win\n    }\n#endif\n\n#if defined(dRenderVariant_color)\n    #if defined(dUsePalette)\n        vec4 material = vec4(texture2D(tPalette, vec2(vPaletteV, 0.5)).rgb, uAlpha);\n    #elif defined(dColorType_uniform)\n        vec4 material = vec4(uColor, uAlpha);\n    #elif defined(dColorType_varying)\n        vec4 material = vec4(vColor.rgb, uAlpha);\n    #endif\n\n    // mix material with overpaint\n    #if defined(dOverpaint)\n        material.rgb = mix(material.rgb, vOverpaint.rgb, vOverpaint.a);\n    #endif\n\n    float metalness = uMetalness;\n    float roughness = uRoughness;\n    float bumpiness = uBumpiness;\n    #ifdef dSubstance\n        metalness = mix(metalness, vSubstance.r, vSubstance.a);\n        roughness = mix(roughness, vSubstance.g, vSubstance.a);\n        bumpiness = mix(bumpiness, vSubstance.b, vSubstance.a);\n    #endif\n#elif defined(dRenderVariant_depth)\n    if (fragmentDepth > getDepth(gl_FragCoord.xy / uDrawingBufferSize)) {\n        discard;\n    }\n\n    #ifndef dXrayShaded\n        #if defined(dTransparency)\n            float dta = 1.0 - vTransparency;\n            if (vTransparency < 0.2) dta = 1.0; // hard cutoff looks better\n\n            if (uRenderMask == MaskTransparent && uAlpha * dta == 1.0) {\n                discard;\n            } else if (uRenderMask == MaskOpaque && uAlpha * dta < 1.0) {\n                discard;\n            }\n        #else\n            if (uRenderMask == MaskTransparent && uAlpha == 1.0) {\n                discard;\n            } else if (uRenderMask == MaskOpaque && uAlpha < 1.0) {\n                discard;\n            }\n        #endif\n    #else\n        if (uRenderMask == MaskOpaque) {\n            discard;\n        }\n    #endif\n\n    vec4 material = packDepthToRGBA(fragmentDepth);\n#elif defined(dRenderVariant_marking)\n    vec4 material;\n    if(uMarkingType == 1) {\n        if (marker > 0.0)\n            discard;\n        #ifdef enabledFragDepth\n            material = packDepthToRGBA(gl_FragDepthEXT);\n        #else\n            material = packDepthToRGBA(gl_FragCoord.z);\n        #endif\n    } else {\n        if (marker == 0.0)\n            discard;\n        float depthTest = 1.0;\n        if (uMarkingDepthTest) {\n            depthTest = (fragmentDepth >= getDepthPacked(gl_FragCoord.xy / uDrawingBufferSize)) ? 1.0 : 0.0;\n        }\n        bool isHighlight = intMod(marker, 2.0) > 0.1;\n        float viewZ = depthToViewZ(uIsOrtho, fragmentDepth, uNear, uFar);\n        float fogFactor = smoothstep(uFogNear, uFogFar, abs(viewZ));\n        if (fogFactor == 1.0)\n            discard;\n        material = vec4(0.0, depthTest, isHighlight ? 1.0 : 0.0, 1.0 - fogFactor);\n    }\n#endif\n\n// apply per-group transparency\n#if defined(dTransparency) && (defined(dRenderVariant_pick) || defined(dRenderVariant_color))\n    float ta = 1.0 - vTransparency;\n    if (vTransparency < 0.09) ta = 1.0; // hard cutoff looks better\n\n    #if defined(dRenderVariant_pick)\n        if (ta * uAlpha < uPickingAlphaThreshold)\n            discard; // ignore so the element below can be picked\n    #elif defined(dRenderVariant_color)\n        material.a *= ta;\n    #endif\n#endif\n";
