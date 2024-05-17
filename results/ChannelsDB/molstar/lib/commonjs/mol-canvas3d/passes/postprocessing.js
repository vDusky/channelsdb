"use strict";
/**
 * Copyright (c) 2019-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author Áron Samuel Kovács <aron.kovacs@mail.muni.cz>
 * @author Ludovic Autin <ludovic.autin@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntialiasingPass = exports.PostprocessingPass = exports.PostprocessingParams = void 0;
const util_1 = require("../../mol-gl/compute/util");
const schema_1 = require("../../mol-gl/renderable/schema");
const shader_code_1 = require("../../mol-gl/shader-code");
const mol_util_1 = require("../../mol-util");
const render_item_1 = require("../../mol-gl/webgl/render-item");
const renderable_1 = require("../../mol-gl/renderable");
const linear_algebra_1 = require("../../mol-math/linear-algebra");
const param_definition_1 = require("../../mol-util/param-definition");
const quad_vert_1 = require("../../mol-gl/shader/quad.vert");
const outlines_frag_1 = require("../../mol-gl/shader/outlines.frag");
const ssao_frag_1 = require("../../mol-gl/shader/ssao.frag");
const ssao_blur_frag_1 = require("../../mol-gl/shader/ssao-blur.frag");
const postprocessing_frag_1 = require("../../mol-gl/shader/postprocessing.frag");
const color_1 = require("../../mol-util/color");
const fxaa_1 = require("./fxaa");
const smaa_1 = require("./smaa");
const debug_1 = require("../../mol-util/debug");
const background_1 = require("./background");
const shadows_frag_1 = require("../../mol-gl/shader/shadows.frag");
const cas_1 = require("./cas");
const OutlinesSchema = {
    ...util_1.QuadSchema,
    tDepthOpaque: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tDepthTransparent: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    uTexSize: (0, schema_1.UniformSpec)('v2'),
    dOrthographic: (0, schema_1.DefineSpec)('number'),
    uNear: (0, schema_1.UniformSpec)('f'),
    uFar: (0, schema_1.UniformSpec)('f'),
    uInvProjection: (0, schema_1.UniformSpec)('m4'),
    uOutlineThreshold: (0, schema_1.UniformSpec)('f'),
    dTransparentOutline: (0, schema_1.DefineSpec)('boolean'),
};
function getOutlinesRenderable(ctx, depthTextureOpaque, depthTextureTransparent, transparentOutline) {
    const width = depthTextureOpaque.getWidth();
    const height = depthTextureOpaque.getHeight();
    const values = {
        ...util_1.QuadValues,
        tDepthOpaque: mol_util_1.ValueCell.create(depthTextureOpaque),
        tDepthTransparent: mol_util_1.ValueCell.create(depthTextureTransparent),
        uTexSize: mol_util_1.ValueCell.create(linear_algebra_1.Vec2.create(width, height)),
        dOrthographic: mol_util_1.ValueCell.create(0),
        uNear: mol_util_1.ValueCell.create(1),
        uFar: mol_util_1.ValueCell.create(10000),
        uInvProjection: mol_util_1.ValueCell.create(linear_algebra_1.Mat4.identity()),
        uOutlineThreshold: mol_util_1.ValueCell.create(0.33),
        dTransparentOutline: mol_util_1.ValueCell.create(transparentOutline),
    };
    const schema = { ...OutlinesSchema };
    const shaderCode = (0, shader_code_1.ShaderCode)('outlines', quad_vert_1.quad_vert, outlines_frag_1.outlines_frag);
    const renderItem = (0, render_item_1.createComputeRenderItem)(ctx, 'triangles', shaderCode, schema, values);
    return (0, renderable_1.createComputeRenderable)(renderItem, values);
}
const ShadowsSchema = {
    ...util_1.QuadSchema,
    tDepth: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    uTexSize: (0, schema_1.UniformSpec)('v2'),
    uProjection: (0, schema_1.UniformSpec)('m4'),
    uInvProjection: (0, schema_1.UniformSpec)('m4'),
    uBounds: (0, schema_1.UniformSpec)('v4'),
    dOrthographic: (0, schema_1.DefineSpec)('number'),
    uNear: (0, schema_1.UniformSpec)('f'),
    uFar: (0, schema_1.UniformSpec)('f'),
    dSteps: (0, schema_1.DefineSpec)('number'),
    uMaxDistance: (0, schema_1.UniformSpec)('f'),
    uTolerance: (0, schema_1.UniformSpec)('f'),
    uBias: (0, schema_1.UniformSpec)('f'),
    uLightDirection: (0, schema_1.UniformSpec)('v3[]'),
    uLightColor: (0, schema_1.UniformSpec)('v3[]'),
    dLightCount: (0, schema_1.DefineSpec)('number'),
};
function getShadowsRenderable(ctx, depthTexture) {
    const width = depthTexture.getWidth();
    const height = depthTexture.getHeight();
    const values = {
        ...util_1.QuadValues,
        tDepth: mol_util_1.ValueCell.create(depthTexture),
        uTexSize: mol_util_1.ValueCell.create(linear_algebra_1.Vec2.create(width, height)),
        uProjection: mol_util_1.ValueCell.create(linear_algebra_1.Mat4.identity()),
        uInvProjection: mol_util_1.ValueCell.create(linear_algebra_1.Mat4.identity()),
        uBounds: mol_util_1.ValueCell.create((0, linear_algebra_1.Vec4)()),
        dOrthographic: mol_util_1.ValueCell.create(0),
        uNear: mol_util_1.ValueCell.create(1),
        uFar: mol_util_1.ValueCell.create(10000),
        dSteps: mol_util_1.ValueCell.create(1),
        uMaxDistance: mol_util_1.ValueCell.create(3.0),
        uTolerance: mol_util_1.ValueCell.create(1.0),
        uBias: mol_util_1.ValueCell.create(0.6),
        uLightDirection: mol_util_1.ValueCell.create([]),
        uLightColor: mol_util_1.ValueCell.create([]),
        dLightCount: mol_util_1.ValueCell.create(0),
    };
    const schema = { ...ShadowsSchema };
    const shaderCode = (0, shader_code_1.ShaderCode)('shadows', quad_vert_1.quad_vert, shadows_frag_1.shadows_frag);
    const renderItem = (0, render_item_1.createComputeRenderItem)(ctx, 'triangles', shaderCode, schema, values);
    return (0, renderable_1.createComputeRenderable)(renderItem, values);
}
const SsaoSchema = {
    ...util_1.QuadSchema,
    tDepth: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tDepthHalf: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tDepthQuarter: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    uSamples: (0, schema_1.UniformSpec)('v3[]'),
    dNSamples: (0, schema_1.DefineSpec)('number'),
    uProjection: (0, schema_1.UniformSpec)('m4'),
    uInvProjection: (0, schema_1.UniformSpec)('m4'),
    uBounds: (0, schema_1.UniformSpec)('v4'),
    uTexSize: (0, schema_1.UniformSpec)('v2'),
    uRadius: (0, schema_1.UniformSpec)('f'),
    uBias: (0, schema_1.UniformSpec)('f'),
    dMultiScale: (0, schema_1.DefineSpec)('boolean'),
    dLevels: (0, schema_1.DefineSpec)('number'),
    uLevelRadius: (0, schema_1.UniformSpec)('f[]'),
    uLevelBias: (0, schema_1.UniformSpec)('f[]'),
    uNearThreshold: (0, schema_1.UniformSpec)('f'),
    uFarThreshold: (0, schema_1.UniformSpec)('f'),
};
function getSsaoRenderable(ctx, depthTexture, depthHalfTexture, depthQuarterTexture) {
    const values = {
        ...util_1.QuadValues,
        tDepth: mol_util_1.ValueCell.create(depthTexture),
        tDepthHalf: mol_util_1.ValueCell.create(depthHalfTexture),
        tDepthQuarter: mol_util_1.ValueCell.create(depthQuarterTexture),
        uSamples: mol_util_1.ValueCell.create(getSamples(32)),
        dNSamples: mol_util_1.ValueCell.create(32),
        uProjection: mol_util_1.ValueCell.create(linear_algebra_1.Mat4.identity()),
        uInvProjection: mol_util_1.ValueCell.create(linear_algebra_1.Mat4.identity()),
        uBounds: mol_util_1.ValueCell.create((0, linear_algebra_1.Vec4)()),
        uTexSize: mol_util_1.ValueCell.create(linear_algebra_1.Vec2.create(ctx.gl.drawingBufferWidth, ctx.gl.drawingBufferHeight)),
        uRadius: mol_util_1.ValueCell.create(Math.pow(2, 5)),
        uBias: mol_util_1.ValueCell.create(0.8),
        dMultiScale: mol_util_1.ValueCell.create(false),
        dLevels: mol_util_1.ValueCell.create(3),
        uLevelRadius: mol_util_1.ValueCell.create([Math.pow(2, 2), Math.pow(2, 5), Math.pow(2, 8)]),
        uLevelBias: mol_util_1.ValueCell.create([0.8, 0.8, 0.8]),
        uNearThreshold: mol_util_1.ValueCell.create(10.0),
        uFarThreshold: mol_util_1.ValueCell.create(1500.0),
    };
    const schema = { ...SsaoSchema };
    const shaderCode = (0, shader_code_1.ShaderCode)('ssao', quad_vert_1.quad_vert, ssao_frag_1.ssao_frag);
    const renderItem = (0, render_item_1.createComputeRenderItem)(ctx, 'triangles', shaderCode, schema, values);
    return (0, renderable_1.createComputeRenderable)(renderItem, values);
}
const SsaoBlurSchema = {
    ...util_1.QuadSchema,
    tSsaoDepth: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    uTexSize: (0, schema_1.UniformSpec)('v2'),
    uKernel: (0, schema_1.UniformSpec)('f[]'),
    dOcclusionKernelSize: (0, schema_1.DefineSpec)('number'),
    uBlurDirectionX: (0, schema_1.UniformSpec)('f'),
    uBlurDirectionY: (0, schema_1.UniformSpec)('f'),
    uInvProjection: (0, schema_1.UniformSpec)('m4'),
    uNear: (0, schema_1.UniformSpec)('f'),
    uFar: (0, schema_1.UniformSpec)('f'),
    uBounds: (0, schema_1.UniformSpec)('v4'),
    dOrthographic: (0, schema_1.DefineSpec)('number'),
};
function getSsaoBlurRenderable(ctx, ssaoDepthTexture, direction) {
    const values = {
        ...util_1.QuadValues,
        tSsaoDepth: mol_util_1.ValueCell.create(ssaoDepthTexture),
        uTexSize: mol_util_1.ValueCell.create(linear_algebra_1.Vec2.create(ssaoDepthTexture.getWidth(), ssaoDepthTexture.getHeight())),
        uKernel: mol_util_1.ValueCell.create(getBlurKernel(15)),
        dOcclusionKernelSize: mol_util_1.ValueCell.create(15),
        uBlurDirectionX: mol_util_1.ValueCell.create(direction === 'horizontal' ? 1 : 0),
        uBlurDirectionY: mol_util_1.ValueCell.create(direction === 'vertical' ? 1 : 0),
        uInvProjection: mol_util_1.ValueCell.create(linear_algebra_1.Mat4.identity()),
        uNear: mol_util_1.ValueCell.create(0.0),
        uFar: mol_util_1.ValueCell.create(10000.0),
        uBounds: mol_util_1.ValueCell.create((0, linear_algebra_1.Vec4)()),
        dOrthographic: mol_util_1.ValueCell.create(0),
    };
    const schema = { ...SsaoBlurSchema };
    const shaderCode = (0, shader_code_1.ShaderCode)('ssao_blur', quad_vert_1.quad_vert, ssao_blur_frag_1.ssaoBlur_frag);
    const renderItem = (0, render_item_1.createComputeRenderItem)(ctx, 'triangles', shaderCode, schema, values);
    return (0, renderable_1.createComputeRenderable)(renderItem, values);
}
function getBlurKernel(kernelSize) {
    const sigma = kernelSize / 3.0;
    const halfKernelSize = Math.floor((kernelSize + 1) / 2);
    const kernel = [];
    for (let x = 0; x < halfKernelSize; x++) {
        kernel.push((1.0 / ((Math.sqrt(2 * Math.PI)) * sigma)) * Math.exp(-x * x / (2 * sigma * sigma)));
    }
    return kernel;
}
const RandomHemisphereVector = [];
for (let i = 0; i < 256; i++) {
    const v = (0, linear_algebra_1.Vec3)();
    v[0] = Math.random() * 2.0 - 1.0;
    v[1] = Math.random() * 2.0 - 1.0;
    v[2] = Math.random();
    linear_algebra_1.Vec3.normalize(v, v);
    linear_algebra_1.Vec3.scale(v, v, Math.random());
    RandomHemisphereVector.push(v);
}
function getSamples(nSamples) {
    const samples = [];
    for (let i = 0; i < nSamples; i++) {
        let scale = (i * i + 2.0 * i + 1) / (nSamples * nSamples);
        scale = 0.1 + scale * (1.0 - 0.1);
        samples.push(RandomHemisphereVector[i][0] * scale);
        samples.push(RandomHemisphereVector[i][1] * scale);
        samples.push(RandomHemisphereVector[i][2] * scale);
    }
    return samples;
}
const PostprocessingSchema = {
    ...util_1.QuadSchema,
    tSsaoDepth: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tColor: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tDepthOpaque: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tDepthTransparent: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tShadows: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    tOutlines: (0, schema_1.TextureSpec)('texture', 'rgba', 'ubyte', 'nearest'),
    uTexSize: (0, schema_1.UniformSpec)('v2'),
    dOrthographic: (0, schema_1.DefineSpec)('number'),
    uNear: (0, schema_1.UniformSpec)('f'),
    uFar: (0, schema_1.UniformSpec)('f'),
    uFogNear: (0, schema_1.UniformSpec)('f'),
    uFogFar: (0, schema_1.UniformSpec)('f'),
    uFogColor: (0, schema_1.UniformSpec)('v3'),
    uOutlineColor: (0, schema_1.UniformSpec)('v3'),
    uOcclusionColor: (0, schema_1.UniformSpec)('v3'),
    uTransparentBackground: (0, schema_1.UniformSpec)('b'),
    dOcclusionEnable: (0, schema_1.DefineSpec)('boolean'),
    uOcclusionOffset: (0, schema_1.UniformSpec)('v2'),
    dShadowEnable: (0, schema_1.DefineSpec)('boolean'),
    dOutlineEnable: (0, schema_1.DefineSpec)('boolean'),
    dOutlineScale: (0, schema_1.DefineSpec)('number'),
    dTransparentOutline: (0, schema_1.DefineSpec)('boolean'),
};
function getPostprocessingRenderable(ctx, colorTexture, depthTextureOpaque, depthTextureTransparent, shadowsTexture, outlinesTexture, ssaoDepthTexture, transparentOutline) {
    const values = {
        ...util_1.QuadValues,
        tSsaoDepth: mol_util_1.ValueCell.create(ssaoDepthTexture),
        tColor: mol_util_1.ValueCell.create(colorTexture),
        tDepthOpaque: mol_util_1.ValueCell.create(depthTextureOpaque),
        tDepthTransparent: mol_util_1.ValueCell.create(depthTextureTransparent),
        tShadows: mol_util_1.ValueCell.create(shadowsTexture),
        tOutlines: mol_util_1.ValueCell.create(outlinesTexture),
        uTexSize: mol_util_1.ValueCell.create(linear_algebra_1.Vec2.create(colorTexture.getWidth(), colorTexture.getHeight())),
        dOrthographic: mol_util_1.ValueCell.create(0),
        uNear: mol_util_1.ValueCell.create(1),
        uFar: mol_util_1.ValueCell.create(10000),
        uFogNear: mol_util_1.ValueCell.create(10000),
        uFogFar: mol_util_1.ValueCell.create(10000),
        uFogColor: mol_util_1.ValueCell.create(linear_algebra_1.Vec3.create(1, 1, 1)),
        uOutlineColor: mol_util_1.ValueCell.create(linear_algebra_1.Vec3.create(0, 0, 0)),
        uOcclusionColor: mol_util_1.ValueCell.create(linear_algebra_1.Vec3.create(0, 0, 0)),
        uTransparentBackground: mol_util_1.ValueCell.create(false),
        dOcclusionEnable: mol_util_1.ValueCell.create(true),
        uOcclusionOffset: mol_util_1.ValueCell.create(linear_algebra_1.Vec2.create(0, 0)),
        dShadowEnable: mol_util_1.ValueCell.create(false),
        dOutlineEnable: mol_util_1.ValueCell.create(false),
        dOutlineScale: mol_util_1.ValueCell.create(1),
        dTransparentOutline: mol_util_1.ValueCell.create(transparentOutline),
    };
    const schema = { ...PostprocessingSchema };
    const shaderCode = (0, shader_code_1.ShaderCode)('postprocessing', quad_vert_1.quad_vert, postprocessing_frag_1.postprocessing_frag);
    const renderItem = (0, render_item_1.createComputeRenderItem)(ctx, 'triangles', shaderCode, schema, values);
    return (0, renderable_1.createComputeRenderable)(renderItem, values);
}
exports.PostprocessingParams = {
    occlusion: param_definition_1.ParamDefinition.MappedStatic('on', {
        on: param_definition_1.ParamDefinition.Group({
            samples: param_definition_1.ParamDefinition.Numeric(32, { min: 1, max: 256, step: 1 }),
            multiScale: param_definition_1.ParamDefinition.MappedStatic('off', {
                on: param_definition_1.ParamDefinition.Group({
                    levels: param_definition_1.ParamDefinition.ObjectList({
                        radius: param_definition_1.ParamDefinition.Numeric(5, { min: 0, max: 20, step: 0.1 }, { description: 'Final occlusion radius is 2^x' }),
                        bias: param_definition_1.ParamDefinition.Numeric(1, { min: 0, max: 3, step: 0.1 }),
                    }, o => `${o.radius}, ${o.bias}`, { defaultValue: [
                            { radius: 2, bias: 1 },
                            { radius: 5, bias: 1 },
                            { radius: 8, bias: 1 },
                            { radius: 11, bias: 1 },
                        ] }),
                    nearThreshold: param_definition_1.ParamDefinition.Numeric(10, { min: 0, max: 50, step: 1 }),
                    farThreshold: param_definition_1.ParamDefinition.Numeric(1500, { min: 0, max: 10000, step: 100 }),
                }),
                off: param_definition_1.ParamDefinition.Group({})
            }, { cycle: true }),
            radius: param_definition_1.ParamDefinition.Numeric(5, { min: 0, max: 20, step: 0.1 }, { description: 'Final occlusion radius is 2^x', hideIf: p => (p === null || p === void 0 ? void 0 : p.multiScale.name) === 'on' }),
            bias: param_definition_1.ParamDefinition.Numeric(0.8, { min: 0, max: 3, step: 0.1 }),
            blurKernelSize: param_definition_1.ParamDefinition.Numeric(15, { min: 1, max: 25, step: 2 }),
            resolutionScale: param_definition_1.ParamDefinition.Numeric(1, { min: 0.1, max: 1, step: 0.05 }, { description: 'Adjust resolution of occlusion calculation' }),
            color: param_definition_1.ParamDefinition.Color((0, color_1.Color)(0x000000)),
        }),
        off: param_definition_1.ParamDefinition.Group({})
    }, { cycle: true, description: 'Darken occluded crevices with the ambient occlusion effect' }),
    shadow: param_definition_1.ParamDefinition.MappedStatic('off', {
        on: param_definition_1.ParamDefinition.Group({
            steps: param_definition_1.ParamDefinition.Numeric(1, { min: 1, max: 64, step: 1 }),
            bias: param_definition_1.ParamDefinition.Numeric(0.6, { min: 0.0, max: 1.0, step: 0.01 }),
            maxDistance: param_definition_1.ParamDefinition.Numeric(3, { min: 0, max: 256, step: 1 }),
            tolerance: param_definition_1.ParamDefinition.Numeric(1.0, { min: 0.0, max: 10.0, step: 0.1 }),
        }),
        off: param_definition_1.ParamDefinition.Group({})
    }, { cycle: true, description: 'Simplistic shadows' }),
    outline: param_definition_1.ParamDefinition.MappedStatic('off', {
        on: param_definition_1.ParamDefinition.Group({
            scale: param_definition_1.ParamDefinition.Numeric(1, { min: 1, max: 5, step: 1 }),
            threshold: param_definition_1.ParamDefinition.Numeric(0.33, { min: 0.01, max: 1, step: 0.01 }),
            color: param_definition_1.ParamDefinition.Color((0, color_1.Color)(0x000000)),
            includeTransparent: param_definition_1.ParamDefinition.Boolean(true, { description: 'Whether to show outline for transparent objects' }),
        }),
        off: param_definition_1.ParamDefinition.Group({})
    }, { cycle: true, description: 'Draw outline around 3D objects' }),
    antialiasing: param_definition_1.ParamDefinition.MappedStatic('smaa', {
        fxaa: param_definition_1.ParamDefinition.Group(fxaa_1.FxaaParams),
        smaa: param_definition_1.ParamDefinition.Group(smaa_1.SmaaParams),
        off: param_definition_1.ParamDefinition.Group({})
    }, { options: [['fxaa', 'FXAA'], ['smaa', 'SMAA'], ['off', 'Off']], description: 'Smooth pixel edges' }),
    sharpening: param_definition_1.ParamDefinition.MappedStatic('off', {
        on: param_definition_1.ParamDefinition.Group(cas_1.CasParams),
        off: param_definition_1.ParamDefinition.Group({})
    }, { cycle: true, description: 'Contrast Adaptive Sharpening' }),
    background: param_definition_1.ParamDefinition.Group(background_1.BackgroundParams, { isFlat: true }),
};
function getLevels(props, levels) {
    const count = props.length;
    const { radius, bias } = levels || {
        radius: (new Array(count * 3)).fill(0),
        bias: (new Array(count * 3)).fill(0),
    };
    props = props.slice().sort((a, b) => a.radius - b.radius);
    for (let i = 0; i < count; ++i) {
        const p = props[i];
        radius[i] = Math.pow(2, p.radius);
        bias[i] = p.bias;
    }
    return { count, radius, bias };
}
class PostprocessingPass {
    static isEnabled(props) {
        return props.occlusion.name === 'on' || props.shadow.name === 'on' || props.outline.name === 'on' || props.background.variant.name !== 'off';
    }
    static isTransparentOutlineEnabled(props) {
        return props.outline.name === 'on' && props.outline.params.includeTransparent;
    }
    calcSsaoScale(resolutionScale) {
        // downscale ssao for high pixel-ratios
        return Math.min(1, 1 / this.webgl.pixelRatio) * resolutionScale;
    }
    constructor(webgl, assetManager, drawPass) {
        this.webgl = webgl;
        this.drawPass = drawPass;
        this.bgColor = (0, linear_algebra_1.Vec3)();
        this.occlusionOffset = [0, 0];
        this.transparentBackground = false;
        const { colorTarget, depthTextureTransparent, depthTextureOpaque } = drawPass;
        const width = colorTarget.getWidth();
        const height = colorTarget.getHeight();
        this.nSamples = 1;
        this.blurKernelSize = 1;
        this.ssaoScale = this.calcSsaoScale(1);
        this.levels = [];
        // needs to be linear for anti-aliasing pass
        this.target = webgl.createRenderTarget(width, height, false, 'uint8', 'linear');
        this.outlinesTarget = webgl.createRenderTarget(width, height, false);
        this.outlinesRenderable = getOutlinesRenderable(webgl, depthTextureOpaque, depthTextureTransparent, true);
        this.shadowsTarget = webgl.createRenderTarget(width, height, false);
        this.shadowsRenderable = getShadowsRenderable(webgl, depthTextureOpaque);
        this.ssaoFramebuffer = webgl.resources.framebuffer();
        this.ssaoBlurFirstPassFramebuffer = webgl.resources.framebuffer();
        this.ssaoBlurSecondPassFramebuffer = webgl.resources.framebuffer();
        const sw = Math.floor(width * this.ssaoScale);
        const sh = Math.floor(height * this.ssaoScale);
        const hw = Math.max(1, Math.floor(sw * 0.5));
        const hh = Math.max(1, Math.floor(sh * 0.5));
        const qw = Math.max(1, Math.floor(sw * 0.25));
        const qh = Math.max(1, Math.floor(sh * 0.25));
        this.downsampledDepthTarget = drawPass.packedDepth
            ? webgl.createRenderTarget(sw, sh, false, 'uint8', 'nearest', 'rgba')
            : webgl.createRenderTarget(sw, sh, false, 'float32', 'nearest', webgl.isWebGL2 ? 'alpha' : 'rgba');
        this.downsampleDepthRenderable = (0, util_1.createCopyRenderable)(webgl, depthTextureOpaque);
        const depthTexture = this.ssaoScale === 1 ? depthTextureOpaque : this.downsampledDepthTarget.texture;
        this.depthHalfTarget = drawPass.packedDepth
            ? webgl.createRenderTarget(hw, hh, false, 'uint8', 'nearest', 'rgba')
            : webgl.createRenderTarget(hw, hh, false, 'float32', 'nearest', webgl.isWebGL2 ? 'alpha' : 'rgba');
        this.depthHalfRenderable = (0, util_1.createCopyRenderable)(webgl, depthTexture);
        this.depthQuarterTarget = drawPass.packedDepth
            ? webgl.createRenderTarget(qw, qh, false, 'uint8', 'nearest', 'rgba')
            : webgl.createRenderTarget(qw, qh, false, 'float32', 'nearest', webgl.isWebGL2 ? 'alpha' : 'rgba');
        this.depthQuarterRenderable = (0, util_1.createCopyRenderable)(webgl, this.depthHalfTarget.texture);
        this.ssaoDepthTexture = webgl.resources.texture('image-uint8', 'rgba', 'ubyte', 'nearest');
        this.ssaoDepthTexture.define(sw, sh);
        this.ssaoDepthTexture.attachFramebuffer(this.ssaoFramebuffer, 'color0');
        this.ssaoDepthBlurProxyTexture = webgl.resources.texture('image-uint8', 'rgba', 'ubyte', 'nearest');
        this.ssaoDepthBlurProxyTexture.define(sw, sh);
        this.ssaoDepthBlurProxyTexture.attachFramebuffer(this.ssaoBlurFirstPassFramebuffer, 'color0');
        this.ssaoDepthTexture.attachFramebuffer(this.ssaoBlurSecondPassFramebuffer, 'color0');
        this.ssaoRenderable = getSsaoRenderable(webgl, depthTexture, this.depthHalfTarget.texture, this.depthQuarterTarget.texture);
        this.ssaoBlurFirstPassRenderable = getSsaoBlurRenderable(webgl, this.ssaoDepthTexture, 'horizontal');
        this.ssaoBlurSecondPassRenderable = getSsaoBlurRenderable(webgl, this.ssaoDepthBlurProxyTexture, 'vertical');
        this.renderable = getPostprocessingRenderable(webgl, colorTarget.texture, depthTextureOpaque, depthTextureTransparent, this.shadowsTarget.texture, this.outlinesTarget.texture, this.ssaoDepthTexture, true);
        this.background = new background_1.BackgroundPass(webgl, assetManager, width, height);
    }
    setSize(width, height) {
        const [w, h] = this.renderable.values.uTexSize.ref.value;
        const ssaoScale = this.calcSsaoScale(1);
        if (width !== w || height !== h || this.ssaoScale !== ssaoScale) {
            this.ssaoScale = ssaoScale;
            this.target.setSize(width, height);
            this.outlinesTarget.setSize(width, height);
            this.shadowsTarget.setSize(width, height);
            const sw = Math.floor(width * this.ssaoScale);
            const sh = Math.floor(height * this.ssaoScale);
            this.downsampledDepthTarget.setSize(sw, sh);
            this.ssaoDepthTexture.define(sw, sh);
            this.ssaoDepthBlurProxyTexture.define(sw, sh);
            const hw = Math.max(1, Math.floor(sw * 0.5));
            const hh = Math.max(1, Math.floor(sh * 0.5));
            this.depthHalfTarget.setSize(hw, hh);
            const qw = Math.max(1, Math.floor(sw * 0.25));
            const qh = Math.max(1, Math.floor(sh * 0.25));
            this.depthQuarterTarget.setSize(qw, qh);
            mol_util_1.ValueCell.update(this.renderable.values.uTexSize, linear_algebra_1.Vec2.set(this.renderable.values.uTexSize.ref.value, width, height));
            mol_util_1.ValueCell.update(this.outlinesRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.outlinesRenderable.values.uTexSize.ref.value, width, height));
            mol_util_1.ValueCell.update(this.shadowsRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.shadowsRenderable.values.uTexSize.ref.value, width, height));
            mol_util_1.ValueCell.update(this.downsampleDepthRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.downsampleDepthRenderable.values.uTexSize.ref.value, sw, sh));
            mol_util_1.ValueCell.update(this.depthHalfRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.depthHalfRenderable.values.uTexSize.ref.value, hw, hh));
            mol_util_1.ValueCell.update(this.depthQuarterRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.depthQuarterRenderable.values.uTexSize.ref.value, qw, qh));
            mol_util_1.ValueCell.update(this.ssaoRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.ssaoRenderable.values.uTexSize.ref.value, sw, sh));
            mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.ssaoBlurFirstPassRenderable.values.uTexSize.ref.value, sw, sh));
            mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.ssaoBlurSecondPassRenderable.values.uTexSize.ref.value, sw, sh));
            const depthTexture = this.ssaoScale === 1 ? this.drawPass.depthTextureOpaque : this.downsampledDepthTarget.texture;
            mol_util_1.ValueCell.update(this.depthHalfRenderable.values.tColor, depthTexture);
            mol_util_1.ValueCell.update(this.ssaoRenderable.values.tDepth, depthTexture);
            this.depthHalfRenderable.update();
            this.ssaoRenderable.update();
            this.background.setSize(width, height);
        }
    }
    updateState(camera, transparentBackground, backgroundColor, props, light) {
        var _a;
        let needsUpdateShadows = false;
        let needsUpdateMain = false;
        let needsUpdateSsao = false;
        let needsUpdateSsaoBlur = false;
        let needsUpdateDepthHalf = false;
        let needsUpdateOutlines = false;
        const orthographic = camera.state.mode === 'orthographic' ? 1 : 0;
        const outlinesEnabled = props.outline.name === 'on';
        const shadowsEnabled = props.shadow.name === 'on';
        const occlusionEnabled = props.occlusion.name === 'on';
        const invProjection = linear_algebra_1.Mat4.identity();
        linear_algebra_1.Mat4.invert(invProjection, camera.projection);
        const [w, h] = this.renderable.values.uTexSize.ref.value;
        const v = camera.viewport;
        if (props.occlusion.name === 'on') {
            mol_util_1.ValueCell.update(this.ssaoRenderable.values.uProjection, camera.projection);
            mol_util_1.ValueCell.update(this.ssaoRenderable.values.uInvProjection, invProjection);
            const b = this.ssaoRenderable.values.uBounds;
            const s = this.ssaoScale;
            linear_algebra_1.Vec4.set(b.ref.value, Math.floor(v.x * s) / (w * s), Math.floor(v.y * s) / (h * s), Math.ceil((v.x + v.width) * s) / (w * s), Math.ceil((v.y + v.height) * s) / (h * s));
            mol_util_1.ValueCell.update(b, b.ref.value);
            mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.uBounds, b.ref.value);
            mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.uBounds, b.ref.value);
            mol_util_1.ValueCell.updateIfChanged(this.ssaoBlurFirstPassRenderable.values.uNear, camera.near);
            mol_util_1.ValueCell.updateIfChanged(this.ssaoBlurSecondPassRenderable.values.uNear, camera.near);
            mol_util_1.ValueCell.updateIfChanged(this.ssaoBlurFirstPassRenderable.values.uFar, camera.far);
            mol_util_1.ValueCell.updateIfChanged(this.ssaoBlurSecondPassRenderable.values.uFar, camera.far);
            mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.uInvProjection, invProjection);
            mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.uInvProjection, invProjection);
            if (this.ssaoBlurFirstPassRenderable.values.dOrthographic.ref.value !== orthographic) {
                needsUpdateSsaoBlur = true;
                mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.dOrthographic, orthographic);
                mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.dOrthographic, orthographic);
            }
            if (this.nSamples !== props.occlusion.params.samples) {
                needsUpdateSsao = true;
                this.nSamples = props.occlusion.params.samples;
                mol_util_1.ValueCell.update(this.ssaoRenderable.values.uSamples, getSamples(this.nSamples));
                mol_util_1.ValueCell.updateIfChanged(this.ssaoRenderable.values.dNSamples, this.nSamples);
            }
            const multiScale = props.occlusion.params.multiScale.name === 'on';
            if (this.ssaoRenderable.values.dMultiScale.ref.value !== multiScale) {
                needsUpdateSsao = true;
                mol_util_1.ValueCell.update(this.ssaoRenderable.values.dMultiScale, multiScale);
            }
            if (props.occlusion.params.multiScale.name === 'on') {
                const mp = props.occlusion.params.multiScale.params;
                if (!(0, mol_util_1.deepEqual)(this.levels, mp.levels)) {
                    needsUpdateSsao = true;
                    this.levels = mp.levels;
                    const levels = getLevels(mp.levels);
                    mol_util_1.ValueCell.updateIfChanged(this.ssaoRenderable.values.dLevels, levels.count);
                    mol_util_1.ValueCell.update(this.ssaoRenderable.values.uLevelRadius, levels.radius);
                    mol_util_1.ValueCell.update(this.ssaoRenderable.values.uLevelBias, levels.bias);
                }
                mol_util_1.ValueCell.updateIfChanged(this.ssaoRenderable.values.uNearThreshold, mp.nearThreshold);
                mol_util_1.ValueCell.updateIfChanged(this.ssaoRenderable.values.uFarThreshold, mp.farThreshold);
            }
            else {
                mol_util_1.ValueCell.updateIfChanged(this.ssaoRenderable.values.uRadius, Math.pow(2, props.occlusion.params.radius));
            }
            mol_util_1.ValueCell.updateIfChanged(this.ssaoRenderable.values.uBias, props.occlusion.params.bias);
            if (this.blurKernelSize !== props.occlusion.params.blurKernelSize) {
                needsUpdateSsaoBlur = true;
                this.blurKernelSize = props.occlusion.params.blurKernelSize;
                const kernel = getBlurKernel(this.blurKernelSize);
                mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.uKernel, kernel);
                mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.uKernel, kernel);
                mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.dOcclusionKernelSize, this.blurKernelSize);
                mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.dOcclusionKernelSize, this.blurKernelSize);
            }
            const ssaoScale = this.calcSsaoScale(props.occlusion.params.resolutionScale);
            if (this.ssaoScale !== ssaoScale) {
                needsUpdateSsao = true;
                needsUpdateDepthHalf = true;
                this.ssaoScale = ssaoScale;
                const sw = Math.floor(w * this.ssaoScale);
                const sh = Math.floor(h * this.ssaoScale);
                this.downsampledDepthTarget.setSize(sw, sh);
                this.ssaoDepthTexture.define(sw, sh);
                this.ssaoDepthBlurProxyTexture.define(sw, sh);
                const hw = Math.floor(sw * 0.5);
                const hh = Math.floor(sh * 0.5);
                this.depthHalfTarget.setSize(hw, hh);
                const qw = Math.floor(sw * 0.25);
                const qh = Math.floor(sh * 0.25);
                this.depthQuarterTarget.setSize(qw, qh);
                const depthTexture = this.ssaoScale === 1 ? this.drawPass.depthTextureOpaque : this.downsampledDepthTarget.texture;
                mol_util_1.ValueCell.update(this.depthHalfRenderable.values.tColor, depthTexture);
                mol_util_1.ValueCell.update(this.ssaoRenderable.values.tDepth, depthTexture);
                mol_util_1.ValueCell.update(this.ssaoRenderable.values.tDepthHalf, this.depthHalfTarget.texture);
                mol_util_1.ValueCell.update(this.ssaoRenderable.values.tDepthQuarter, this.depthQuarterTarget.texture);
                mol_util_1.ValueCell.update(this.downsampleDepthRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.downsampleDepthRenderable.values.uTexSize.ref.value, sw, sh));
                mol_util_1.ValueCell.update(this.depthHalfRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.depthHalfRenderable.values.uTexSize.ref.value, hw, hh));
                mol_util_1.ValueCell.update(this.depthQuarterRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.depthQuarterRenderable.values.uTexSize.ref.value, qw, qh));
                mol_util_1.ValueCell.update(this.ssaoRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.ssaoRenderable.values.uTexSize.ref.value, sw, sh));
                mol_util_1.ValueCell.update(this.ssaoBlurFirstPassRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.ssaoBlurFirstPassRenderable.values.uTexSize.ref.value, sw, sh));
                mol_util_1.ValueCell.update(this.ssaoBlurSecondPassRenderable.values.uTexSize, linear_algebra_1.Vec2.set(this.ssaoBlurSecondPassRenderable.values.uTexSize.ref.value, sw, sh));
            }
            mol_util_1.ValueCell.update(this.renderable.values.uOcclusionColor, color_1.Color.toVec3Normalized(this.renderable.values.uOcclusionColor.ref.value, props.occlusion.params.color));
        }
        if (props.shadow.name === 'on') {
            mol_util_1.ValueCell.update(this.shadowsRenderable.values.uProjection, camera.projection);
            mol_util_1.ValueCell.update(this.shadowsRenderable.values.uInvProjection, invProjection);
            linear_algebra_1.Vec4.set(this.shadowsRenderable.values.uBounds.ref.value, v.x / w, v.y / h, (v.x + v.width) / w, (v.y + v.height) / h);
            mol_util_1.ValueCell.update(this.shadowsRenderable.values.uBounds, this.shadowsRenderable.values.uBounds.ref.value);
            mol_util_1.ValueCell.updateIfChanged(this.shadowsRenderable.values.uNear, camera.near);
            mol_util_1.ValueCell.updateIfChanged(this.shadowsRenderable.values.uFar, camera.far);
            if (this.shadowsRenderable.values.dOrthographic.ref.value !== orthographic) {
                mol_util_1.ValueCell.update(this.shadowsRenderable.values.dOrthographic, orthographic);
                needsUpdateShadows = true;
            }
            mol_util_1.ValueCell.updateIfChanged(this.shadowsRenderable.values.uMaxDistance, props.shadow.params.maxDistance);
            mol_util_1.ValueCell.updateIfChanged(this.shadowsRenderable.values.uTolerance, props.shadow.params.tolerance);
            mol_util_1.ValueCell.updateIfChanged(this.shadowsRenderable.values.uBias, props.shadow.params.bias);
            if (this.shadowsRenderable.values.dSteps.ref.value !== props.shadow.params.steps) {
                mol_util_1.ValueCell.update(this.shadowsRenderable.values.dSteps, props.shadow.params.steps);
                needsUpdateShadows = true;
            }
            mol_util_1.ValueCell.update(this.shadowsRenderable.values.uLightDirection, light.direction);
            mol_util_1.ValueCell.update(this.shadowsRenderable.values.uLightColor, light.color);
            if (this.shadowsRenderable.values.dLightCount.ref.value !== light.count) {
                mol_util_1.ValueCell.update(this.shadowsRenderable.values.dLightCount, light.count);
                needsUpdateShadows = true;
            }
        }
        if (props.outline.name === 'on') {
            const transparentOutline = (_a = props.outline.params.includeTransparent) !== null && _a !== void 0 ? _a : true;
            const outlineScale = Math.max(1, Math.round(props.outline.params.scale * this.webgl.pixelRatio)) - 1;
            const outlineThreshold = 50 * props.outline.params.threshold * this.webgl.pixelRatio;
            mol_util_1.ValueCell.updateIfChanged(this.outlinesRenderable.values.uNear, camera.near);
            mol_util_1.ValueCell.updateIfChanged(this.outlinesRenderable.values.uFar, camera.far);
            mol_util_1.ValueCell.update(this.outlinesRenderable.values.uInvProjection, invProjection);
            if (this.outlinesRenderable.values.dTransparentOutline.ref.value !== transparentOutline) {
                needsUpdateOutlines = true;
                mol_util_1.ValueCell.update(this.outlinesRenderable.values.dTransparentOutline, transparentOutline);
            }
            if (this.outlinesRenderable.values.dOrthographic.ref.value !== orthographic) {
                needsUpdateOutlines = true;
                mol_util_1.ValueCell.update(this.outlinesRenderable.values.dOrthographic, orthographic);
            }
            mol_util_1.ValueCell.updateIfChanged(this.outlinesRenderable.values.uOutlineThreshold, outlineThreshold);
            mol_util_1.ValueCell.update(this.renderable.values.uOutlineColor, color_1.Color.toVec3Normalized(this.renderable.values.uOutlineColor.ref.value, props.outline.params.color));
            if (this.renderable.values.dOutlineScale.ref.value !== outlineScale) {
                needsUpdateMain = true;
                mol_util_1.ValueCell.update(this.renderable.values.dOutlineScale, outlineScale);
            }
            if (this.renderable.values.dTransparentOutline.ref.value !== transparentOutline) {
                needsUpdateMain = true;
                mol_util_1.ValueCell.update(this.renderable.values.dTransparentOutline, transparentOutline);
            }
        }
        mol_util_1.ValueCell.updateIfChanged(this.renderable.values.uFar, camera.far);
        mol_util_1.ValueCell.updateIfChanged(this.renderable.values.uNear, camera.near);
        mol_util_1.ValueCell.updateIfChanged(this.renderable.values.uFogFar, camera.fogFar);
        mol_util_1.ValueCell.updateIfChanged(this.renderable.values.uFogNear, camera.fogNear);
        mol_util_1.ValueCell.update(this.renderable.values.uFogColor, color_1.Color.toVec3Normalized(this.renderable.values.uFogColor.ref.value, backgroundColor));
        mol_util_1.ValueCell.updateIfChanged(this.renderable.values.uTransparentBackground, transparentBackground);
        if (this.renderable.values.dOrthographic.ref.value !== orthographic) {
            needsUpdateMain = true;
            mol_util_1.ValueCell.update(this.renderable.values.dOrthographic, orthographic);
        }
        if (this.renderable.values.dOutlineEnable.ref.value !== outlinesEnabled) {
            needsUpdateMain = true;
            mol_util_1.ValueCell.update(this.renderable.values.dOutlineEnable, outlinesEnabled);
        }
        if (this.renderable.values.dShadowEnable.ref.value !== shadowsEnabled) {
            needsUpdateMain = true;
            mol_util_1.ValueCell.update(this.renderable.values.dShadowEnable, shadowsEnabled);
        }
        if (this.renderable.values.dOcclusionEnable.ref.value !== occlusionEnabled) {
            needsUpdateMain = true;
            mol_util_1.ValueCell.update(this.renderable.values.dOcclusionEnable, occlusionEnabled);
        }
        if (needsUpdateOutlines) {
            this.outlinesRenderable.update();
        }
        if (needsUpdateShadows) {
            this.shadowsRenderable.update();
        }
        if (needsUpdateSsao) {
            this.ssaoRenderable.update();
        }
        if (needsUpdateSsaoBlur) {
            this.ssaoBlurFirstPassRenderable.update();
            this.ssaoBlurSecondPassRenderable.update();
        }
        if (needsUpdateDepthHalf) {
            this.depthHalfRenderable.update();
        }
        if (needsUpdateMain) {
            this.renderable.update();
        }
        const { gl, state } = this.webgl;
        state.enable(gl.SCISSOR_TEST);
        state.disable(gl.BLEND);
        state.disable(gl.DEPTH_TEST);
        state.depthMask(false);
    }
    setOcclusionOffset(x, y) {
        this.occlusionOffset[0] = x;
        this.occlusionOffset[1] = y;
        mol_util_1.ValueCell.update(this.renderable.values.uOcclusionOffset, linear_algebra_1.Vec2.set(this.renderable.values.uOcclusionOffset.ref.value, x, y));
    }
    setTransparentBackground(value) {
        this.transparentBackground = value;
    }
    render(camera, toDrawingBuffer, transparentBackground, backgroundColor, props, light) {
        if (debug_1.isTimingMode)
            this.webgl.timer.mark('PostprocessingPass.render');
        this.updateState(camera, transparentBackground, backgroundColor, props, light);
        const { gl, state } = this.webgl;
        const { x, y, width, height } = camera.viewport;
        // don't render occlusion if offset is given,
        // which will reuse the existing occlusion
        if (props.occlusion.name === 'on' && this.occlusionOffset[0] === 0 && this.occlusionOffset[1] === 0) {
            if (debug_1.isTimingMode)
                this.webgl.timer.mark('SSAO.render');
            const sx = Math.floor(x * this.ssaoScale);
            const sy = Math.floor(y * this.ssaoScale);
            const sw = Math.ceil(width * this.ssaoScale);
            const sh = Math.ceil(height * this.ssaoScale);
            state.viewport(sx, sy, sw, sh);
            state.scissor(sx, sy, sw, sh);
            if (this.ssaoScale < 1) {
                if (debug_1.isTimingMode)
                    this.webgl.timer.mark('SSAO.downsample');
                this.downsampledDepthTarget.bind();
                this.downsampleDepthRenderable.render();
                if (debug_1.isTimingMode)
                    this.webgl.timer.markEnd('SSAO.downsample');
            }
            if (debug_1.isTimingMode)
                this.webgl.timer.mark('SSAO.half');
            this.depthHalfTarget.bind();
            this.depthHalfRenderable.render();
            if (debug_1.isTimingMode)
                this.webgl.timer.markEnd('SSAO.half');
            if (debug_1.isTimingMode)
                this.webgl.timer.mark('SSAO.quarter');
            this.depthQuarterTarget.bind();
            this.depthQuarterRenderable.render();
            if (debug_1.isTimingMode)
                this.webgl.timer.markEnd('SSAO.quarter');
            this.ssaoFramebuffer.bind();
            this.ssaoRenderable.render();
            this.ssaoBlurFirstPassFramebuffer.bind();
            this.ssaoBlurFirstPassRenderable.render();
            this.ssaoBlurSecondPassFramebuffer.bind();
            this.ssaoBlurSecondPassRenderable.render();
            if (debug_1.isTimingMode)
                this.webgl.timer.markEnd('SSAO.render');
        }
        state.viewport(x, y, width, height);
        state.scissor(x, y, width, height);
        if (props.outline.name === 'on') {
            this.outlinesTarget.bind();
            this.outlinesRenderable.render();
        }
        if (props.shadow.name === 'on') {
            this.shadowsTarget.bind();
            this.shadowsRenderable.render();
        }
        if (toDrawingBuffer) {
            this.webgl.unbindFramebuffer();
        }
        else {
            this.target.bind();
        }
        this.background.update(camera, props.background);
        if (this.background.isEnabled(props.background)) {
            if (this.transparentBackground) {
                state.clearColor(0, 0, 0, 0);
            }
            else {
                color_1.Color.toVec3Normalized(this.bgColor, backgroundColor);
                state.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], 1);
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
            state.enable(gl.BLEND);
            state.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            this.background.render();
        }
        else {
            state.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        this.renderable.render();
        if (debug_1.isTimingMode)
            this.webgl.timer.markEnd('PostprocessingPass.render');
    }
}
exports.PostprocessingPass = PostprocessingPass;
class AntialiasingPass {
    static isEnabled(props) {
        return props.antialiasing.name !== 'off';
    }
    constructor(webgl, drawPass) {
        this.drawPass = drawPass;
        const { colorTarget } = drawPass;
        const width = colorTarget.getWidth();
        const height = colorTarget.getHeight();
        this.target = webgl.createRenderTarget(width, height, false);
        this.internalTarget = webgl.createRenderTarget(width, height, false);
        this.fxaa = new fxaa_1.FxaaPass(webgl, this.target.texture);
        this.smaa = new smaa_1.SmaaPass(webgl, this.target.texture);
        this.cas = new cas_1.CasPass(webgl, this.target.texture);
    }
    setSize(width, height) {
        const w = this.target.texture.getWidth();
        const h = this.target.texture.getHeight();
        if (width !== w || height !== h) {
            this.target.setSize(width, height);
            this.internalTarget.setSize(width, height);
            this.fxaa.setSize(width, height);
            if (this.smaa.supported)
                this.smaa.setSize(width, height);
            this.cas.setSize(width, height);
        }
    }
    _renderFxaa(camera, target, props) {
        if (props.antialiasing.name !== 'fxaa')
            return;
        const input = PostprocessingPass.isEnabled(props)
            ? this.drawPass.postprocessing.target.texture
            : this.drawPass.colorTarget.texture;
        this.fxaa.update(input, props.antialiasing.params);
        this.fxaa.render(camera.viewport, target);
    }
    _renderSmaa(camera, target, props) {
        if (props.antialiasing.name !== 'smaa')
            return;
        const input = PostprocessingPass.isEnabled(props)
            ? this.drawPass.postprocessing.target.texture
            : this.drawPass.colorTarget.texture;
        this.smaa.update(input, props.antialiasing.params);
        this.smaa.render(camera.viewport, target);
    }
    _renderAntialiasing(camera, target, props) {
        if (props.antialiasing.name === 'fxaa') {
            this._renderFxaa(camera, target, props);
        }
        else if (props.antialiasing.name === 'smaa') {
            this._renderSmaa(camera, target, props);
        }
    }
    _renderCas(camera, target, props) {
        if (props.sharpening.name !== 'on')
            return;
        const input = props.antialiasing.name !== 'off'
            ? this.internalTarget.texture
            : PostprocessingPass.isEnabled(props)
                ? this.drawPass.postprocessing.target.texture
                : this.drawPass.colorTarget.texture;
        this.cas.update(input, props.sharpening.params);
        this.cas.render(camera.viewport, target);
    }
    render(camera, toDrawingBuffer, props) {
        if (props.antialiasing.name === 'off' && props.sharpening.name === 'off')
            return;
        if (props.antialiasing.name === 'smaa' && !this.smaa.supported) {
            console.error('SMAA not supported, missing "HTMLImageElement"');
            return;
        }
        const target = toDrawingBuffer ? undefined : this.target;
        if (props.sharpening.name === 'off') {
            this._renderAntialiasing(camera, target, props);
        }
        else if (props.antialiasing.name === 'off') {
            this._renderCas(camera, target, props);
        }
        else {
            this._renderAntialiasing(camera, this.internalTarget, props);
            this._renderCas(camera, target, props);
        }
    }
}
exports.AntialiasingPass = AntialiasingPass;
