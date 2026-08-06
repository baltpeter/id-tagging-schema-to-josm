import { convertPreset } from './lib/convert.ts';
import { idTranslations } from './lib/its.ts';

const lang = process.argv[2];

if (lang) await convertPreset(lang);
else {
    for (const lang of Object.keys(idTranslations)) await convertPreset(lang);
}
