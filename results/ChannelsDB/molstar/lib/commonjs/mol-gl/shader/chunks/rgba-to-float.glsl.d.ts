/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
export declare const rgba_to_float = "\n    // rgbaToFloat adapted from https://github.com/ihmeuw/glsl-rgba-to-float\n    // BSD 3-Clause License\n    //\n    // Copyright (c) 2019, Institute for Health Metrics and Evaluation All rights reserved.\n    // Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n    //  - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n    //  - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\n    //  - Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.\n    //\n    // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES,\n    // INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.\n    // IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,\n    // OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n    // OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\n    // OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED\n    // OF THE POSSIBILITY OF SUCH DAMAGE.\n\n    ivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n        ivec4 bytes = ivec4(inputFloats * 255.0);\n        return (\n            littleEndian\n                ? bytes.abgr\n                : bytes\n        );\n    }\n\n    // Break the four bytes down into an array of 32 bits.\n    void bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n        for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n            float acc = float(bytes[channelIndex]);\n            for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n                float powerOfTwo = exp2(float(indexInByte));\n                bool bit = acc >= powerOfTwo;\n                bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n                acc = mod(acc, powerOfTwo);\n            }\n        }\n    }\n\n    // Compute the exponent of the 32-bit float.\n    float getExponent(bool bits[32]) {\n        const int startIndex = 1;\n        const int bitStringLength = 8;\n        const int endBeforeIndex = startIndex + bitStringLength;\n        float acc = 0.0;\n        int pow2 = bitStringLength - 1;\n        for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n            acc += float(bits[bitIndex]) * exp2(float(pow2--));\n        }\n        return acc;\n    }\n\n    // Compute the mantissa of the 32-bit float.\n    float getMantissa(bool bits[32], bool subnormal) {\n        const int startIndex = 9;\n        const int bitStringLength = 23;\n        const int endBeforeIndex = startIndex + bitStringLength;\n        // Leading/implicit/hidden bit convention:\n        // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n        float acc = float(!subnormal) * exp2(float(bitStringLength));\n        int pow2 = bitStringLength - 1;\n        for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n            acc += float(bits[bitIndex]) * exp2(float(pow2--));\n        }\n        return acc;\n    }\n\n    // Parse the float from its 32 bits.\n    float bitsToFloat(bool bits[32]) {\n        float signBit = float(bits[0]) * -2.0 + 1.0;\n        float exponent = getExponent(bits);\n        bool subnormal = abs(exponent - 0.0) < 0.01;\n        float mantissa = getMantissa(bits, subnormal);\n        float exponentBias = 127.0;\n        return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n    }\n\n    float rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n        ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n        bool bits[32];\n        bytesToBits(rgbaBytes, bits);\n        return bitsToFloat(bits);\n    }\n";
