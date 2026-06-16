import { globby } from 'globby';
import { appendFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';

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
        prefix: 'iD-',
        iconsGlob: [
            'node_modules/@openstreetmap/id/svg/iD-sprite/presets/*.svg',
            'node_modules/@openstreetmap/id/svg/iD-sprite/fields/**/*.svg',
        ],
        license: 'node_modules/@openstreetmap/id/LICENSE.md',
    },
};

const iconsDir = join(import.meta.dirname, '../icons');

await rm(iconsDir, { force: true, recursive: true });
await mkdir(join(iconsDir, 'light'), { recursive: true });
await mkdir(join(iconsDir, 'dark'), { recursive: true });

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

for (const set of Object.values(iconSets)) {
    const icons = await globby(set.iconsGlob, { cwd: join(import.meta.dirname, '..'), absolute: true });

    // Light mode icons.
    for (const icon of icons) {
        await cp(icon, join(iconsDir, 'light', set.prefix + basename(icon)));
    }

    // Dark mode icons.
    for (const icon of icons) {
        const outFile = join(iconsDir, 'dark', set.prefix + basename(icon));

        try {
            const elem = document.createElement('svg');

            const raw = await readFile(icon, 'utf-8');
            const svg = SVG(elem).svg(raw);
            // This would have been nicer, especially in combination with a `prefers-color-scheme` but JOSM doesn't
            // appear to support that.
            // svg.find('svg')[0].element('style').words('path, rect { filter: invert(93%) hue-rotate(180deg); }');
            const elems = svg.find('path, rect');
            for (const elem of elems) elem.fill('#fff');

            await writeFile(outFile, svg.node.innerHTML);
        } catch (err) {
            // Some iD icons are just not (strictly) valid SVG. But since they tend to be multicolor anyway, it's fine
            // to just copy them.
            if (set.prefix !== 'iD-') console.error('Failed to convert icon:', icon, err);
            await cp(icon, outFile);
        }
    }

    await appendFile(
        join(iconsDir, 'LICENSE'),
        `The icons with a filename starting with "${set.prefix}" are licensed under the following license:\n\n${await readFile(join(import.meta.dirname, '..', set.license), 'utf-8')}\n\n`,
    );
}
