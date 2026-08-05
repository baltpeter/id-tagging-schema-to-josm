import _idPresets from '@openstreetmap/id-tagging-schema/dist/presets.json' with { type: 'json' };
import _idFields from '@openstreetmap/id-tagging-schema/dist/fields.json' with { type: 'json' };
import _idCategories from '@openstreetmap/id-tagging-schema/dist/preset_categories.json' with { type: 'json' };
import idTranslationsEn from '@openstreetmap/id-tagging-schema/dist/translations/en.json' with { type: 'json' };
import type { Presets, Fields, PresetCategories } from '@openstreetmap/id-tagging-schema';
import { globby } from 'globby';
import { basename, join } from 'node:path';
import { readFile } from 'node:fs/promises';

type NestedRecord = { [k: string]: string | NestedRecord };
type EmptyObj = Record<PropertyKey, never>;

// The bundled types unfortunately don't import correctly, so this dance is needed.
export const idPresets = _idPresets as unknown as Presets;
export const idFields = _idFields as unknown as Fields;
export const idCategories = _idCategories as unknown as PresetCategories;

export type Translation = {
    categories: Record<string, { name: string }>;
    fields: Record<
        string,
        {
            label?: string;
            placeholder?: string;
            terms?: string[];
            options?: Record<string, string | { title: string; description: string }>;
            types?: Record<string, string>;
            [k: string]: string | string[] | NestedRecord | undefined;
        }
    >;
    presets: Record<string, EmptyObj | { name: string; terms?: string[]; aliases?: string[] }>;
};

const idTranslationPaths = await globby(['*.json', '!*.min.json'], {
    cwd: join(import.meta.dirname, '..', '..', 'node_modules/@openstreetmap/id-tagging-schema/dist/translations'),
    absolute: true,
});
export const idTranslations: Record<string, Translation> = Object.fromEntries(
    (
        await Promise.all(
            idTranslationPaths
                .map((path) => ({ lang: basename(path, '.json'), path }))
                .map(async ({ lang, path }) => ({ lang, json: await readFile(path, 'utf-8') })),
        )
    )
        // Rough mechanism to only include reasonably translations. For reference, the English translation currently has
        // length 786_267.
        .filter(({ json }) => json.length > 500_000)
        .map(({ lang, json }) => [lang, JSON.parse(json)[lang]?.presets]),
);
export const translate = (lang: string, getter: (t: Translation) => string | undefined) => {
    if (!(lang in idTranslations)) throw new Error('Unknown translation: ' + lang);

    try {
        const translation = getter(idTranslations[lang]);
        if (translation) return translation;
    } catch {}

    return getter(idTranslationsEn.en.presets);
};

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
    // JOSM has special handling for colors in combo fields:
    // https://josm.openstreetmap.de/browser/josm/trunk/resources/data/tagging-preset.xsd?rev=19261#L398
    colour: 'combo',
    schedule: 'text',
    textarea: 'text',
    date: 'text',

    combo: 'combo',
    typeCombo: 'combo',
    // This should filter the values based on the location, which we can't do in JOSM.
    networkCombo: 'combo',
    semiCombo: 'multiselect',
    // This needs additional handling.
    directionalCombo: 'combo',

    check: 'check',
    defaultCheck: 'check',
    onewayCheck: 'check',

    // Best we can do since JOSM doesn't have radio buttons.
    radio: 'combo',

    // This needs additional handling.
    access: 'combo',

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
export const allJosmTypes = ['node', 'way', 'closedway', 'relation', 'multipolygon'];
export const josmTypesFromIdGeometry = (geometry: (keyof typeof idGeometryToJosmType)[] | undefined) =>
    geometry?.map((g) => idGeometryToJosmType[g].split(',')).flat();
