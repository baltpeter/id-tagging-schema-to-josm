import { globby } from 'globby';
import { appendFile, cp, mkdir, readFile, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';

// As per: https://github.com/ideditor/schema-builder/blob/e86c4ee8c90455a8655c5735cddc9a8860731891/ICONS.md
const iconSets = {
    maki: {
        prefix: 'maki-',
        iconsGlob: 'node_modules/@mapbox/maki/icons/*.svg',
        license: 'node_modules/@mapbox/maki/LICENSE.txt',
    },
    temaki: {
        prefix: 'temaki-',
        iconsGlob: 'node_modules/@rapideditor/temaki/icons/*.svg',
        license: 'node_modules/@rapideditor/temaki/LICENSE.md',
    },
    roentgen: {
        prefix: 'roentgen-',
        iconsGlob: 'node_modules/@enzet/roentgen/icons/*.svg',
        license: 'node_modules/@enzet/roentgen/LICENSE',
    },
    fontAwesomeSolid: {
        prefix: 'fas-',
        iconsGlob: 'node_modules/@fortawesome/fontawesome-free/svgs-full/solid/*.svg',
        license: 'node_modules/@fortawesome/fontawesome-free/LICENSE.txt',
    },
    fontAwesomeRegular: {
        prefix: 'far-',
        iconsGlob: 'node_modules/@fortawesome/fontawesome-free/svgs-full/regular/*.svg',
        license: 'node_modules/@fortawesome/fontawesome-free/LICENSE.txt',
    },
    fontAwesomeBrands: {
        prefix: 'fab-',
        iconsGlob: 'node_modules/@fortawesome/fontawesome-free/svgs-full/brands/*.svg',
        license: 'node_modules/@fortawesome/fontawesome-free/LICENSE.txt',
    },
    id: {
        prefix: 'id-',
        iconsGlob: [
            'node_modules/@openstreetmap/id/svg/iD-sprite/presets/*.svg',
            'node_modules/@openstreetmap/id/svg/iD-sprite/fields/**/*.svg',
        ],
        license: 'node_modules/@openstreetmap/id/LICENSE.md',
    },
};

const iconsDir = join(import.meta.dirname, '../icons');

await rm(iconsDir, { force: true, recursive: true });
await mkdir(iconsDir);

for (const set of Object.values(iconSets)) {
    const icons = await globby(set.iconsGlob, { cwd: join(import.meta.dirname, '..'), absolute: true });
    for (const icon of icons) {
        await cp(icon, join(iconsDir, set.prefix + basename(icon)));
    }

    await appendFile(
        join(iconsDir, 'LICENSE'),
        `The icons with a filename starting with "${set.prefix}" are licensed under the following license:\n\n${await readFile(join(import.meta.dirname, '..', set.license), 'utf-8')}\n\n`,
    );
}
