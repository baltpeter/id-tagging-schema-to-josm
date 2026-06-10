import idPresets from '@openstreetmap/id-tagging-schema/dist/presets.json' with { type: 'json' };
import idFields from '@openstreetmap/id-tagging-schema/dist/fields.json' with { type: 'json' };
import idTranslationsEn from '@openstreetmap/id-tagging-schema/dist/translations/en.json' with { type: 'json' };
import { create } from 'xmlbuilder2';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { idFieldTypeToJosmField } from './util/mapping.ts';

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

// Fields in curly braces resolve to those of the preset by that name.
const resolveFields = (fields: string[] | undefined, fieldType: string): string[] =>
    fields
        ?.map((f) => {
            if (f.startsWith('{')) return resolveFields(idPresets[f.slice(1, -1)][fieldType], fieldType);
            return f;
        })
        .flat(Infinity) || [];

const keyForField = (field: string) => idFields[field].key || idFields[field].keys[0];

// TODO: Do we want to do something with these? Adding them to every preset seems overwhelming.
const universalFields = Object.entries(idFields)
    .filter(([, f]) => f.universal)
    .map(([id]) => id);

for (const [id, f] of Object.entries(idFields)) {
    const chunk = doc.ele('chunk', { id: slugifyRef(id) });

    // TODO: special handling for: localized?, colour?, textarea, date?, typeCombo, defaultCheck, onewayCheck, radio?,
    // wikidata?, wikipedia?
    // TODO: Needs to be implemented separately: multiCombo, manyCombo, networkCombo?, directionalCombo, structureRadio,
    // access, address, restrictions
    const type =
        f.type in idFieldTypeToJosmField
            ? idFieldTypeToJosmField[f.type as keyof typeof idFieldTypeToJosmField]
            : undefined;
    if (!type) {
        chunk.ele('label', { text: 'Unsupported field: ' + f.key || f.keys[0] });
        continue;
    }

    // TODO: Can we respect f.geometry?

    // TODO: This is not the full logic. We need to handle `f.label`.
    const text = idTranslationsEn.en.presets.fields[f.key]?.label || f.key;

    const input = chunk.ele(type, {
        // TODO: I doubt it's possible to implement iD's handling of `keys`.
        key: f.key || f.keys[0],
        text,
        // TODO: Hack: Since we are currently not respecting f.geometry, specifying f.default for those is dangerous
        // (otherwise e.g. `building_area_yes`, which is present on lots of POIs sets `building=yes` even for nodes).
        default: f.geometry ? undefined : f.default,
    });
    if (type === 'combo' || type === 'multiselect') {
        // TODO: What to do if `f.options` is `undefined`?
        for (const option of f.options || []) {
            // TODO: f.strings, f.stringsCrossReference
            // TODO: f.icons, f.iconsCrossReference
            input.ele('list_entry', { value: option }).up();
        }
    }
    // TODO: f.options for checkbox

    // TODO: f.autoSuggestions
    // TODO: f.customValues
    // TODO: f.prerequisiteTag
    // TODO: f.pattern
    // TODO: f.urlFormat
    // TODO: these feel impossible: snake_case, caseSensitive, allowDuplicates, minValue, maxValue, increment,
    // locationSet
    // TODO: special field options: types, placeholders, labels
    // TODO: Translations can have placeholder.
}

for (const [id, p] of Object.entries(idPresets)) {
    // TODO: Handle p.name.
    const translation = idTranslationsEn.en.presets.presets[id];
    // According to the ideditor/schema-builder README, p.aliases and p.terms are also possible but those are never
    // actually used.
    const name = translation
        ? [translation.name, ...(translation.aliases?.split('\n') || [])].join(' / ') +
          (translation.terms ? ` (${translation.terms.replaceAll(',', ', ')})` : '')
        : id;

    const item = doc.ele('item', {
        name: 'BenniD::' + name,
        // TODO: Actually set this based on `p.geometry`.
        type: 'node,way,closedway,multipolygon,relation',
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
            if (addedKeys.has(key)) continue;

            xmlBase.ele('reference', { ref: slugifyRef(field) });
            addedKeys.add(key);
        }
    };

    const fields = resolveFields(p.fields, 'fields');
    addFields(fields, item);

    const moreFields = resolveFields(p.moreFields, 'moreFields').filter((f) => !fields.includes(f));
    if (moreFields.length > 0) {
        const optional = item.ele('optional');
        addFields(moreFields, optional);
    }

    // TODO: If fields or moreFields are not defined, the values of the preset's "parent" preset are used. For example, shop/convenience automatically uses the same fields as shop.
    // TODO: In both explicit and implicit inheritance, fields for keys that define the preset via tags are generally not inherited, even when specified by the parent explicitly. E.g. the shop field is not inherited by shop/… presets. This can be overwritten by adding the field explicitly like "fields": [ "shop", "{shop}" ],

    // TODO: p.icon, p.imageURL?
    // TODO: p.replacement
    // TODO: p.reference
    // TODO: p.relation
    // TODO: match based on p.tags, p.matchScore
    // TODO: these feel impossible: p.removeTags, p.locationSet
}

await writeFile(join(import.meta.dirname, '../out/id-presets.xml'), doc.end({ prettyPrint: true }));
