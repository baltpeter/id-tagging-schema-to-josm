import { readFile, writeFile } from 'node:fs/promises';
import { convertPreset } from './lib/convert.ts';
import { idTranslations } from './lib/its.ts';
import { join } from 'node:path';

const lang = process.argv[2];

if (lang) await convertPreset(lang);
else {
    const langs = Object.keys(idTranslations);
    for (const lang of langs) await convertPreset(lang);

    // Update README with download links.
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    const assets = langs.map((l) => ({
        locale: l,
        name: displayNames.of(l),
        darkFilename: `id-presets-${l}-dark.zip`,
        lightFilename: `id-presets-${l}-light.zip`,
    }));

    const assetUrl = (assetName: string) =>
        `https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/${assetName}`;
    const readmeMarkerStart = '<!-- § DOWNLOAD LINKS START § -->';
    const readmeMarkerEnd = '<!-- § DOWNLOAD LINKS END § -->';

    const list = assets
        .toSorted((a, b) => (a.name || a.locale).localeCompare(b.name || b.locale))
        .map(
            (a) =>
                `- ${a.name} (\`${a.locale}\`): [light mode](${assetUrl(a.lightFilename)}), [dark mode](${assetUrl(a.darkFilename)})`,
        )
        .join('\n');

    const readmePath = join(import.meta.dirname, '../README.md');
    const readmeText = await readFile(readmePath, 'utf-8');
    const newReadmeText = readmeText.replace(
        new RegExp(`${readmeMarkerStart}\\n[\\s\\S]+?\\n${readmeMarkerEnd}`),
        readmeMarkerStart + '\n' + list + '\n' + readmeMarkerEnd,
    );
    await writeFile(readmePath, newReadmeText);
}
