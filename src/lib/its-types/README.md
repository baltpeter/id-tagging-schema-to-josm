The types in this folder are automatically generated using [quicktype](https://github.com/quicktype/quicktype) from the [schemas distributed with ideditor/schema-builder](https://github.com/ideditor/schema-builder/tree/main/schemas) like so:

```sh
yarn quicktype -s schema node_modules/@ideditor/schema-builder/schemas/field.json -o src/lib/its-types/ItsField.ts --just-types --acronym-style original --prefer-unions --prefer-types
yarn quicktype -s schema node_modules/@ideditor/schema-builder/schemas/preset.json -o src/lib/its-types/ItsPreset.ts --just-types --acronym-style original --prefer-unions --prefer-types
```

They need to be updated manually when the schemas change. After updating `ItsField.ts`, you will probably need to update the `Strings` type due to a quick type bug with objects with optional properties and index signatures:

```ts
export type Strings = {
    options?: { [key: string]: any };
    // Add the `| undefined` here.
    //                                         vvvvvvvvvvv
    [property: string]: { [key: string]: any } | undefined;
}
```
