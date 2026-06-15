/**
 * A reusable form element for presets
 */
export type ItsField = {
    /**
     * If true, the top values from TagInfo will be suggested in the dropdown (combo fields only)
     */
    autoSuggestions?: boolean;
    /**
     * If true, allow case sensitive field values (combo fields only)
     */
    caseSensitive?: boolean;
    /**
     * If true, the user can type their own value in addition to any listed in `options` or
     * `strings.options` (combo fields only)
     */
    customValues?: boolean;
    /**
     * The default value for this field
     */
    default?: string;
    /**
     * If specified, only show the field for these kinds of geometry
     */
    geometry?: Geometry[];
    /**
     * For combo fields: Name of icons which represents different values of this field
     */
    icons?: { [key: string]: any };
    /**
     * A field can reference icons of another by using that field's identifier contained in
     * brackets, like {field}.
     */
    iconsCrossReference?: string;
    /**
     * The amount the stepper control should add or subtract (number fields only)
     */
    increment?: number;
    /**
     * Tag key whose value is to be displayed
     */
    key?: string;
    /**
     * Tag keys whose value is to be displayed
     */
    keys?: string[];
    /**
     * English label for the field caption. A field can reference the label of another by using
     * that field's identifier contained in brackets (e.g. {field}), in which case also the
     * field's terms will be referenced from that field.
     */
    label: string;
    /**
     * An object specifying the IDs of regions where this field is or isn't valid. See:
     * https://github.com/ideditor/location-conflation
     */
    locationSet?: LocationSet;
    /**
     * Maximum field value (number fields only)
     */
    maxValue?: number;
    /**
     * Minimum field value (number fields only)
     */
    minValue?: number;
    /**
     * List of untranslatable string suggestions (combo fields)
     */
    options?: string[];
    /**
     * Regular expression that a valid `identifier` value is expected to match
     */
    pattern?: string;
    /**
     * Placeholder text for this field. A field can reference the placeholder text of another by
     * using that field's identifier contained in brackets, like {field}.
     */
    placeholder?: string;
    /**
     * Tagging constraint for showing this field in the editor
     */
    prerequisiteTag?: PrerequisiteTag;
    /**
     * Taginfo documentation parameters (to be used when a field manages multiple tags)
     */
    reference?: Reference;
    /**
     * If true, replace spaces with underscores in the tag value (combo fields only)
     */
    snake_case?: boolean;
    /**
     * Strings sent to transifex for translation
     */
    strings?: Strings;
    /**
     * A field can reference strings of another by using that field's identifier contained in
     * brackets, like {field}.
     */
    stringsCrossReference?: string;
    /**
     * English synonyms or related search terms
     */
    terms?: string[];
    /**
     * Type of field
     */
    type: Type;
    /**
     * If true, this field will appear in the Add Field list for all presets
     */
    universal?: boolean;
    /**
     * Permalink URL for `identifier` fields. Must contain a {value} placeholder
     */
    urlFormat?: string;
    /**
     * The manner and context in which the field is used
     */
    usage?: Usage;
}

export type Geometry = "point" | "vertex" | "line" | "area" | "relation";

/**
 * An object specifying the IDs of regions where this field is or isn't valid. See:
 * https://github.com/ideditor/location-conflation
 */
export type LocationSet = {
    exclude?: string[];
    include?: string[];
}

/**
 * Tagging constraint for showing this field in the editor
 */
export type PrerequisiteTag = {
    /**
     * The key of the required tag
     */
    key?: string;
    /**
     * The value that the tag must have. (alternative to 'valueNot')
     */
    value?: string;
    /**
     * The value that the tag cannot have. (alternative to 'value')
     */
    valueNot?: string;
    /**
     * A key that must not be present
     */
    keyNot?: string;
}

/**
 * Taginfo documentation parameters (to be used when a field manages multiple tags)
 */
export type Reference = {
    /**
     * For documentation of a key
     */
    key?: string;
    /**
     * For documentation of a tag (key and value)
     */
    value?: string;
    /**
     * For documentation of a relation type
     */
    rtype?: string;
}

/**
 * Strings sent to transifex for translation
 */
export type Strings = {
    /**
     * Translatable options (combo fields).
     */
    options?: { [key: string]: any };
    [property: string]: { [key: string]: any } | undefined;
}

/**
 * Type of field
 */
export type Type = "address" | "directionalCombo" | "email" | "number" | "restrictions" | "tel" | "text" | "url" | "wikidata" | "wikipedia";

/**
 * The manner and context in which the field is used
 */
export type Usage = "preset" | "changeset" | "manual" | "group";
