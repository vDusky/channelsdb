/**
 * Copyright (c) 2017 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
import { Table } from '../../mol-data/db';
import { CifWriter } from '../../mol-io/writer/cif';
import * as S from './schemas';
// import { getCategoryInstanceProvider } from './utils'
export function createMapping(allData) {
    const mols = Object.keys(allData);
    const enc = CifWriter.createEncoder();
    enc.startDataBlock(mols[0]);
    if (!mols.length)
        return enc.getData();
    const data = allData[mols[0]];
    const sources = getSources(data);
    if (!sources._rowCount)
        return enc.getData();
    enc.writeCategory({ name: `pdbx_domain_annotation_sources`, instance: () => CifWriter.Category.ofTable(sources) });
    for (const cat of Object.keys(S.categories)) {
        writeDomain(enc, getDomain(cat, S.categories[cat], data));
    }
    return enc.getData();
}
function writeDomain(enc, domain) {
    if (!domain)
        return;
    enc.writeCategory({ name: `pdbx_${domain.name}_domain_annotation`, instance: () => CifWriter.Category.ofTable(domain.domains) });
    enc.writeCategory({ name: `pdbx_${domain.name}_domain_mapping`, instance: () => CifWriter.Category.ofTable(domain.mappings) });
}
function getSources(data) {
    const rows = [];
    for (const name of Object.keys(S.categories)) {
        if (!data[name])
            continue;
        const row = { id: name, count: Object.keys(data[name]).length };
        if (row.count > 0)
            rows.push(row);
    }
    return Table.ofRows(S.Sources, rows);
}
function getMappings(startId, group_id, mappings) {
    const rows = [];
    const n = (v) => v === null ? void 0 : v;
    for (const entry of mappings) {
        if (entry.start && entry.end) {
            rows.push({
                id: startId++,
                group_id,
                label_entity_id: '' + entry.entity_id,
                label_asym_id: entry.struct_asym_id,
                auth_asym_id: entry.chain_id,
                beg_label_seq_id: n(entry.start.residue_number),
                beg_auth_seq_id: n(entry.start.author_residue_number),
                pdbx_beg_PDB_ins_code: entry.start.author_insertion_code,
                end_label_seq_id: n(entry.end.residue_number),
                end_auth_seq_id: n(entry.end.author_residue_number),
                pdbx_end_PDB_ins_code: entry.end.author_insertion_code
            });
        }
        else {
            rows.push({
                id: startId++,
                group_id,
                label_entity_id: '' + entry.entity_id,
                label_asym_id: entry.struct_asym_id,
                auth_asym_id: entry.chain_id
            });
        }
    }
    return rows;
}
function getDomainInfo(id, mapping_group_id, data, schema) {
    const props = Object.create(null);
    for (const k of Object.keys(schema))
        props[k] = data[k];
    return { id, mapping_group_id, identifier: data.identifier, ...props };
}
function getDomain(name, schema, allData) {
    if (!allData[name])
        return void 0;
    const data = allData[name];
    const domains = [];
    const mappings = [];
    let mappingSerialId = 1, mapping_group_id = 1;
    for (const id of Object.keys(data)) {
        const domain = data[id];
        domains.push(getDomainInfo(id, mapping_group_id, domain, schema));
        mappings.push(...getMappings(mappingSerialId, mapping_group_id, domain.mappings));
        mappingSerialId = mappings.length + 1;
        mapping_group_id++;
    }
    return domains.length > 0 ? {
        name,
        domains: Table.ofRows({ ...S.Base, ...schema }, domains),
        mappings: Table.ofRows(S.mapping, mappings)
    } : void 0;
}
