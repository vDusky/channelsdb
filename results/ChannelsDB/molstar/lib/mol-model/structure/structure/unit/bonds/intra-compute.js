/**
 * Copyright (c) 2017-2022 Mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { IntraUnitBonds } from './data';
import { IntAdjacencyGraph } from '../../../../../mol-math/graph';
import { getElementIdx, MetalsSet, getElementThreshold, isHydrogen, DefaultBondComputationProps, getPairingThreshold } from './common';
import { SortedArray } from '../../../../../mol-data/int';
import { getIntraBondOrderFromTable } from '../../../model/properties/atomic/bonds';
import { IndexPairBonds } from '../../../../../mol-model-formats/structure/property/bonds/index-pair';
import { ComponentBond } from '../../../../../mol-model-formats/structure/property/bonds/chem_comp';
import { StructConn } from '../../../../../mol-model-formats/structure/property/bonds/struct_conn';
import { Vec3 } from '../../../../../mol-math/linear-algebra';
import { equalEps } from '../../../../../mol-math/linear-algebra/3d/common';
import { Model } from '../../../model/model';
// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const v3distance = Vec3.distance;
function getGraph(atomA, atomB, _order, _flags, _key, atomCount, canRemap) {
    const builder = new IntAdjacencyGraph.EdgeBuilder(atomCount, atomA, atomB);
    const flags = new Uint16Array(builder.slotCount);
    const order = new Int8Array(builder.slotCount);
    const key = new Uint32Array(builder.slotCount);
    for (let i = 0, _i = builder.edgeCount; i < _i; i++) {
        builder.addNextEdge();
        builder.assignProperty(flags, _flags[i]);
        builder.assignProperty(order, _order[i]);
        builder.assignProperty(key, _key[i]);
    }
    return builder.createGraph({ flags, order, key }, { canRemap });
}
const tmpDistVecA = Vec3();
const tmpDistVecB = Vec3();
function getDistance(unit, indexA, indexB) {
    unit.conformation.position(indexA, tmpDistVecA);
    unit.conformation.position(indexB, tmpDistVecB);
    return v3distance(tmpDistVecA, tmpDistVecB);
}
const __structConnAdded = new Set();
function findIndexPairBonds(unit) {
    const indexPairs = IndexPairBonds.Provider.get(unit.model);
    const { elements: atoms } = unit;
    const { type_symbol } = unit.model.atomicHierarchy.atoms;
    const atomCount = unit.elements.length;
    const { maxDistance } = indexPairs;
    const { offset, b, edgeProps: { order, distance, flag, key, operatorA, operatorB } } = indexPairs.bonds;
    const { atomSourceIndex: sourceIndex } = unit.model.atomicHierarchy;
    const { invertedIndex } = Model.getInvertedAtomSourceIndex(unit.model);
    const atomA = [];
    const atomB = [];
    const flags = [];
    const orders = [];
    const keys = [];
    const opKey = unit.conformation.operator.key;
    for (let _aI = 0; _aI < atomCount; _aI++) {
        const aI = atoms[_aI];
        const aeI = getElementIdx(type_symbol.value(aI));
        const isHa = isHydrogen(aeI);
        const srcA = sourceIndex.value(aI);
        for (let i = offset[srcA], il = offset[srcA + 1]; i < il; ++i) {
            const bI = invertedIndex[b[i]];
            if (aI >= bI)
                continue;
            const _bI = SortedArray.indexOf(unit.elements, bI);
            if (_bI < 0)
                continue;
            const opA = operatorA[i];
            const opB = operatorB[i];
            if ((opA >= 0 && opA !== opKey) || (opB >= 0 && opB !== opKey))
                continue;
            const beI = getElementIdx(type_symbol.value(bI));
            const d = distance[i];
            const dist = getDistance(unit, aI, bI);
            let add = false;
            if (d >= 0) {
                add = equalEps(dist, d, 0.3);
            }
            else if (maxDistance >= 0) {
                add = dist < maxDistance;
            }
            else {
                const pairingThreshold = getPairingThreshold(aeI, beI, getElementThreshold(aeI), getElementThreshold(beI));
                add = dist < pairingThreshold;
                if (isHa && isHydrogen(beI)) {
                    // TODO handle molecular hydrogen
                    add = false;
                }
            }
            if (add) {
                atomA[atomA.length] = _aI;
                atomB[atomB.length] = _bI;
                orders[orders.length] = order[i];
                flags[flags.length] = flag[i];
                keys[keys.length] = key[i];
            }
        }
    }
    return getGraph(atomA, atomB, orders, flags, keys, atomCount, false);
}
function findBonds(unit, props) {
    const { maxRadius } = props;
    const { x, y, z } = unit.model.atomicConformation;
    const atomCount = unit.elements.length;
    const { elements: atoms, residueIndex, chainIndex } = unit;
    const { type_symbol, label_atom_id, label_alt_id, label_comp_id } = unit.model.atomicHierarchy.atoms;
    const { label_seq_id } = unit.model.atomicHierarchy.residues;
    const { index } = unit.model.atomicHierarchy;
    const { byEntityKey } = unit.model.sequence;
    const query3d = unit.lookup3d;
    const structConn = StructConn.Provider.get(unit.model);
    const component = ComponentBond.Provider.get(unit.model);
    const structConnExhaustive = StructConn.isExhaustive(unit.model);
    const atomA = [];
    const atomB = [];
    const flags = [];
    const order = [];
    const key = [];
    let lastResidue = -1;
    let componentMap = void 0;
    let isWatery = true, isDictionaryBased = true, isSequenced = true;
    const structConnAdded = __structConnAdded;
    for (let _aI = 0; _aI < atomCount; _aI++) {
        const aI = atoms[_aI];
        const elemA = type_symbol.value(aI);
        if (isWatery && (elemA !== 'H' && elemA !== 'O'))
            isWatery = false;
        const structConnEntries = props.forceCompute ? void 0 : structConn && structConn.byAtomIndex.get(aI);
        let hasStructConn = false;
        if (structConnEntries) {
            for (const se of structConnEntries) {
                const { partnerA, partnerB } = se;
                // symmetry must be the same for intra-unit bonds
                if (partnerA.symmetry !== partnerB.symmetry)
                    continue;
                const p = partnerA.atomIndex === aI ? partnerB : partnerA;
                const _bI = SortedArray.indexOf(unit.elements, p.atomIndex);
                if (_bI < 0 || atoms[_bI] < aI)
                    continue;
                atomA[atomA.length] = _aI;
                atomB[atomB.length] = _bI;
                flags[flags.length] = se.flags;
                order[order.length] = se.order;
                key[key.length] = se.rowIndex;
                if (!hasStructConn)
                    structConnAdded.clear();
                hasStructConn = true;
                structConnAdded.add(_bI);
            }
        }
        if (structConnExhaustive)
            continue;
        const raI = residueIndex[aI];
        const seqIdA = label_seq_id.value(raI);
        const compId = label_comp_id.value(aI);
        if (!props.forceCompute && raI !== lastResidue) {
            if (!!component && component.entries.has(compId)) {
                const entitySeq = byEntityKey[index.getEntityFromChain(chainIndex[aI])];
                if (entitySeq && entitySeq.sequence.microHet.has(seqIdA)) {
                    // compute for sequence positions with micro-heterogeneity
                    componentMap = void 0;
                }
                else {
                    componentMap = component.entries.get(compId).map;
                }
            }
            else {
                componentMap = void 0;
            }
        }
        lastResidue = raI;
        const aeI = getElementIdx(elemA);
        const atomIdA = label_atom_id.value(aI);
        const componentPairs = componentMap ? componentMap.get(atomIdA) : void 0;
        const { indices, count, squaredDistances } = query3d.find(x[aI], y[aI], z[aI], maxRadius);
        const isHa = isHydrogen(aeI);
        const thresholdA = getElementThreshold(aeI);
        const altA = label_alt_id.value(aI);
        const metalA = MetalsSet.has(aeI);
        for (let ni = 0; ni < count; ni++) {
            const _bI = indices[ni];
            if (hasStructConn && structConnAdded.has(_bI))
                continue;
            const bI = atoms[_bI];
            if (bI <= aI)
                continue;
            const altB = label_alt_id.value(bI);
            if (altA && altB && altA !== altB)
                continue;
            const beI = getElementIdx(type_symbol.value(bI));
            const isHb = isHydrogen(beI);
            if (isHa && isHb)
                continue;
            const isMetal = (metalA || MetalsSet.has(beI)) && !(isHa || isHb);
            const rbI = residueIndex[bI];
            // handle "component dictionary" bonds.
            if (raI === rbI && componentPairs) {
                const e = componentPairs.get(label_atom_id.value(bI));
                if (e) {
                    atomA[atomA.length] = _aI;
                    atomB[atomB.length] = _bI;
                    order[order.length] = e.order;
                    let flag = e.flags;
                    if (isMetal) {
                        if (flag | 1 /* BondType.Flag.Covalent */)
                            flag ^= 1 /* BondType.Flag.Covalent */;
                        flag |= 2 /* BondType.Flag.MetallicCoordination */;
                    }
                    flags[flags.length] = flag;
                    key[key.length] = e.key;
                }
                continue;
            }
            const dist = Math.sqrt(squaredDistances[ni]);
            if (dist === 0)
                continue;
            const pairingThreshold = getPairingThreshold(aeI, beI, thresholdA, getElementThreshold(beI));
            if (dist <= pairingThreshold) {
                atomA[atomA.length] = _aI;
                atomB[atomB.length] = _bI;
                order[order.length] = getIntraBondOrderFromTable(compId, atomIdA, label_atom_id.value(bI));
                flags[flags.length] = (isMetal ? 2 /* BondType.Flag.MetallicCoordination */ : 1 /* BondType.Flag.Covalent */) | 32 /* BondType.Flag.Computed */;
                key[key.length] = -1;
                const seqIdB = label_seq_id.value(rbI);
                if (seqIdA === seqIdB)
                    isDictionaryBased = false;
                if (Math.abs(seqIdA - seqIdB) > 1)
                    isSequenced = false;
            }
        }
    }
    const canRemap = isWatery || (isDictionaryBased && isSequenced);
    return getGraph(atomA, atomB, order, flags, key, atomCount, canRemap);
}
function computeIntraUnitBonds(unit, props) {
    const p = { ...DefaultBondComputationProps, ...props };
    if (p.noCompute || (Model.isCoarseGrained(unit.model) && !IndexPairBonds.Provider.get(unit.model) && !StructConn.isExhaustive(unit.model))) {
        return IntraUnitBonds.Empty;
    }
    if (!p.forceCompute && IndexPairBonds.Provider.get(unit.model)) {
        return findIndexPairBonds(unit);
    }
    else {
        return findBonds(unit, p);
    }
}
export { computeIntraUnitBonds };
