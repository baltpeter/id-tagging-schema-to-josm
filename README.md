## Limitations

Presets in iD have a lot more features than presets in JOSM. This project tries to map the iD presets as well as possible, but some aspects are just impossible to implement in a JOSM preset.

As a result, the JOSM presets we have the following limitations compared to the original iD presets:

- We ignore the following properties of fields because they have no equivalent in JOSM: `placeholder`, `terms`

## Development

### Setup

You'll need to download a dump of the [`taginfo-master` database](https://taginfo.openstreetmap.org/download) to `data/taginfo.db`:

```sh
wget -O /tmp/taginfo-master.db.bz2 https://taginfo.openstreetmap.org/download/taginfo-master.db.bz2
bzcat /tmp/taginfo-master.db.bz2 > data/taginfo.db
```

### Usage

To compile the icons, run `yarn compile-icons`.

Finally, run `yarn build` to build the presets, which will be written to the `out` folder.

### Reloading the presets in JOSM

For development, you will obviously want to test changes you made to the presets in JOSM. However, JOSM [doesn't support](https://josm.openstreetmap.de/ticket/8933) force-reloading presets. You are [supposed to](https://josm.openstreetmap.de/wiki/Presets#UpdatingAvailablepresetsinJOSM) manually delete the cache and then restart JOSM.

Instead, I start a local web server and append a cache-buster parameter to the URL (e.g. `https://localhost:5500/out/id-presets.xml?cachebuster=1`). This way, I only need to increment the parameter in the preset settings whenever I want to reload (though note that this will pollute your cache folder quite a bit).

### Snippets

#### Finding all actually used `locationSet` values

iD supports [very complex](https://github.com/ideditor/location-conflation) values for including or excluding regions. But are those actually used in practice?

```js
new Set(
    [...Object.values(idPresets), ...Object.values(idFields)]
        .map((p) => [...(p.locationSet?.exclude || []), ...(p.locationSet?.include || [])])
        .flat()
        .map((e) => e.toLowerCase()),
);
```

### Resources

For understanding the format of JOSM presets:

* The [Tagging Presets docs](https://josm.openstreetmap.de/wiki/TaggingPresets) on the JOSM wiki cover most of the important stuff.
* The [Customising JOSM Presets](https://wiki.openstreetmap.org/wiki/Customising_JOSM_Presets) page on the OSM wiki is incomplete but adds some useful context for some properties.
* For more advanced stuff, you have to read the [XSD schema](https://josm.openstreetmap.de/browser/josm/trunk/resources/data/tagging-preset.xsd).

Prior art:

* https://github.com/simonpoole/preset-utils/blob/master/src/main/java/ch/poole/osm/presetutils/ID2JOSM.java
