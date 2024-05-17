/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { PluginBehavior } from '../../../behavior';
import { ModelCrossLinkRestraint } from '../../../../../mol-model-props/integrative/cross-link-restraint/format';
import { MmcifFormat } from '../../../../../mol-model-formats/structure/mmcif';
import { CrossLinkRestraintRepresentationProvider } from '../../../../../mol-model-props/integrative/cross-link-restraint/representation';
import { CrossLinkColorThemeProvider } from '../../../../../mol-model-props/integrative/cross-link-restraint/color';
export const CrossLinkRestraint = PluginBehavior.create({
    name: 'integrative-cross-link-restraint',
    category: 'custom-props',
    display: { name: 'Cross Link Restraint' },
    ctor: class extends PluginBehavior.Handler {
        constructor() {
            super(...arguments);
            this.provider = ModelCrossLinkRestraint.Provider;
        }
        register() {
            this.provider.formatRegistry.add('mmCIF', crossLinkRestraintFromMmcif);
            this.ctx.representation.structure.themes.colorThemeRegistry.add(CrossLinkColorThemeProvider);
            this.ctx.representation.structure.registry.add(CrossLinkRestraintRepresentationProvider);
        }
        unregister() {
            this.provider.formatRegistry.remove('mmCIF');
            this.ctx.representation.structure.themes.colorThemeRegistry.remove(CrossLinkColorThemeProvider);
            this.ctx.representation.structure.registry.remove(CrossLinkRestraintRepresentationProvider);
        }
    }
});
function crossLinkRestraintFromMmcif(model) {
    if (!MmcifFormat.is(model.sourceData))
        return;
    const { ihm_cross_link_restraint } = model.sourceData.data.db;
    if (ihm_cross_link_restraint._rowCount === 0)
        return;
    return ModelCrossLinkRestraint.fromTable(ihm_cross_link_restraint, model);
}
