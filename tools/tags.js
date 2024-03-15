// tag.js

// Define arrays
const WijsterReferences = [
    "GREENCREATE.Wijster.GasTreatment.Tot_Gas_From_ADs", 
    "GREENCREATE.Wijster.GasTreatment.FT-73-0001", 
    "GREENCREATE.Wijster.Flare.FT-65-0001_PV", 
    "GREENCREATE.Wijster.BUU.Collective.Biogas_to_BUU", 
    "GREENCREATE.Wijster.BUU.Collective.Biomethane_to_Grid"
];

const WijsterNames = [
    "Biogas (m3)", 
    "CHPs (m3)", 
    "Flare (m3)", 
    "BUU (m3)", 
    "Grid (m3)"
];

const KentReferences = [
"GREENCREATE.Kent.CHP.FT2001_PV",
"GREENCREATE.Kent.Flow.FT1021_PV",
"GREENCREATE.Kent.Flow.FT1022_PV",
"GREENCREATE.Kent.Flow.FT1731_PV",
"GREENCREATE.Kent.Flow.FT1002_PV"

];

const KentNames = [
    'Biogas CHP (m3)',
    'D1 Flow (m3)',
    'D2 Flow (m3)',
    'Pond Water (m3)',
    'Centrate Recirc (m3)'
];

// Export the variables
module.exports = {
    WijsterReferences,
    WijsterNames,
    KentReferences,
    KentNames
};