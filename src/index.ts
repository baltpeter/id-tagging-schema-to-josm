import { create } from 'xmlbuilder2';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { idFieldTypeToJosmField, josmTypesFromIdGeometry, idFields, idPresets, idTranslationsEn } from './lib/its.ts';
import { iso1A2Code } from '@rapideditor/country-coder';
import { arrayIntersect, arrayUnique, strArrArrUnique } from './lib/util.ts';
import { taginfoSuggestions } from './lib/taginfo.ts';

const itsLicense = await readFile(
    join(import.meta.dirname, '../node_modules/@openstreetmap/id-tagging-schema/LICENSE.md'),
    'utf-8',
);

const doc = create({ version: '1.0', encoding: 'utf-8' }).ele('presets', {
    xmlns: 'http://josm.openstreetmap.de/tagging-preset-1.0',
});
doc.com('\nThese presets are based on id-tagging-schema, which has the following license terms:\n\n' + itsLicense);

// JOSM doesn't like slashes in `ref`s.
const slugifyRef = (ref: string) => ref.replaceAll('/', '__');

/** Fields in curly braces resolve to those of the preset by that name. */
const resolveFields = (fields: string[] | undefined, fieldType: 'fields' | 'moreFields'): string[] =>
    fields
        ?.map((f) => {
            if (f.startsWith('{')) return resolveFields(idPresets[f.slice(1, -1)][fieldType], fieldType);
            return f;
        })
        // https://stackoverflow.com/a/61420611
        .flat(Infinity as 20) || [];

// Turns out that this property is quite useless in JOSM compared to iD. It doesn't hide but only produces a validation
// error when uploading (https://josm.openstreetmap.de/ticket/23290#comment:5).
const convertLocationSet = (e: { locationSet?: { include?: string[]; exclude?: string[] } }) => {
    // TODO: There is also `locationSetCrossReference` for importing the `locationSet` from another preset/field but
    // that isn't currently used anywhere.
    if (!e.locationSet || (!e.locationSet.include && !e.locationSet.exclude)) return undefined;

    // While per the id-tagging-schema schema, you could technically specify both `exclude` and `include`, in practice
    // this hasn't happened. And JOSM doesn't support that anyway. Since an allowlist is stricter, we prefer that.
    const isExclude = !e.locationSet.include;
    const regions = (isExclude ? e.locationSet.exclude! : e.locationSet.include!)
        .map((r) => iso1A2Code(r))
        .filter(Boolean);

    if (regions.length) return { regions, exclude_regions: isExclude ? true : undefined };
};

const filterFields = (fields: string[], geometries: string[]) =>
    fields.filter((f) => {
        const fieldGeometries = josmTypesFromIdGeometry(idFields[f].geometry);
        return !fieldGeometries || arrayIntersect(geometries, fieldGeometries).length > 0;
    });

// TODO: Handle `type: restrictions`.
const keyForField = (field: string) => idFields[field].key || idFields[field].keys?.[0];

// TODO: Do we want to do something with these? Adding them to every preset seems overwhelming.
const universalFields = Object.entries(idFields)
    .filter(([, f]) => f.universal)
    .map(([id]) => id);

for (const [id, f] of Object.entries(idFields)) {
    const chunk = doc.ele('chunk', { id: slugifyRef(id) });

    const key = f.key || f.keys?.[0];
    if (!key) continue;

    // TODO: special handling for: localized?, colour?, textarea, date?, typeCombo, defaultCheck, onewayCheck, radio?,
    // wikidata?, wikipedia?
    // TODO: Needs to be implemented separately: multiCombo, manyCombo, networkCombo?, directionalCombo, structureRadio,
    // access, address, restrictions
    const type =
        f.type in idFieldTypeToJosmField
            ? idFieldTypeToJosmField[f.type as keyof typeof idFieldTypeToJosmField]
            : undefined;
    if (!type) {
        chunk.ele('label', { text: 'Unsupported field: ' + key });
        continue;
    }

    // TODO: This is not the full logic. We need to handle `f.label`.
    const text = idTranslationsEn.en.presets.fields[key]?.label || key;

    const input = chunk.ele(type, {
        // TODO: I doubt it's possible to implement iD's handling of `keys`.
        key,
        text,
        default: f.default,
        ...convertLocationSet(f),
    });
    if (type === 'combo' || type === 'multiselect') {
        for (const option of f.options || []) {
            // TODO: f.strings, f.stringsCrossReference
            // TODO: f.icons, f.iconsCrossReference
            input.ele('list_entry', { value: option });
        }

        if (f.autoSuggestions !== false) {
            const suggestions = taginfoSuggestions(key).filter((s) => !f.options?.includes(s));
            for (const option of suggestions || []) input.ele('list_entry', { value: option });
        }
    }
    // TODO: f.options for checkbox

    // TODO: these feel impossible: snake_case, caseSensitive, allowDuplicates, minValue, maxValue, increment,
    // customValues, pattern, urlFormat
    // TODO: special field options: types, placeholders, labels
    // TODO: Translations can have placeholder.
}

for (const [id, p] of Object.entries(idPresets)) {
    if (id.startsWith('@templates/')) continue;

    // TODO: Handle p.name.
    const translation = idTranslationsEn.en.presets.presets[id];
    // According to the ideditor/schema-builder README, p.aliases and p.terms are also possible but those are never
    // actually used.
    const name = translation
        ? [translation.name, ...(translation.aliases?.split('\n') || [])].join(' / ') +
          (translation.terms ? ` (${translation.terms.replaceAll(',', ', ')})` : '')
        : id;

    const fields = resolveFields(p.fields, 'fields');
    const moreFields = resolveFields(p.moreFields, 'moreFields').filter((f) => !fields.includes(f));

    // JOSM doesn't support restricting the geometry types on a per-field basis (only for presets), while iD needs that.
    // Since this is quite important, we need to duplicate each preset that has geometry-type-restricted fields for each
    // possible type combination.
    const presetGeometries = arrayUnique(josmTypesFromIdGeometry(p.geometry));
    const legalFieldGeometryCombinations = strArrArrUnique(
        [...fields, ...moreFields]
            .map((f) => arrayUnique(josmTypesFromIdGeometry(idFields[f].geometry)).sort())
            .map((c) => arrayIntersect(c, presetGeometries))
            .filter((c) => c.length > 0),
    );
    const geometryCombinations: string[][] = [];
    let remainingPresetGeometries = presetGeometries.slice();
    for (const c of legalFieldGeometryCombinations) {
        geometryCombinations.push(c);
        remainingPresetGeometries = remainingPresetGeometries.filter((g) => !c.includes(g));
    }
    if (remainingPresetGeometries.length > 0) geometryCombinations.push(remainingPresetGeometries);

    for (const geometries of geometryCombinations) {
        const item = doc.ele('item', {
            // TODO: Remove prefix (just for testing to distinguish the presets).
            name: 'BenniD::' + name,
            type: geometries.join(','),
            ...convertLocationSet(p),
        });

        // This is annoying, but because JOSM doesn't deduplicate keys (which iD does), we have to do that ourselves.
        // Because we start by adding the static keys, we _should_ be fine to deduplicate in insertion order.
        const addedKeys = new Set<string>();

        for (const [key, value] of Object.entries({ ...p.tags, ...p.addTags })) {
            if (value !== '*') {
                item.ele('key', { key, value });
                addedKeys.add(key);
            }
        }

        const addFields = (fields: string[], xmlBase: typeof item) => {
            for (const field of fields) {
                const key = keyForField(field);
                if (!key) continue;
                if (addedKeys.has(key)) continue;

                xmlBase.ele('reference', { ref: slugifyRef(field) });
                addedKeys.add(key);
            }
        };

        const geometryFilteredFields = filterFields(fields, geometries);
        const geometryFilteredMoreFields = filterFields(moreFields, geometries);

        addFields(geometryFilteredFields, item);
        if (geometryFilteredMoreFields.length > 0) {
            const optional = item.ele('optional');
            addFields(geometryFilteredMoreFields, optional);
        }

        // TODO: If fields or moreFields are not defined, the values of the preset's "parent" preset are used. For example, shop/convenience automatically uses the same fields as shop.
        // TODO: In both explicit and implicit inheritance, fields for keys that define the preset via tags are generally not inherited, even when specified by the parent explicitly. E.g. the shop field is not inherited by shop/… presets. This can be overwritten by adding the field explicitly like "fields": [ "shop", "{shop}" ],

        // TODO: p.icon, p.imageURL?
        // TODO: p.replacement
        // TODO: p.reference
        // TODO: p.relation
        // TODO: match based on p.tags, p.matchScore
        // TODO: these feel impossible: p.removeTags
    }
}

await writeFile(join(import.meta.dirname, '../out/id-presets.xml'), doc.end({ prettyPrint: true }));
