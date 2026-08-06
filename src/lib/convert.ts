import { create } from 'xmlbuilder2';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
    idFieldTypeToJosmField,
    josmTypesFromIdGeometry,
    idFields,
    idPresets,
    idCategories,
    allJosmTypes,
    translate,
    type Translation,
} from './its.ts';
import { iso1A2Code } from '@rapideditor/country-coder';
import { arrayIntersect, arrayUnique, strArrArrUnique } from './util.ts';
import { taginfoPrefixedKeySuggestions, taginfoSuggestions } from './taginfo.ts';
import JSZip from 'jszip';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces.js';

export const convertPreset = async (lang: string) => {
    const itsLicense =
        '\nThese presets are based on id-tagging-schema, which has the following license terms:\n\n' +
        (await readFile(
            join(import.meta.dirname, '../node_modules/@openstreetmap/id-tagging-schema/LICENSE.md'),
            'utf-8',
        ));

    const doc = create({ version: '1.0', encoding: 'utf-8' }).ele('presets', {
        xmlns: 'http://josm.openstreetmap.de/tagging-preset-1.0',
    });
    doc.com(itsLicense);

    // JOSM doesn't like slashes in `ref`s.
    const slugifyRef = (ref: string) => ref.replaceAll('/', '__');

    // Turns out that this property is quite useless in JOSM compared to iD. It doesn't hide but only produces a
    // validation error when uploading (https://josm.openstreetmap.de/ticket/23290#comment:5).
    const convertLocationSet = (e: { locationSet?: { include?: string[]; exclude?: string[] } }) => {
        if (!e.locationSet || (!e.locationSet.include && !e.locationSet.exclude)) return undefined;

        // While per the id-tagging-schema schema, you could technically specify both `exclude` and `include`, in
        // practice this hasn't happened. And JOSM doesn't support that anyway. Since an allowlist is stricter, we
        // prefer that.
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

    // This assumes that each field has at least one key, which isn't the case for `type: restrictions`, but that isn't
    // currently used anywhere.
    const keyForField = (field: string) => idFields[field].key || idFields[field].keys?.[0];

    const iconsUsed = new Set<string>();

    for (const [id, f] of Object.entries(idFields)) {
        const chunkId = slugifyRef(id);
        const chunk = doc.ele('chunk', { id: chunkId });

        const key = f.key || f.keys?.[0];
        if (!key) continue;

        const fieldTranslation = (getter: (f: Translation['fields'][string] | undefined) => string | undefined) =>
            translate(lang, (t) => getter(t.fields[id]));
        const fieldLabel = fieldTranslation((f) => f?.label) || id;

        const type =
            f.type in idFieldTypeToJosmField
                ? idFieldTypeToJosmField[f.type as keyof typeof idFieldTypeToJosmField]
                : undefined;
        if (f.type === 'address') {
            chunk.ele('preset_link', {
                preset_name: 'Address',
                text: '',
            });
            continue;
        } else if (['multiCombo', 'manyCombo'].includes(f.type)) {
            const keyBuilder = (option: string) => {
                if (f.type === 'multiCombo') return `${f.key}${option}`;

                return option;
            };

            chunk.ele('label', { text: fieldLabel });
            const checkGroup = chunk.ele('checkgroup', { columns: 5 });

            for (const option of f.options || []) {
                const optionText =
                    fieldTranslation((f) => {
                        const translation = f?.options?.[option];
                        if (typeof translation === 'object' && 'title' in translation) return translation.title;
                        return translation;
                    }) || option;

                checkGroup.ele('check', {
                    key: keyBuilder(option),
                    text: optionText,
                });
            }

            // Unfortunately, the only way JOSM can display (check group) those is a lot less efficient than iD (combo
            // box). This is made worse by the fact that we can't filter by country in JOSM. To not spam every preset
            // with tons of checkboxes, we limit the number of auto suggestions.
            if (f.type === 'multiCombo' && f.autoSuggestions !== false && (f.options?.length || 0) <= 30) {
                const suggestions = taginfoPrefixedKeySuggestions(key, f.caseSensitive || false)
                    .filter((s) => !f.options?.includes(s))
                    .slice(0, 30);
                for (const option of suggestions || [])
                    checkGroup.ele('check', { key: keyBuilder(option), text: option });
            }

            continue;
        } else if (!type) {
            // This is a built-in icon.
            chunk.ele('label', { text: 'Unsupported field: ' + key, icon: 'misc/error' });
            continue;
        }

        const isKeyedCombo = ['directionalCombo', 'access'].includes(f.type);

        if (isKeyedCombo) chunk.ele('label', { text: fieldLabel });

        const keys = isKeyedCombo && f.keys ? f.keys : [key];

        // In almost all cases, we have exactly one key and `specificKey = key`. The loop is only needed for
        // `isKeyedCombo: true`.
        for (const specificKey of keys) {
            const text = isKeyedCombo ? fieldTranslation((f) => f?.types?.[specificKey]) || specificKey : fieldLabel;

            const inputAttrs = {
                key: specificKey,
                text,
                default: f.type === 'typeCombo' ? 'yes' : f.default,
                editable: f.customValues,
                ...convertLocationSet(f),
            };
            const input = chunk.ele(type, inputAttrs);
            if (type === 'combo' || type === 'multiselect') {
                let optionCount = f.options?.length || 0;

                for (const option of f.options || []) {
                    // iD hardcodes this
                    // (https://github.com/openstreetmap/iD/blob/5aba48bfdec68ef9f843ccdc1f65d77937ab1666/modules/ui/fields/access.js#L98-L103),
                    // so I guess we will, too…
                    if (f.type === 'access') {
                        if (specificKey !== 'bicycle' && option === 'dismount') continue;
                        if (specificKey === 'access' && ['yes', 'designated'].includes(option)) continue;
                    }

                    const title = fieldTranslation((f) => {
                        const translation = f?.options?.[option];
                        if (typeof translation === 'object' && 'title' in translation) return translation.title;
                        return translation;
                    });
                    const description = fieldTranslation((f) => {
                        const translation = f?.options?.[option];
                        if (typeof translation === 'object' && 'description' in translation)
                            return translation.description;
                        return undefined;
                    });

                    const icon = f.icons?.[option];
                    input.ele('list_entry', {
                        value: option,
                        display_value: title ? `${title} (${option})` : undefined,
                        short_description: description,
                        icon,
                    });
                    if (icon) iconsUsed.add(icon);
                }

                if (f.autoSuggestions !== false) {
                    const suggestions = taginfoSuggestions(key, f.caseSensitive || false).filter(
                        (s) => !f.options?.includes(s),
                    );
                    for (const option of suggestions || []) input.ele('list_entry', { value: option });

                    optionCount += suggestions.length;
                }

                // Hack: Since users can't add their own values to `multiselect`s, we replace it with a text field if we
                // don't have any options to present.
                // We also do this if the field is supposed to allow duplicates.
                if (type === 'multiselect' && (optionCount === 0 || f.allowDuplicates)) {
                    input.remove();
                    chunk.ele('text', inputAttrs);
                }
            }
        }

        // (Painful) hack: iD specifies whether a field in a preset should match on the preset level, while JOSM does so
        // on the field level. Thus, We need to have two versions of each field: a non-matching and a matching one.
        const clone = doc.import(chunk).last();
        clone.att('id', chunkId + '___matchKey');
        clone.each((node) => node.att('match', 'key!'), false, false);
    }

    const groups: Record<string, XMLBuilder> = {};
    for (const [id, category] of Object.entries(idCategories)) {
        groups[id] = doc.ele('group', {
            name: 'iD: ' + translate(lang, (t) => t.categories[id].name) || id,
            icon: category.icon,
        });
        if (category.icon) iconsUsed.add(category.icon);
    }
    groups['uncategorized'] = doc.ele('group', {
        name: 'iD: Uncategorized',
        // This is a built-in icon.
        icon: 'session',
    });

    // Universal fields apply to all presets. In order not to clutter every preset with them, we have one "Universal
    // fields" preset that we link in the actual ones.
    const universalFields = Object.entries(idFields)
        .filter(([, f]) => f.universal)
        .map(([id]) => id);
    const universalFieldsItem = groups['uncategorized'].ele('item', {
        name: 'Universal fields',
        type: allJosmTypes.join(','),
        // This is a built-in icon.
        icon: 'help/internet',
        preset_name_label: true,
    });
    universalFieldsItem.ele('label', { text: 'These fields apply to all presets.' });
    for (const ref of universalFields) universalFieldsItem.ele('reference', { ref: slugifyRef(ref) });

    const getNameForPreset = (id: string) => {
        const name = translate(lang, (t) =>
            t.presets[id] ? [t.presets[id].name, ...(t.presets[id].aliases || [])].join(' / ') : undefined,
        );
        const terms = translate(lang, (t) => t.presets[id].terms?.join(', '));
        // According to the ideditor/schema-builder README, p.aliases and p.terms are also possible but those are never
        // actually used.
        const result = name ? name + (terms ? ` (${terms})` : '') : id;

        return result;
    };

    for (const [id, p] of Object.entries(idPresets)) {
        if (id.startsWith('@templates/')) continue;

        const name = getNameForPreset(id);

        const fields = p.fields || [];
        const moreFields = p.moreFields?.filter((f) => !fields?.includes(f)) || [];

        // Collect the keys, for which any value should match the preset.
        // iD additionally uses p.addTags to boost the matchScore
        // (https://github.com/openstreetmap/iD/blob/b8543e41f6aa771c8d319fc47773020586536f74/modules/presets/preset.ts#L130-L136)
        // but doesn't use them to determine whether a preset should match at all, so we should ignore it.
        const matchKeys = Object.entries(p.tags)
            .filter(([, v]) => v === '*')
            .map(([k]) => k);

        // JOSM doesn't support restricting the geometry types on a per-field basis (only for presets), while iD needs
        // that. Since this is quite important, we need to duplicate each preset that has geometry-type-restricted
        // fields for each possible type combination.
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
            const groupId =
                Object.entries(idCategories).find(([_, c]) => c.members.includes(id))?.[0] || 'uncategorized';
            const group = groups[groupId];

            const item = (group || doc).ele('item', {
                name,
                type: geometries.join(','),
                icon: p.icon,
                preset_name_label: true,
                ...convertLocationSet(p),
            });
            if (p.icon) iconsUsed.add(p.icon);

            if (p.replacement)
                item.ele('preset_link', {
                    preset_name: getNameForPreset(p.replacement),
                    text: 'Warning: Deprecated preset! Recommended alternative: ' + p.replacement,
                });

            if (p.reference)
                item.ele('link', {
                    wiki: 'Tag:' + p.reference.key + (p.reference.value ? '=' + p.reference.value : ''),
                });

            // This is annoying, but because JOSM doesn't deduplicate keys (which iD does), we have to do that
            // ourselves. Because we start by adding the static keys, we _should_ be fine to deduplicate in insertion
            // order.
            const addedKeys = new Set<string>();

            for (const [key, value] of Object.entries(p.addTags || p.tags)) {
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

                    xmlBase.ele('reference', {
                        ref: matchKeys.includes(key) ? slugifyRef(field) + '___matchKey' : slugifyRef(field),
                    });
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

            item.ele('preset_link', { preset_name: 'Universal fields' });
        }
    }

    const outDir = join(import.meta.dirname, '../out');
    await mkdir(outDir, { recursive: true });

    const xml = doc.end({ prettyPrint: true });
    if (lang === 'en') await writeFile(join(outDir, `id-presets.xml`), xml);

    const iconsDir = join(import.meta.dirname, '../icons');
    const fullLicense = itsLicense + '\n\n' + (await readFile(join(iconsDir, 'LICENSE'), 'utf-8'));
    for (const style of ['light', 'dark']) {
        const zip = new JSZip();
        zip.file('id-presets.xml', xml);
        zip.file('LICENSE', fullLicense.trim());

        for (const icon of iconsUsed) {
            const iconBytes = await readFile(join(iconsDir, style, icon + '.svg')).catch(() => undefined);
            if (iconBytes) zip.file(icon + '.svg', iconBytes);
            else console.error('Missing icon:', style, icon);
        }

        await writeFile(
            join(outDir, `id-presets-${lang}-${style}.zip`),
            await zip.generateAsync({ type: 'nodebuffer' }),
        );
    }
};
