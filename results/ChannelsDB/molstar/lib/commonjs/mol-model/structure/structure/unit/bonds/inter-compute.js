"use strict";
/**
 * Copyright (c) 2017-2023 Mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeInterUnitBonds = void 0;
const structure_1 = require("../../structure");
const unit_1 = require("../../unit");
const common_1 = require("./common");
const data_1 = require("./data");
const int_1 = require("../../../../../mol-data/int");
const linear_algebra_1 = require("../../../../../mol-math/linear-algebra");
const bonds_1 = require("../../../model/properties/atomic/bonds");
const index_pair_1 = require("../../../../../mol-model-formats/structure/property/bonds/index-pair");
const inter_unit_graph_1 = require("../../../../../mol-math/graph/inter-unit-graph");
const struct_conn_1 = require("../../../../../mol-model-formats/structure/property/bonds/struct_conn");
const common_2 = require("../../../../../mol-math/linear-algebra/3d/common");
const model_1 = require("../../../model");
// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const v3distance = linear_algebra_1.Vec3.distance;
const v3set = linear_algebra_1.Vec3.set;
const v3squaredDistance = linear_algebra_1.Vec3.squaredDistance;
const v3transformMat4 = linear_algebra_1.Vec3.transformMat4;
const tmpDistVecA = (0, linear_algebra_1.Vec3)();
const tmpDistVecB = (0, linear_algebra_1.Vec3)();
function getDistance(unitA, indexA, unitB, indexB) {
    unitA.conformation.position(indexA, tmpDistVecA);
    unitB.conformation.position(indexB, tmpDistVecB);
    return v3distance(tmpDistVecA, tmpDistVecB);
}
const _imageTransform = (0, linear_algebra_1.Mat4)();
const _imageA = (0, linear_algebra_1.Vec3)();
function findPairBonds(unitA, unitB, props, builder) {
    const { maxRadius } = props;
    const { elements: atomsA, residueIndex: residueIndexA } = unitA;
    const { x: xA, y: yA, z: zA } = unitA.model.atomicConformation;
    const { elements: atomsB, residueIndex: residueIndexB } = unitB;
    const atomCount = unitA.elements.length;
    const { type_symbol: type_symbolA, label_alt_id: label_alt_idA, label_atom_id: label_atom_idA, label_comp_id: label_comp_idA } = unitA.model.atomicHierarchy.atoms;
    const { type_symbol: type_symbolB, label_alt_id: label_alt_idB, label_atom_id: label_atom_idB, label_comp_id: label_comp_idB } = unitB.model.atomicHierarchy.atoms;
    const { auth_seq_id: auth_seq_idA } = unitA.model.atomicHierarchy.residues;
    const { auth_seq_id: auth_seq_idB } = unitB.model.atomicHierarchy.residues;
    const { occupancy: occupancyA } = unitA.model.atomicConformation;
    const { occupancy: occupancyB } = unitB.model.atomicConformation;
    const hasOccupancy = occupancyA.isDefined && occupancyB.isDefined;
    const structConn = unitA.model === unitB.model && struct_conn_1.StructConn.Provider.get(unitA.model);
    const indexPairs = !props.forceCompute && unitA.model === unitB.model && index_pair_1.IndexPairBonds.Provider.get(unitA.model);
    const { atomSourceIndex: sourceIndex } = unitA.model.atomicHierarchy;
    const { invertedIndex } = indexPairs ? model_1.Model.getInvertedAtomSourceIndex(unitB.model) : { invertedIndex: void 0 };
    const structConnExhaustive = unitA.model === unitB.model && struct_conn_1.StructConn.isExhaustive(unitA.model);
    // the lookup queries need to happen in the "unitB space".
    // that means _imageA = inverseOperB(operA(aI))
    const imageTransform = linear_algebra_1.Mat4.mul(_imageTransform, unitB.conformation.operator.inverse, unitA.conformation.operator.matrix);
    const isNotIdentity = !linear_algebra_1.Mat4.isIdentity(imageTransform);
    const { center: bCenter, radius: bRadius } = unitB.boundary.sphere;
    const testDistanceSq = (bRadius + maxRadius) * (bRadius + maxRadius);
    builder.startUnitPair(unitA.id, unitB.id);
    const opKeyA = unitA.conformation.operator.key;
    const opKeyB = unitB.conformation.operator.key;
    for (let _aI = 0; _aI < atomCount; _aI++) {
        const aI = atomsA[_aI];
        v3set(_imageA, xA[aI], yA[aI], zA[aI]);
        if (isNotIdentity)
            v3transformMat4(_imageA, _imageA, imageTransform);
        if (v3squaredDistance(_imageA, bCenter) > testDistanceSq)
            continue;
        if (!props.forceCompute && indexPairs) {
            const { maxDistance } = indexPairs;
            const { offset, b, edgeProps: { order, distance, flag, key, operatorA, operatorB } } = indexPairs.bonds;
            const srcA = sourceIndex.value(aI);
            const aeI = (0, common_1.getElementIdx)(type_symbolA.value(aI));
            for (let i = offset[srcA], il = offset[srcA + 1]; i < il; ++i) {
                const bI = invertedIndex[b[i]];
                const _bI = int_1.SortedArray.indexOf(unitB.elements, bI);
                if (_bI < 0)
                    continue;
                const opA = operatorA[i];
                const opB = operatorB[i];
                if ((opA >= 0 && opA !== opKeyA && opA !== opKeyB) ||
                    (opB >= 0 && opB !== opKeyB && opB !== opKeyA))
                    continue;
                const beI = (0, common_1.getElementIdx)(type_symbolA.value(bI));
                const d = distance[i];
                const dist = getDistance(unitA, aI, unitB, bI);
                let add = false;
                if (d >= 0) {
                    add = (0, common_2.equalEps)(dist, d, 0.3);
                }
                else if (maxDistance >= 0) {
                    add = dist < maxDistance;
                }
                else {
                    const pairingThreshold = (0, common_1.getPairingThreshold)(aeI, beI, (0, common_1.getElementThreshold)(aeI), (0, common_1.getElementThreshold)(beI));
                    add = dist < pairingThreshold;
                    if ((0, common_1.isHydrogen)(aeI) && (0, common_1.isHydrogen)(beI)) {
                        // TODO handle molecular hydrogen
                        add = false;
                    }
                }
                if (add) {
                    builder.add(_aI, _bI, { order: order[i], flag: flag[i], key: key[i] });
                }
            }
            continue; // assume `indexPairs` supplies all bonds
        }
        const structConnEntries = props.forceCompute ? void 0 : structConn && structConn.byAtomIndex.get(aI);
        if (structConnEntries && structConnEntries.length) {
            let added = false;
            for (const se of structConnEntries) {
                const { partnerA, partnerB } = se;
                const p = partnerA.atomIndex === aI ? partnerB : partnerA;
                const _bI = int_1.SortedArray.indexOf(unitB.elements, p.atomIndex);
                if (_bI < 0)
                    continue;
                // check if the bond is within MAX_RADIUS for this pair of units
                if (getDistance(unitA, aI, unitB, p.atomIndex) > maxRadius)
                    continue;
                builder.add(_aI, _bI, { order: se.order, flag: se.flags, key: se.rowIndex });
                added = true;
            }
            // assume, for an atom, that if any inter unit bond is given
            // all are given and thus we don't need to compute any other
            if (added)
                continue;
        }
        if (structConnExhaustive)
            continue;
        const occA = occupancyA.value(aI);
        const { lookup3d } = unitB;
        const { indices, count, squaredDistances } = lookup3d.find(_imageA[0], _imageA[1], _imageA[2], maxRadius);
        if (count === 0)
            continue;
        const aeI = (0, common_1.getElementIdx)(type_symbolA.value(aI));
        const isHa = (0, common_1.isHydrogen)(aeI);
        const thresholdA = (0, common_1.getElementThreshold)(aeI);
        const altA = label_alt_idA.value(aI);
        const metalA = common_1.MetalsSet.has(aeI);
        const atomIdA = label_atom_idA.value(aI);
        const compIdA = label_comp_idA.value(residueIndexA[aI]);
        for (let ni = 0; ni < count; ni++) {
            const _bI = indices[ni];
            const bI = atomsB[_bI];
            const altB = label_alt_idB.value(bI);
            if (altA && altB && altA !== altB)
                continue;
            // Do not include bonds between images of the same residue with partial occupancy.
            // TODO: is this condition good enough?
            // - It works for cases like 3WQJ (label_asym_id: I) which have partial occupancy.
            // - Does NOT work for cases like 1RB8 (DC 7) with full occupancy.
            if (hasOccupancy && occupancyB.value(bI) < 1 && occA < 1) {
                if (auth_seq_idA.value(aI) === auth_seq_idB.value(bI)) {
                    continue;
                }
            }
            const beI = (0, common_1.getElementIdx)(type_symbolB.value(bI));
            const isHb = (0, common_1.isHydrogen)(beI);
            if (isHa && isHb)
                continue;
            const isMetal = (metalA || common_1.MetalsSet.has(beI)) && !(isHa || isHb);
            const dist = Math.sqrt(squaredDistances[ni]);
            if (dist === 0)
                continue;
            const pairingThreshold = (0, common_1.getPairingThreshold)(aeI, beI, thresholdA, (0, common_1.getElementThreshold)(beI));
            if (dist <= pairingThreshold) {
                const atomIdB = label_atom_idB.value(bI);
                const compIdB = label_comp_idB.value(residueIndexB[bI]);
                builder.add(_aI, _bI, {
                    order: (0, bonds_1.getInterBondOrderFromTable)(compIdA, compIdB, atomIdA, atomIdB),
                    flag: (isMetal ? 2 /* BondType.Flag.MetallicCoordination */ : 1 /* BondType.Flag.Covalent */) | 32 /* BondType.Flag.Computed */,
                    key: -1
                });
            }
        }
    }
    builder.finishUnitPair();
}
const DefaultInterBondComputationProps = {
    ...common_1.DefaultBondComputationProps,
    ignoreWater: true,
    ignoreIon: true,
};
function findBonds(structure, props) {
    const builder = new inter_unit_graph_1.InterUnitGraph.Builder();
    const hasIndexPairBonds = structure.models.some(m => index_pair_1.IndexPairBonds.Provider.get(m));
    const hasExhaustiveStructConn = structure.models.some(m => struct_conn_1.StructConn.isExhaustive(m));
    if (props.noCompute || (structure.isCoarseGrained && !hasIndexPairBonds && !hasExhaustiveStructConn)) {
        return new data_1.InterUnitBonds(builder.getMap());
    }
    structure_1.Structure.eachUnitPair(structure, (unitA, unitB) => {
        findPairBonds(unitA, unitB, props, builder);
    }, {
        maxRadius: props.maxRadius,
        validUnit: (unit) => props.validUnit(unit),
        validUnitPair: (unitA, unitB) => props.validUnitPair(structure, unitA, unitB)
    });
    return new data_1.InterUnitBonds(builder.getMap());
}
function computeInterUnitBonds(structure, props) {
    const p = { ...DefaultInterBondComputationProps, ...props };
    return findBonds(structure, {
        ...p,
        validUnit: (props && props.validUnit) || (u => unit_1.Unit.isAtomic(u)),
        validUnitPair: (props && props.validUnitPair) || ((s, a, b) => {
            const isValidPair = structure_1.Structure.validUnitPair(s, a, b);
            if (!isValidPair)
                return false;
            const mtA = a.model.atomicHierarchy.derived.residue.moleculeType;
            const mtB = b.model.atomicHierarchy.derived.residue.moleculeType;
            const notWater = ((!unit_1.Unit.isAtomic(a) || mtA[a.residueIndex[a.elements[0]]] !== 2 /* MoleculeType.Water */) &&
                (!unit_1.Unit.isAtomic(b) || mtB[b.residueIndex[b.elements[0]]] !== 2 /* MoleculeType.Water */));
            const notIonA = (!unit_1.Unit.isAtomic(a) || mtA[a.residueIndex[a.elements[0]]] !== 3 /* MoleculeType.Ion */);
            const notIonB = (!unit_1.Unit.isAtomic(b) || mtB[b.residueIndex[b.elements[0]]] !== 3 /* MoleculeType.Ion */);
            const notIon = notIonA && notIonB;
            const check = (notWater || !p.ignoreWater) && (notIon || !p.ignoreIon);
            if (!check) {
                // In case both units have a struct conn record, ignore other criteria
                return hasCommonStructConnRecord(a, b);
            }
            return true;
        }),
    });
}
exports.computeInterUnitBonds = computeInterUnitBonds;
function hasCommonStructConnRecord(unitA, unitB) {
    if (unitA.model !== unitB.model || !unit_1.Unit.isAtomic(unitA) || !unit_1.Unit.isAtomic(unitB))
        return false;
    const structConn = struct_conn_1.StructConn.Provider.get(unitA.model);
    if (!structConn)
        return false;
    const smaller = unitA.elements.length < unitB.elements.length ? unitA : unitB;
    const bigger = unitA.elements.length >= unitB.elements.length ? unitA : unitB;
    const { elements: xs } = smaller;
    const { elements: ys } = bigger;
    const { indexOf } = int_1.SortedArray;
    for (let i = 0, _i = xs.length; i < _i; i++) {
        const aI = xs[i];
        const entries = structConn.byAtomIndex.get(aI);
        if (!(entries === null || entries === void 0 ? void 0 : entries.length))
            continue;
        for (const e of entries) {
            const bI = e.partnerA.atomIndex === aI ? e.partnerB.atomIndex : e.partnerA.atomIndex;
            if (indexOf(ys, bI) >= 0)
                return true;
        }
    }
    return false;
}
