# iD presets for JOSM

> Scripts to convert the presets of the iD editor for OpenStreetMap to JOSM presets.

This repository allows you to use the [presets](https://github.com/openstreetmap/id-tagging-schema) from the [iD editor](https://wiki.openstreetmap.org/wiki/ID) in [JOSM](https://josm.openstreetmap.de/). The iD presets are very comprehensive, regularly updated, and [used by many other](https://github.com/openstreetmap/id-tagging-schema/wiki/Projects-that-are-using-this-tagging-schema) OpenStreetMap editors and projects, including Every Door, Go Map!!, Osm Go!, and StreetComplete.

<!-- Apparently, that's the best we can do (https://github.com/george-hawkins/video-in-github-markdown/tree/17fc74a00ecb070d6cbe15a2e3c95aab0d2aba6d9)… -->

https://github.com/user-attachments/assets/6a4a0a88-58f5-4e25-8388-40608cf06158

<details>
<summary>Alt text for the video</summary>
Screen recording of several edits being done in JOSM, including buildings, a solar panel, a POI, and a road. The user makes use of presets for tagging. The preset names all indicate that they are from iD and the fields in the presets match those of the corresponding iD presets.

In particular, the following edits are made:

- The user draws two buildings. For the second, smaller one, they search for "shed" in the preset dialog. A bunch of "iD" presets show up, as well as "Man Made/Man Made/Building" and "Man Made/Man Made/Building Part" from JOSM. They select the "iD: Uncategorized/Shed (hobbies, storage, workshop)" preset. They set "Levels: 1", select a light grey "Roof color", and set "Roof Shape: Gabled (gabled)".
- The user draws and orthogonalizes a solar panel. They search for "pv" and only iD presets show up. They select "iD: Uncategorized/Rooftop Solar Panel (home solar, pv module, rooftop photovoltaic module)". They set "Power Output: small_installation".
- The user adds a point and searches for "general", picking "iD: Uncategorized/Doctor (general practitioner, medic, medical doctor, physician)". The only JOSM preset that shows up is "Shops/Other/General Store". They set "Name: Doris Doctor", select "Allergy & Asthma (allergology)" and "Blood Test (blood_check)" for "Specialities".
- The user draws a segment of a road and searches for "ser", selecting the "iD: Minor Roads/Service Road (road, street)" preset. They set "Name: Josm Road", "Surface: Asphalt  (asphalt)", "Allowed Access/All: Customers (customers), Restricted to customers at the destination". Finally, they set "Bike Lanes: None (no), No bike lane" for both "Left Side" and "Right Side".
</details>

This project started as an experiment. I really enjoy using JOSM and its power user features, but personally prefer the iD presets, which tend to have support for newer tags.[^josm-good] I especially like the terms and aliases included in the iD presets, which make searching for the right preset easy, even if you don't already know the correct tag. But the philosophy between JOSM and iD presets is quite different. So I wanted to see how far I could get converting between the two. Quite far, it turns out. There are some [limitations](#limitations), but much of the features can be mapped well. I have been using this conversion of the iD presets in JOSM for a little while now and really enjoy it.

[^josm-good]: I am not trying to say that the JOSM presets are bad or even that the iD presets are better. They follow different approaches, both of which are valid. If you prefer the JOSM presets, by all means, continue using them. I especially like that I can combine JOSM and iD presets and can choose for each edit which one will work better.

## Installation and usage

To install the presets in JOSM:

1. Open the preferences (*Edit* -> *Preferences*) and go to the *Tagging Presets* tab.
1. On the right side (*Active presets*), click the plus icon.
1. In the dialog that opens, set any *Name* you like (e.g. `id-tagging-schema-to-josm`). Provide the *URL / File* for the preset version you want to use. This depends on the language you want to use and whether you use a light or a dark theme in JOSM.

   To always get the latest presets in English if you are using a light theme, enter:

   ```
   https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-en-light.zip
   ```

   To always get the latest presets in English if you are using a dark theme, enter:

   ```
   https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-en-dark.zip
   ```

   See [below](#other-languages) for other languages. You can also go to the [releases](https://github.com/baltpeter/id-tagging-schema-to-josm/releases) to choose a specific version to pin.
1. You may want to disable the default JOSM presets, otherwise you will get duplicate hits for many presets. You should choose based on your personal preference. Maybe, like me, you enjoy choosing between JOSM and iD presets on a case-by-case basis.
1. Confirm both dialogs with *OK*. Loading the presets may take a few seconds.

After you have installed them, you can use the presets like regular. They will show up in search or the *Presets* menu. You can recognize them by the "iD:" prefix.

### Other languages

You can also use the presets in the following languages:

<!-- This section is generated automatically. Don't edit manually, your changes will be overwritten. -->
<!-- § DOWNLOAD LINKS START § -->
- Brazilian Portuguese (`pt-BR`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-pt-BR-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-pt-BR-dark.zip)
- Breton (`br`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-br-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-br-dark.zip)
- Cantonese (`yue`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-yue-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-yue-dark.zip)
- Catalan (`ca`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ca-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ca-dark.zip)
- Chinese (`zh`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-dark.zip)
- Chinese (China) (`zh-CN`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-CN-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-CN-dark.zip)
- Chinese (Hong Kong SAR China) (`zh-HK`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-HK-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-HK-dark.zip)
- Chinese (Taiwan) (`zh-TW`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-TW-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-zh-TW-dark.zip)
- Croatian (`hr`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-hr-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-hr-dark.zip)
- Czech (`cs`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-cs-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-cs-dark.zip)
- Danish (`da`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-da-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-da-dark.zip)
- Dutch (`nl`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-nl-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-nl-dark.zip)
- Dutch (Netherlands) (`nl-NL`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-nl-NL-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-nl-NL-dark.zip)
- English (`en`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-en-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-en-dark.zip)
- Esperanto (`eo`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-eo-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-eo-dark.zip)
- Estonian (`et`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-et-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-et-dark.zip)
- Finnish (`fi`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-fi-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-fi-dark.zip)
- Flemish (`nl-BE`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-nl-BE-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-nl-BE-dark.zip)
- French (`fr`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-fr-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-fr-dark.zip)
- Gan Chinese (`gan`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-gan-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-gan-dark.zip)
- German (`de`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-de-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-de-dark.zip)
- Greek (`el`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-el-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-el-dark.zip)
- Hebrew (`he`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-he-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-he-dark.zip)
- Hebrew (Israel) (`he-IL`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-he-IL-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-he-IL-dark.zip)
- Hungarian (`hu`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-hu-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-hu-dark.zip)
- Italian (`it`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-it-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-it-dark.zip)
- Japanese (`ja`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ja-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ja-dark.zip)
- Korean (`ko`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ko-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ko-dark.zip)
- Polish (`pl`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-pl-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-pl-dark.zip)
- Portuguese (`pt`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-pt-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-pt-dark.zip)
- Russian (`ru`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ru-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-ru-dark.zip)
- Slovak (`sk`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-sk-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-sk-dark.zip)
- Spanish (`es`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-es-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-es-dark.zip)
- Swedish (`sv`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-sv-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-sv-dark.zip)
- Thai (`th`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-th-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-th-dark.zip)
- Ukrainian (`uk`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-uk-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-uk-dark.zip)
- Vietnamese (`vi`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-vi-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-vi-dark.zip)
- Welsh (`cy`): [light mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-cy-light.zip), [dark mode](https://github.com/baltpeter/id-tagging-schema-to-josm/releases/latest/download/id-presets-cy-dark.zip)
<!-- § DOWNLOAD LINKS END § -->

## Limitations

Presets in iD have a lot more features than presets in JOSM. This project tries to map the iD presets as well as possible, but some aspects are just impossible to implement in a JOSM preset.

As a result, the JOSM presets have the following limitations compared to the original iD presets:

- One of the most useful features of the iD presets are the aliases and search terms, which make finding the correct preset easy. JOSM doesn't have a corresponding concept. To work around this, we add the aliases and terms to the preset name. This works for the search, but JOSM doesn't handle the (very) long preset names gracefully.
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
- Fields in iD presets can specify more than one corresponding key, with [different behaviours based on field type](https://github.com/openstreetmap/id-tagging-schema/blob/e0e844562573fc4ed0644972f4a635e20f5862c4/SCHEMA.md#keykeys). We do implement some of these behaviours correctly, e.g. for `directionalCombo` and `access`. We however don't implement the [logic of which of the `keys` to set/edit based on the current tags](https://github.com/openstreetmap/id-tagging-schema/blob/e0e844562573fc4ed0644972f4a635e20f5862c4/SCHEMA.md#user-content-fn-1-b88261fcbbd4f3f0de38cadd5e5ad670), which would require us to duplicate the presets for each possible combinations are compute corresponding match expressions.
- We are not yet handling the `relation` property of presets, which is currently only used by the `railway/yard` preset.

## Development

### Setup

You'll need to download a dump of the [`taginfo-master` database](https://taginfo.openstreetmap.org/download) to `data/taginfo.db`:

```sh
wget -O /tmp/taginfo-master.db.bz2 https://taginfo.openstreetmap.org/download/taginfo-master.db.bz2
bzcat /tmp/taginfo-master.db.bz2 > data/taginfo.db
```

### Running the scripts

To compile the icons, run `yarn compile-icons`.

Finally, run `yarn build` to build the presets, which will be written to the `out` folder. By default, this will build the presets for all languages. You can optionally pass a language code to only build the presets for that language.

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
* The [default presets](https://josm.openstreetmap.de/browser/trunk/resources/data/defaultpresets.xml) can serve as useful examples to better understand certain aspects of the schema.

For understanding the format of the iD presets:

* The [schema description](https://github.com/openstreetmap/id-tagging-schema/blob/main/SCHEMA.md) is very helpful.
* The [icon docs](https://github.com/openstreetmap/id-tagging-schema/blob/main/ICONS.md) describe how icons should be handled.
* There is however also some additional logic hardcoded into iD, for which you have to read the [source code](https://github.com/openstreetmap/iD).

Prior art:

* https://github.com/simonpoole/preset-utils/blob/master/src/main/java/ch/poole/osm/presetutils/ID2JOSM.java

## License

The scripts in this repository are licensed under the WTFPL license, see the [`LICENSE`](LICENSE) file for details. The presets you can download make use of [id-tagging-schema](https://github.com/openstreetmap/id-tagging-schema) and various icon libraries, which have different licenses. Check the `LICENSE` file included with the downloads for details.

Issues and pull requests are welcome! Please be aware that by contributing, you agree for your work to be licensed under a WTFPL license.
