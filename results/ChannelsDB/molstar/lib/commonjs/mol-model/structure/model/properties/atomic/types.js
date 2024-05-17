"use strict";
/**
 * Copyright (c) 2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonmetal = exports.isMetal = exports.isActinide = exports.isLanthanide = exports.isTransitionMetal = exports.isHalogen = exports.Halogens = exports.isMetalloid = exports.Metalloids = exports.isPostTransitionMetal = exports.PostTransitionMetals = exports.isNobleGas = exports.NobleGases = exports.isDiatomicNonmetal = exports.DiatomicNonmetals = exports.isPolyatomicNonmetal = exports.PolyatomicNonmetals = exports.isAlkalineEarthMetal = exports.AlkalineEarthMetals = exports.isAlkaliMetal = exports.AlkaliMetals = exports.ElementNames = void 0;
const measures_1 = require("./measures");
exports.ElementNames = {
    H: 'Hydrogen', HE: 'Helium', LI: 'Lithium', BE: 'Beryllium', B: 'Boron', C: 'Carbon', N: 'Nitrogen', O: 'Oxygen', F: 'Fluorine', NE: 'Neon', NA: 'Sodium', MG: 'Magnesium', AL: 'Aluminum', SI: 'Silicon', P: 'Phosphorus', S: 'Sulfur', CL: 'Chlorine', AR: 'Argon', K: 'Potassium', CA: 'Calcium', SC: 'Scandium', TI: 'Titanium', V: 'Vanadium', CR: 'Chromium', MN: 'Manganese', FE: 'Iron', CO: 'Cobalt', NI: 'Nickel', CU: 'Copper', ZN: 'Zinc', GA: 'Gallium', GE: 'Germanium', AS: 'Arsenic', SE: 'Selenium', BR: 'Bromine', KR: 'Krypton', RB: 'Rubidium', SR: 'Strontium', Y: 'Yttrium', ZR: 'Zirconium', NB: 'Niobium', MO: 'Molybdenum', TC: 'Technetium', RU: 'Ruthenium', RH: 'Rhodium', PD: 'Palladium', AG: 'Silver', CD: 'Cadmium', IN: 'Indium', SN: 'Tin', SB: 'Antimony', TE: 'Tellurium', I: 'Iodine', XE: 'Xenon', CS: 'Cesium', BA: 'Barium', LA: 'Lanthanum', CE: 'Cerium', PR: 'Praseodymium', ND: 'Neodymium', PM: 'Promethium', SM: 'Samarium', EU: 'Europium', GD: 'Gadolinium', TB: 'Terbium', DY: 'Dysprosium', HO: 'Holmium', ER: 'Erbium', TM: 'Thulium', YB: 'Ytterbium', LU: 'Lutetium', HF: 'Hafnium', TA: 'Tantalum', W: 'Wolfram', RE: 'Rhenium', OS: 'Osmium', IR: 'Iridium', PT: 'Platinum', AU: 'Gold', HG: 'Mercury', TL: 'Thallium', PB: 'Lead', BI: 'Bismuth', PO: 'Polonium', AT: 'Astatine', RN: 'Radon', FR: 'Francium', RA: 'Radium', AC: 'Actinium', TH: 'Thorium', PA: 'Protactinium', U: 'Uranium', NP: 'Neptunium', PU: 'Plutonium', AM: 'Americium', CM: 'Curium', BK: 'Berkelium', CF: 'Californium', ES: 'Einsteinium', FM: 'Fermium', MD: 'Mendelevium', NO: 'Nobelium', LR: 'Lawrencium', RF: 'Rutherfordium', DB: 'Dubnium', SG: 'Seaborgium', BH: 'Bohrium', HS: 'Hassium', MT: 'Meitnerium', DS: 'Darmstadtium', RG: 'Roentgenium', CN: 'Copernicium', NH: 'Nihonium', FL: 'Flerovium', MC: 'Moscovium', LV: 'Livermorium', TS: 'Tennessine', OG: 'Oganesson'
};
exports.AlkaliMetals = new Set(['LI', 'NA', 'K', 'RB', 'CS', 'FR']);
function isAlkaliMetal(element) { return exports.AlkaliMetals.has(element); }
exports.isAlkaliMetal = isAlkaliMetal;
exports.AlkalineEarthMetals = new Set(['BE', 'MG', 'CA', 'SR', 'BA', 'RA']);
function isAlkalineEarthMetal(element) { return exports.AlkalineEarthMetals.has(element); }
exports.isAlkalineEarthMetal = isAlkalineEarthMetal;
exports.PolyatomicNonmetals = new Set(['C', 'P', 'S', 'SE']);
function isPolyatomicNonmetal(element) { return exports.PolyatomicNonmetals.has(element); }
exports.isPolyatomicNonmetal = isPolyatomicNonmetal;
exports.DiatomicNonmetals = new Set(['H', 'N', 'O', 'F', 'CL', 'BR', 'I']);
function isDiatomicNonmetal(element) { return exports.DiatomicNonmetals.has(element); }
exports.isDiatomicNonmetal = isDiatomicNonmetal;
exports.NobleGases = new Set(['HE', 'NE', 'AR', 'KR', 'XE', 'RN']);
function isNobleGas(element) { return exports.NobleGases.has(element); }
exports.isNobleGas = isNobleGas;
exports.PostTransitionMetals = new Set(['ZN', 'GA', 'CD', 'IN', 'SN', 'HG', 'TI', 'PB', 'BI', 'PO', 'CN']);
function isPostTransitionMetal(element) { return exports.PostTransitionMetals.has(element); }
exports.isPostTransitionMetal = isPostTransitionMetal;
exports.Metalloids = new Set(['B', 'SI', 'GE', 'AS', 'SB', 'TE', 'AT']);
function isMetalloid(element) { return exports.Metalloids.has(element); }
exports.isMetalloid = isMetalloid;
exports.Halogens = new Set(['F', 'CL', 'BR', 'I', 'AT']);
function isHalogen(element) { return exports.Halogens.has(element); }
exports.isHalogen = isHalogen;
function isTransitionMetal(element) {
    const no = (0, measures_1.AtomNumber)(element);
    return ((no >= 21 && no <= 29) ||
        (no >= 39 && no <= 47) ||
        (no >= 72 && no <= 79) ||
        (no >= 104 && no <= 108));
}
exports.isTransitionMetal = isTransitionMetal;
function isLanthanide(element) {
    const no = (0, measures_1.AtomNumber)(element);
    return no >= 57 && no <= 71;
}
exports.isLanthanide = isLanthanide;
function isActinide(element) {
    const no = (0, measures_1.AtomNumber)(element);
    return no >= 89 && no <= 103;
}
exports.isActinide = isActinide;
function isMetal(element) {
    return (isAlkaliMetal(element) ||
        isAlkalineEarthMetal(element) ||
        isLanthanide(element) ||
        isActinide(element) ||
        isTransitionMetal(element) ||
        isPostTransitionMetal(element));
}
exports.isMetal = isMetal;
function isNonmetal(element) {
    return (isDiatomicNonmetal(element) ||
        isPolyatomicNonmetal(element) ||
        isNobleGas(element));
}
exports.isNonmetal = isNonmetal;
