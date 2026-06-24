import _idPresets from '@openstreetmap/id-tagging-schema/dist/presets.json' with { type: 'json' };
import _idFields from '@openstreetmap/id-tagging-schema/dist/fields.json' with { type: 'json' };
import idCategories from '@openstreetmap/id-tagging-schema/dist/preset_categories.json' with { type: 'json' };
import _idTranslationsEn from '@openstreetmap/id-tagging-schema/dist/translations/en.json' with { type: 'json' };
import { type ItsField } from './its-types/ItsField.ts';
import { type ItsPreset } from './its-types/ItsPreset.ts';
import type { SetOptional } from 'type-fest';

type NestedRecord = { [k: string]: string | NestedRecord };
type EmptyObj = Record<PropertyKey, never>;

export const idPresets = _idPresets as Record<string, Omit<ItsPreset, 'name'>>;
export const idFields = _idFields as Record<string, SetOptional<ItsField, 'label'>>;
export const idTranslationsEn = _idTranslationsEn.en.presets as {
    categories: Record<string, { name: string }>;
    fields: Record<
        string,
        {
            label?: string;
            placeholder?: string;
            terms?: string;
            options?: Record<string, string | { title: string; description: string }>;
            [k: string]: string | NestedRecord | undefined;
        }
    >;
    presets: Record<string, EmptyObj | { name: string; terms?: string; aliases?: string }>;
};

export { idCategories };

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

export const idGeometryToJosmType = {
    point: 'node',
    vertex: 'node',
    line: 'way',
    area: 'closedway',
    relation: 'relation,multipolygon',
};
export const josmTypesFromIdGeometry = (geometry: (keyof typeof idGeometryToJosmType)[] | undefined) =>
    geometry?.map((g) => idGeometryToJosmType[g].split(',')).flat();
