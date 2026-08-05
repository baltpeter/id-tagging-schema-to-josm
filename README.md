## Limitations

Presets in iD have a lot more features than presets in JOSM. This project tries to map the iD presets as well as possible, but some aspects are just impossible to implement in a JOSM preset.

As a result, the JOSM presets have the following limitations compared to the original iD presets:

- iD has various specialized field types that add format restrictions or input helpers. Implementing those in JOSM isn't possible, which is why the following field types are treated as simple text fields: `localized`, `textarea`, `date`, `wikidata`, `wikipedia`, and the following field types are treated as simple check boxes: `defaultCheck`, `onewayCheck`.
- JOSM doesn't have a proper equivalent of iD's `semiCombo` field type. The closest match is a `multiselect` (which we use), however the key difference is that users can't add their own values to those. To at least somewhat work around this, we replace the `multiselect` with a text field if we don't have any options to present anyway. This is also our workaround for `semiCombo`s with `allowDuplicates: true`.
- Radio buttons are implemented as combo boxes due to lack of JOSM support.
- We can't implement all properties of fields and can only implement some of them partially:
    - We use `caseSensitive` only for the Taginfo suggestions. It's not possible to transform values users add into a combobox to lowercase. 
    - We ignore the following properties of fields because they have no equivalent in JOSM: `placeholder`, `terms`, `snake_case`, `minValue`, `maxValue`, `pattern`, `urlFormat`, `increment` (`auto_increment` is not compatible; the buttons don't adjust the entered value but control what the value of the next object with this preset will be), `prerequisiteTag`
- Presets and fields in iD can use the `locationSet` property to only show them in or exclude them from certain regions. The corresponding `regions` and `exclude_regions` properties in JOSM are a lot less powerful. They don't hide the irrelevant presets/fields but only [produces a validation error](https://josm.openstreetmap.de/ticket/23290#comment:5) when uploading.
- iD [removes tags on preset change](https://github.com/openstreetmap/id-tagging-schema/issues/2494) (which can be augmented using `removeTags`). JOSM has a different philosophy where presets are not mutually exclusive, so we can't do this.
- Matching rules are only partially implemented:
    - We ignore the `matchScore` as JOSM has no equivalent mechanism. It always shows all matching presets. It _might_ be possible to emulate this with a very complex `match_expression` that takes into account all other presets.
    - Because JOSM and iD presets specify tag matching rules at different levels, we have to duplicate all field `<chunks>`. I tried replacing this with a `match_expression`, which would be a lot simpler but it looks like that can only exclude but not add matches.

The following features could be implemented but are currently not:

- Field types
    - `structureRadio`: This needs quite a bit of logic that isn't documented anywhere but only hardcoded in iD.
    - `restrictions`: This isn't actually used in any preset. Based on the [documentation](https://github.com/openstreetmap/id-tagging-schema/blob/e0e844562573fc4ed0644972f4a635e20f5862c4/SCHEMA.md#special), it sounds like it would also need special UI, but it isn't clear what that should look like.
- We ignore the `options` property of checkboxes, which would explain what the checkbox values mean. While JOSM have a mechanism for that with checkboxes, we could replace checkboxes that have `options` specified with a combo field.

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
