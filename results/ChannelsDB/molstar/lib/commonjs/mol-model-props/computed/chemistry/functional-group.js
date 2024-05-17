"use strict";
/**
 * Copyright (c) 2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAromaticNeighbour = exports.hasPolarNeighbour = exports.isPolar = exports.isAcetamidine = exports.isGuanidine = exports.isCarboxylate = exports.isCarbonyl = exports.isHalocarbon = exports.isPhosphate = exports.isSulfate = exports.isSulfonicAcid = exports.isSulfonium = exports.isAmide = exports.isImide = exports.isTertiaryAmine = exports.isQuaternaryAmine = void 0;
const types_1 = require("../../../mol-model/structure/model/properties/atomic/types");
const types_2 = require("../../../mol-model/structure/model/types");
const util_1 = require("./util");
function isAromatic(unit, index) {
    // TODO also extend unit.rings with geometry/composition-based aromaticity detection and use it here in addition
    const { offset, edgeProps } = unit.bonds;
    for (let i = offset[index], il = offset[index + 1]; i < il; ++i) {
        if (types_2.BondType.is(16 /* BondType.Flag.Aromatic */, edgeProps.flags[i]))
            return true;
    }
    return false;
}
function bondToCarbonylCount(structure, unit, index) {
    let carbonylCount = 0;
    (0, util_1.eachBondedAtom)(structure, unit, index, (unit, index) => {
        if (isCarbonyl(structure, unit, index))
            carbonylCount += 1;
    });
    return carbonylCount;
}
//
/**
 * Nitrogen in a quaternary amine
 */
function isQuaternaryAmine(structure, unit, index) {
    return ((0, util_1.typeSymbol)(unit, index) === "N" /* Elements.N */ &&
        (0, util_1.bondCount)(structure, unit, index) === 4 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */) === 0);
}
exports.isQuaternaryAmine = isQuaternaryAmine;
/**
 * Nitrogen in a tertiary amine
 */
function isTertiaryAmine(structure, unit, index, idealValence) {
    return ((0, util_1.typeSymbol)(unit, index) === "N" /* Elements.N */ &&
        (0, util_1.bondCount)(structure, unit, index) === 4 &&
        idealValence === 3);
}
exports.isTertiaryAmine = isTertiaryAmine;
/**
 * Nitrogen in an imide
 */
function isImide(structure, unit, index) {
    let flag = false;
    if ((0, util_1.typeSymbol)(unit, index) === "N" /* Elements.N */ &&
        ((0, util_1.bondCount)(structure, unit, index) - (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */)) === 2) {
        flag = bondToCarbonylCount(structure, unit, index) === 2;
    }
    return flag;
}
exports.isImide = isImide;
/**
 * Nitrogen in an amide
 */
function isAmide(structure, unit, index) {
    let flag = false;
    if ((0, util_1.typeSymbol)(unit, index) === "N" /* Elements.N */ &&
        ((0, util_1.bondCount)(structure, unit, index) - (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */)) === 2) {
        flag = bondToCarbonylCount(structure, unit, index) === 1;
    }
    return flag;
}
exports.isAmide = isAmide;
/**
 * Sulfur in a sulfonium group
 */
function isSulfonium(structure, unit, index) {
    return ((0, util_1.typeSymbol)(unit, index) === "S" /* Elements.S */ &&
        (0, util_1.bondCount)(structure, unit, index) === 3 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */) === 0);
}
exports.isSulfonium = isSulfonium;
/**
 * Sulfur in a sulfonic acid or sulfonate group
 */
function isSulfonicAcid(structure, unit, index) {
    return ((0, util_1.typeSymbol)(unit, index) === "S" /* Elements.S */ &&
        (0, util_1.bondToElementCount)(structure, unit, index, "O" /* Elements.O */) === 3);
}
exports.isSulfonicAcid = isSulfonicAcid;
/**
 * Sulfur in a sulfate group
 */
function isSulfate(structure, unit, index) {
    return ((0, util_1.typeSymbol)(unit, index) === "S" /* Elements.S */ &&
        (0, util_1.bondToElementCount)(structure, unit, index, "O" /* Elements.O */) === 4);
}
exports.isSulfate = isSulfate;
/**
 * Phosphor in a phosphate group
 */
function isPhosphate(structure, unit, index) {
    return ((0, util_1.typeSymbol)(unit, index) === "P" /* Elements.P */ &&
        (0, util_1.bondToElementCount)(structure, unit, index, "O" /* Elements.O */) === (0, util_1.bondCount)(structure, unit, index));
}
exports.isPhosphate = isPhosphate;
/**
 * Halogen with one bond to a carbon
 */
function isHalocarbon(structure, unit, index) {
    return ((0, types_1.isHalogen)((0, util_1.typeSymbol)(unit, index)) &&
        (0, util_1.bondCount)(structure, unit, index) === 1 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "C" /* Elements.C */) === 1);
}
exports.isHalocarbon = isHalocarbon;
/**
 * Carbon in a carbonyl/acyl group
 *
 * TODO currently only checks intra bonds for group detection
 */
function isCarbonyl(structure, unit, index) {
    let flag = false;
    if ((0, util_1.typeSymbol)(unit, index) === "C" /* Elements.C */) {
        const { offset, edgeProps, b } = unit.bonds;
        for (let i = offset[index], il = offset[index + 1]; i < il; ++i) {
            if (edgeProps.order[i] === 2 && (0, util_1.typeSymbol)(unit, b[i]) === "O" /* Elements.O */) {
                flag = true;
                break;
            }
        }
    }
    return flag;
}
exports.isCarbonyl = isCarbonyl;
/**
 * Carbon in a carboxylate group
 */
function isCarboxylate(structure, unit, index) {
    let terminalOxygenCount = 0;
    if ((0, util_1.typeSymbol)(unit, index) === "C" /* Elements.C */ &&
        (0, util_1.bondToElementCount)(structure, unit, index, "O" /* Elements.O */) === 2 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "C" /* Elements.C */) === 1) {
        (0, util_1.eachBondedAtom)(structure, unit, index, (unit, index) => {
            if ((0, util_1.typeSymbol)(unit, index) === "O" /* Elements.O */ &&
                (0, util_1.bondCount)(structure, unit, index) - (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */) === 1) {
                terminalOxygenCount += 1;
            }
        });
    }
    return terminalOxygenCount === 2;
}
exports.isCarboxylate = isCarboxylate;
/**
 * Carbon in a guanidine group
 */
function isGuanidine(structure, unit, index) {
    let terminalNitrogenCount = 0;
    if ((0, util_1.typeSymbol)(unit, index) === "C" /* Elements.C */ &&
        (0, util_1.bondCount)(structure, unit, index) === 3 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "N" /* Elements.N */) === 3) {
        (0, util_1.eachBondedAtom)(structure, unit, index, (unit, index) => {
            if ((0, util_1.bondCount)(structure, unit, index) - (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */) === 1) {
                terminalNitrogenCount += 1;
            }
        });
    }
    return terminalNitrogenCount === 2;
}
exports.isGuanidine = isGuanidine;
/**
 * Carbon in a acetamidine group
 */
function isAcetamidine(structure, unit, index) {
    let terminalNitrogenCount = 0;
    if ((0, util_1.typeSymbol)(unit, index) === "C" /* Elements.C */ &&
        (0, util_1.bondCount)(structure, unit, index) === 3 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "N" /* Elements.N */) === 2 &&
        (0, util_1.bondToElementCount)(structure, unit, index, "C" /* Elements.C */) === 1) {
        (0, util_1.eachBondedAtom)(structure, unit, index, (unit, index) => {
            if ((0, util_1.bondCount)(structure, unit, index) - (0, util_1.bondToElementCount)(structure, unit, index, "H" /* Elements.H */) === 1) {
                terminalNitrogenCount += 1;
            }
        });
    }
    return terminalNitrogenCount === 2;
}
exports.isAcetamidine = isAcetamidine;
const PolarElements = new Set(['N', 'O', 'S', 'F', 'CL', 'BR', 'I']);
function isPolar(element) { return PolarElements.has(element); }
exports.isPolar = isPolar;
function hasPolarNeighbour(structure, unit, index) {
    let flag = false;
    (0, util_1.eachBondedAtom)(structure, unit, index, (unit, index) => {
        if (isPolar((0, util_1.typeSymbol)(unit, index)))
            flag = true;
    });
    return flag;
}
exports.hasPolarNeighbour = hasPolarNeighbour;
function hasAromaticNeighbour(structure, unit, index) {
    let flag = false;
    (0, util_1.eachBondedAtom)(structure, unit, index, (unit, index) => {
        if (isAromatic(unit, index))
            flag = true;
    });
    return flag;
}
exports.hasAromaticNeighbour = hasAromaticNeighbour;
