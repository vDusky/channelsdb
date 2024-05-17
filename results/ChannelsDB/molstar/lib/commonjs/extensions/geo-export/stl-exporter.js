"use strict";
/**
 * Copyright (c) 2021-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Sukolsak Sakshuwong <sukolsak@stanford.edu>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StlExporter = void 0;
const ascii_1 = require("../../mol-io/common/ascii");
const linear_algebra_1 = require("../../mol-math/linear-algebra");
const version_1 = require("../../mol-plugin/version");
const mesh_exporter_1 = require("./mesh-exporter");
// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const v3fromArray = linear_algebra_1.Vec3.fromArray;
const v3transformMat4 = linear_algebra_1.Vec3.transformMat4;
const v3triangleNormal = linear_algebra_1.Vec3.triangleNormal;
const v3toArray = linear_algebra_1.Vec3.toArray;
class StlExporter extends mesh_exporter_1.MeshExporter {
    async addMeshWithColors(input) {
        const { values, isGeoTexture, mode, ctx } = input;
        if (mode !== 'triangles')
            return;
        const t = (0, linear_algebra_1.Mat4)();
        const tmpV = (0, linear_algebra_1.Vec3)();
        const v1 = (0, linear_algebra_1.Vec3)();
        const v2 = (0, linear_algebra_1.Vec3)();
        const v3 = (0, linear_algebra_1.Vec3)();
        const stride = isGeoTexture ? 4 : 3;
        const aTransform = values.aTransform.ref.value;
        const instanceCount = values.uInstanceCount.ref.value;
        for (let instanceIndex = 0; instanceIndex < instanceCount; ++instanceIndex) {
            if (ctx.shouldUpdate)
                await ctx.update({ current: instanceIndex + 1 });
            const { vertices, indices, vertexCount, drawCount } = StlExporter.getInstance(input, instanceIndex);
            linear_algebra_1.Mat4.fromArray(t, aTransform, instanceIndex * 16);
            linear_algebra_1.Mat4.mul(t, this.centerTransform, t);
            // position
            const vertexArray = new Float32Array(vertexCount * 3);
            for (let i = 0; i < vertexCount; ++i) {
                v3transformMat4(tmpV, v3fromArray(tmpV, vertices, i * stride), t);
                v3toArray(tmpV, vertexArray, i * 3);
            }
            // face
            const triangleBuffer = new ArrayBuffer(50 * drawCount);
            const dataView = new DataView(triangleBuffer);
            for (let i = 0; i < drawCount; i += 3) {
                v3fromArray(v1, vertexArray, (isGeoTexture ? i : indices[i]) * 3);
                v3fromArray(v2, vertexArray, (isGeoTexture ? i + 1 : indices[i + 1]) * 3);
                v3fromArray(v3, vertexArray, (isGeoTexture ? i + 2 : indices[i + 2]) * 3);
                v3triangleNormal(tmpV, v1, v2, v3);
                const byteOffset = 50 * i;
                dataView.setFloat32(byteOffset, tmpV[0], true);
                dataView.setFloat32(byteOffset + 4, tmpV[1], true);
                dataView.setFloat32(byteOffset + 8, tmpV[2], true);
                dataView.setFloat32(byteOffset + 12, v1[0], true);
                dataView.setFloat32(byteOffset + 16, v1[1], true);
                dataView.setFloat32(byteOffset + 20, v1[2], true);
                dataView.setFloat32(byteOffset + 24, v2[0], true);
                dataView.setFloat32(byteOffset + 28, v2[1], true);
                dataView.setFloat32(byteOffset + 32, v2[2], true);
                dataView.setFloat32(byteOffset + 36, v3[0], true);
                dataView.setFloat32(byteOffset + 40, v3[1], true);
                dataView.setFloat32(byteOffset + 44, v3[2], true);
            }
            this.triangleBuffers.push(triangleBuffer);
            this.triangleCount += drawCount;
        }
    }
    async getData() {
        const stl = new Uint8Array(84 + 50 * this.triangleCount);
        (0, ascii_1.asciiWrite)(stl, `Exported from Mol* ${version_1.PLUGIN_VERSION}`);
        const dataView = new DataView(stl.buffer);
        dataView.setUint32(80, this.triangleCount, true);
        let byteOffset = 84;
        for (const buffer of this.triangleBuffers) {
            stl.set(new Uint8Array(buffer), byteOffset);
            byteOffset += buffer.byteLength;
        }
        return { stl };
    }
    async getBlob(ctx) {
        return new Blob([(await this.getData()).stl], { type: 'model/stl' });
    }
    constructor(boundingBox) {
        super();
        this.fileExtension = 'stl';
        this.triangleBuffers = [];
        this.triangleCount = 0;
        const tmpV = (0, linear_algebra_1.Vec3)();
        linear_algebra_1.Vec3.add(tmpV, boundingBox.min, boundingBox.max);
        linear_algebra_1.Vec3.scale(tmpV, tmpV, -0.5);
        this.centerTransform = linear_algebra_1.Mat4.fromTranslation((0, linear_algebra_1.Mat4)(), tmpV);
    }
}
exports.StlExporter = StlExporter;
