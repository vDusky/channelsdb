"use strict";
/**
 * Copyright (c) 2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMmcifHierarchy = void 0;
const mmcif_1 = require("../../../../mol-model-formats/structure/mmcif");
const representation_1 = require("../../../../mol-plugin-state/transforms/representation");
const spacefill_1 = require("../../../../mol-repr/structure/representation/spacefill");
const names_1 = require("../../../../mol-util/color/names");
const state_1 = require("../state");
const model_1 = require("./model");
function getSpacefillParams(color, scaleFactor, graphics, clipVariant) {
    const gmp = (0, state_1.getGraphicsModeProps)(graphics === 'custom' ? 'quality' : graphics);
    return {
        type: {
            name: 'spacefill',
            params: {
                ...spacefill_1.SpacefillRepresentationProvider.defaultValues,
                ignoreHydrogens: false,
                instanceGranularity: false,
                ignoreLight: true,
                lodLevels: gmp.lodLevels.map(l => {
                    return {
                        ...l,
                        stride: Math.max(1, Math.round(l.stride / Math.pow(scaleFactor, l.scaleBias)))
                    };
                }),
                quality: 'lowest', // avoid 'auto', triggers boundary calc
                clip: {
                    variant: clipVariant,
                    objects: [],
                },
                clipPrimitive: true,
                approximate: gmp.approximate,
                alphaThickness: gmp.alphaThickness,
            },
        },
        colorTheme: {
            name: 'uniform',
            params: {
                value: color,
                saturation: 0,
                lightness: 0,
            }
        },
        sizeTheme: {
            name: 'physical',
            params: {
                value: 1,
            }
        },
    };
}
async function createMmcifHierarchy(plugin, trajectory) {
    var _a, _b;
    const builder = plugin.builders.structure;
    const state = plugin.state.data;
    const model = await builder.createModel(trajectory, { modelIndex: 0 });
    const { data: entities, subtype } = model.data.entities;
    const sd = (_a = model.data) === null || _a === void 0 ? void 0 : _a.sourceData;
    if (mmcif_1.MmcifFormat.is(sd)) {
        const pdbId = sd.data.db.struct.entry_id.value(0);
        state_1.MesoscaleState.set(plugin, {
            description: sd.data.db.struct.title.value(0),
            link: pdbId ? `https://www.rcsb.org/structure/${pdbId}` : ''
        });
    }
    const spheresAvgRadius = new Map();
    if (model.data.coarseHierarchy.isDefined) {
        const spheresCount = new Map();
        const spheresEntity_id = model.data.coarseHierarchy.spheres.entity_id;
        const spheresRadius = model.data.coarseConformation.spheres.radius;
        for (let i = 0, il = spheresEntity_id.rowCount; i < il; ++i) {
            const entitiId = spheresEntity_id.value(i);
            const radius = spheresRadius[i];
            if (!spheresCount.has(entitiId)) {
                spheresCount.set(entitiId, 1);
                spheresAvgRadius.set(entitiId, radius);
            }
            else {
                spheresCount.set(entitiId, spheresCount.get(entitiId) + 1);
                spheresAvgRadius.set(entitiId, spheresAvgRadius.get(entitiId) + radius);
            }
        }
        spheresAvgRadius.forEach((v, k) => {
            spheresAvgRadius.set(k, v / spheresCount.get(k));
        });
    }
    const entGroups = new Map();
    const entIds = new Map();
    const entColors = new Map();
    const graphicsMode = state_1.MesoscaleState.get(plugin).graphics;
    const groupParams = (0, state_1.getMesoscaleGroupParams)(graphicsMode);
    const base = await state.build()
        .to(model)
        .apply(model_1.MmcifAssembly, { id: '' })
        .commit();
    const units = base.data.units;
    const willBeMerged = units.length > 1 && units.every(u => u.conformation.operator.isIdentity);
    const clipVariant = willBeMerged ? 'pixel' : 'instance';
    const entRoot = await state.build()
        .toRoot()
        .applyOrUpdateTagged('group:ent:', state_1.MesoscaleGroup, { ...groupParams, root: true, index: -1, tag: `ent:`, label: 'entity', color: { type: 'custom', value: names_1.ColorNames.white, variability: 20, shift: 0, lightness: 0, alpha: 1 } }, { tags: 'group:ent:', state: { isCollapsed: false, isHidden: groupParams.hidden } })
        .commit();
    const getEntityType = (i) => {
        if (entities.type.value(i) === 'water')
            return 'water';
        return subtype.value(i) || 'unknown type';
    };
    for (let i = 0; i < entities._rowCount; i++) {
        const t = getEntityType(i);
        if (!entIds.has(t)) {
            entIds.set(t, { idx: entIds.size, members: new Map() });
        }
        const cm = entIds.get(t);
        cm.members.set(i, cm.members.size);
    }
    //
    const baseEntColors = (0, state_1.getDistinctBaseColors)(entIds.size, 0);
    const entIdEntries = Array.from(entIds.entries());
    for (let i = 0; i < entIdEntries.length; ++i) {
        const [t, m] = entIdEntries[i];
        const groupColors = (0, state_1.getDistinctGroupColors)(m.members.size, baseEntColors[i], 20, 0);
        entColors.set(t, groupColors);
    }
    for (let i = 0; i < entities._rowCount; i++) {
        const t = getEntityType(i);
        if (!entGroups.has(t)) {
            const colorIdx = (_b = entIds.get(t)) === null || _b === void 0 ? void 0 : _b.idx;
            const color = colorIdx !== undefined ? baseEntColors[colorIdx] : names_1.ColorNames.white;
            const group = await state.build()
                .to(entRoot)
                .applyOrUpdateTagged(`group:ent:${t}`, state_1.MesoscaleGroup, { ...groupParams, index: colorIdx, tag: `ent:${t}`, label: t, color: { type: 'generate', value: color, variability: 20, shift: 0, lightness: 0, alpha: 1 } }, { tags: `ent:`, state: { isCollapsed: true, isHidden: groupParams.hidden } })
                .commit({ revertOnError: true });
            entGroups.set(t, group);
        }
    }
    //
    await state.transaction(async () => {
        try {
            const dependsOn = [base.ref];
            plugin.animationLoop.stop({ noDraw: true });
            let build = state.build();
            for (let i = 0; i < entities._rowCount; i++) {
                const t = getEntityType(i);
                const color = entColors.get(t)[entIds.get(t).members.get(i)];
                const scaleFactor = spheresAvgRadius.get(entities.id.value(i)) || 1;
                build = build
                    .toRoot()
                    .apply(model_1.MmcifStructure, { structureRef: base.ref, entityId: entities.id.value(i) }, { dependsOn })
                    .apply(representation_1.StructureRepresentation3D, getSpacefillParams(color, scaleFactor, graphicsMode, clipVariant), { tags: [`ent:${t}`] });
            }
            await build.commit();
        }
        catch (e) {
            console.error(e);
            plugin.log.error(e);
        }
        finally {
            plugin.animationLoop.start();
        }
    }).run();
}
exports.createMmcifHierarchy = createMmcifHierarchy;
