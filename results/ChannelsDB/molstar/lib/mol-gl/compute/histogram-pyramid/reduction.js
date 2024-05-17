/**
 * Copyright (c) 2019-2022 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { createComputeRenderable } from '../../renderable';
import { createComputeRenderItem } from '../../webgl/render-item';
import { TextureSpec, UniformSpec } from '../../renderable/schema';
import { ShaderCode } from '../../../mol-gl/shader-code';
import { ValueCell } from '../../../mol-util';
import { QuadSchema, QuadValues } from '../util';
import { getHistopyramidSum } from './sum';
import { isPowerOfTwo } from '../../../mol-math/misc';
import { quad_vert } from '../../../mol-gl/shader/quad.vert';
import { reduction_frag } from '../../../mol-gl/shader/histogram-pyramid/reduction.frag';
import { isWebGL2 } from '../../webgl/compat';
import { isTimingMode } from '../../../mol-util/debug';
const HistopyramidReductionSchema = {
    ...QuadSchema,
    tInputLevel: TextureSpec('texture', 'rgba', 'float', 'nearest'),
    tPreviousLevel: TextureSpec('texture', 'rgba', 'float', 'nearest'),
    uSize: UniformSpec('f'),
    uTexSize: UniformSpec('f'),
    uFirst: UniformSpec('b'),
};
const HistogramPyramidName = 'histogram-pyramid';
function getHistopyramidReductionRenderable(ctx, inputLevel, previousLevel) {
    if (ctx.namedComputeRenderables[HistogramPyramidName]) {
        const v = ctx.namedComputeRenderables[HistogramPyramidName].values;
        ValueCell.update(v.tInputLevel, inputLevel);
        ValueCell.update(v.tPreviousLevel, previousLevel);
        ctx.namedComputeRenderables[HistogramPyramidName].update();
    }
    else {
        ctx.namedComputeRenderables[HistogramPyramidName] = createHistopyramidReductionRenderable(ctx, inputLevel, previousLevel);
    }
    return ctx.namedComputeRenderables[HistogramPyramidName];
}
function createHistopyramidReductionRenderable(ctx, inputLevel, previousLevel) {
    const values = {
        ...QuadValues,
        tInputLevel: ValueCell.create(inputLevel),
        tPreviousLevel: ValueCell.create(previousLevel),
        uSize: ValueCell.create(0),
        uTexSize: ValueCell.create(0),
        uFirst: ValueCell.create(true),
    };
    const schema = { ...HistopyramidReductionSchema };
    const shaderCode = ShaderCode('reduction', quad_vert, reduction_frag, {}, { 0: 'ivec4' });
    const renderItem = createComputeRenderItem(ctx, 'triangles', shaderCode, schema, values);
    return createComputeRenderable(renderItem, values);
}
function getLevelTextureFramebuffer(ctx, level) {
    const size = Math.pow(2, level);
    const name = `level${level}`;
    const texture = ctx.isWebGL2
        ? getTexture(name, ctx, 'image-int32', 'alpha', 'int', 'nearest')
        : getTexture(name, ctx, 'image-uint8', 'rgba', 'ubyte', 'nearest');
    texture.define(size, size);
    let framebuffer = tryGetFramebuffer(name, ctx);
    if (!framebuffer) {
        framebuffer = getFramebuffer(name, ctx);
        texture.attachFramebuffer(framebuffer, 0);
    }
    return { texture, framebuffer };
}
function setRenderingDefaults(ctx) {
    const { gl, state } = ctx;
    state.disable(gl.CULL_FACE);
    state.disable(gl.BLEND);
    state.disable(gl.DEPTH_TEST);
    state.enable(gl.SCISSOR_TEST);
    state.depthMask(false);
    state.colorMask(true, true, true, true);
    state.clearColor(0, 0, 0, 0);
}
function getFramebuffer(name, webgl) {
    const _name = `${HistogramPyramidName}-${name}`;
    if (!webgl.namedFramebuffers[_name]) {
        webgl.namedFramebuffers[_name] = webgl.resources.framebuffer();
    }
    return webgl.namedFramebuffers[_name];
}
function getTexture(name, webgl, kind, format, type, filter) {
    const _name = `${HistogramPyramidName}-${name}`;
    if (!webgl.namedTextures[_name]) {
        webgl.namedTextures[_name] = webgl.resources.texture(kind, format, type, filter);
    }
    return webgl.namedTextures[_name];
}
function tryGetFramebuffer(name, webgl) {
    const _name = `${HistogramPyramidName}-${name}`;
    return webgl.namedFramebuffers[_name];
}
export function createHistogramPyramid(ctx, inputTexture, scale, gridTexDim) {
    if (isTimingMode)
        ctx.timer.mark('createHistogramPyramid');
    const { gl, state } = ctx;
    const w = inputTexture.getWidth();
    const h = inputTexture.getHeight();
    // printTexture(ctx, inputTexture, 2)
    if (w !== h || !isPowerOfTwo(w)) {
        throw new Error('inputTexture must be of square power-of-two size');
    }
    // This part set the levels
    const levels = Math.ceil(Math.log(w) / Math.log(2));
    const maxSize = Math.pow(2, levels);
    const maxSizeX = Math.pow(2, levels);
    const maxSizeY = Math.pow(2, levels - 1);
    // console.log('levels', levels, 'maxSize', maxSize, [maxSizeX, maxSizeY], 'input', w);
    const pyramidTex = ctx.isWebGL2
        ? getTexture('pyramid', ctx, 'image-int32', 'alpha', 'int', 'nearest')
        : getTexture('pyramid', ctx, 'image-uint8', 'rgba', 'ubyte', 'nearest');
    pyramidTex.define(maxSizeX, maxSizeY);
    const framebuffer = getFramebuffer('pyramid', ctx);
    pyramidTex.attachFramebuffer(framebuffer, 0);
    state.viewport(0, 0, maxSizeX, maxSizeY);
    if (isWebGL2(gl)) {
        gl.clearBufferiv(gl.COLOR, 0, [0, 0, 0, 0]);
    }
    else {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    const levelTexturesFramebuffers = [];
    for (let i = 0; i < levels; ++i)
        levelTexturesFramebuffers.push(getLevelTextureFramebuffer(ctx, i));
    const renderable = getHistopyramidReductionRenderable(ctx, inputTexture, levelTexturesFramebuffers[0].texture);
    state.currentRenderItemId = -1;
    setRenderingDefaults(ctx);
    let offset = 0;
    for (let i = 0; i < levels; i++) {
        const currLevel = levels - 1 - i;
        const tf = levelTexturesFramebuffers[currLevel];
        tf.framebuffer.bind();
        const size = Math.pow(2, currLevel);
        // console.log('size', size, 'draw-level', currLevel, 'read-level', levels - i);
        ValueCell.update(renderable.values.uSize, Math.pow(2, i + 1) / maxSize);
        ValueCell.update(renderable.values.uTexSize, size);
        ValueCell.updateIfChanged(renderable.values.uFirst, i === 0);
        if (i > 0) {
            ValueCell.update(renderable.values.tPreviousLevel, levelTexturesFramebuffers[levels - i].texture);
            renderable.update();
        }
        state.currentRenderItemId = -1;
        state.viewport(0, 0, size, size);
        state.scissor(0, 0, size, size);
        if (isWebGL2(gl)) {
            gl.clearBufferiv(gl.COLOR, 0, [0, 0, 0, 0]);
        }
        else {
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        state.scissor(0, 0, gridTexDim[0], gridTexDim[1]);
        renderable.render();
        pyramidTex.bind(0);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, offset, 0, 0, 0, size, size);
        pyramidTex.unbind(0);
        offset += size;
    }
    gl.finish();
    if (isTimingMode)
        ctx.timer.markEnd('createHistogramPyramid');
    // printTextureImage(readTexture(ctx, pyramidTex), { scale: 0.75 });
    //
    // return at least a count of one to avoid issues downstram
    const count = Math.max(1, getHistopyramidSum(ctx, levelTexturesFramebuffers[0].texture));
    const height = Math.ceil(count / Math.pow(2, levels));
    // console.log({ height, count, scale });
    return { pyramidTex, count, height, levels, scale };
}
