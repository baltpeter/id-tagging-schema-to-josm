/**
 * As per: https://github.com/ideditor/schema-builder/tree/e86c4ee8c90455a8655c5735cddc9a8860731891#type
 *
 * Note that this does not include _all_ iD field types. Some just do not map directly to JOSM fields.
 */
export const idFieldTypeToJosmField = {
    text: 'text',
    number: 'text',
    integer: 'text',
    localized: 'text',
    tel: 'text',
    email: 'text',
    url: 'text',
    identifier: 'text',
    colour: 'text',
    schedule: 'text',
    textarea: 'text',
    date: 'text',

    combo: 'combo',
    typeCombo: 'combo',
    semiCombo: 'multiselect',

    check: 'check',
    defaultCheck: 'check',
    onewayCheck: 'check',

    // Best we can do since JOSM doesn't have radio buttons.
    radio: 'combo',

    roadspeed: 'text',
    roadheight: 'text',
    wikidata: 'text',
    wikipedia: 'text',
} as const;
