/**
 * Associates an icon, form fields, and other UI with a set of OSM tags
 */
export type ItsPreset = {
    /**
     * Tags that are added when changing to the preset (default is the same value as 'tags')
     */
    addTags?: { [key: string]: string };
    /**
     * Display-ready English synonyms for the `name`
     */
    aliases?: string[];
    /**
     * Default form fields that are displayed for the preset. A preset can reference the fields
     * of another by using that preset's identifier contained in brackets, like {preset}.
     */
    fields?: string[];
    /**
     * Valid geometry types for the feature, in order of preference
     */
    geometry: Geometry[];
    /**
     * Name of preset icon which represents this preset
     */
    icon?: string;
    /**
     * The URL of a remote image that is more specific than 'icon'
     */
    imageURL?: string;
    /**
     * An object specifying the IDs of regions where this preset is or isn't valid. See:
     * https://github.com/ideditor/location-conflation
     */
    locationSet?: LocationSet;
    /**
     * The quality score this preset will receive when being compared with other matches (higher
     * is better)
     */
    matchScore?: number;
    /**
     * Additional form fields that can be attached with the 'Add field' dropdown. A preset can
     * reference the "moreFields" of another by using that preset's identifier contained in
     * brackets, like {preset}.
     */
    moreFields?: string[];
    /**
     * The English name for the feature. A preset can reference the label of another by using
     * that preset's identifier contained in brackets (e.g. {preset}), in which case also the
     * preset's aliases and terms will also be referenced from that preset.
     */
    name: string;
    /**
     * Taginfo documentation parameters (to be used when a preset manages multiple tags)
     */
    reference?: Reference;
    /**
     * Tags that are removed when changing to another preset (default is the same value as
     * 'addTags' which in turn defaults to 'tags')
     */
    removeTags?: { [key: string]: string };
    /**
     * The ID of a preset that is preferable to this one
     */
    replacement?: string;
    /**
     * Whether or not the preset will be suggested via search
     */
    searchable?: boolean;
    /**
     * Tags that must be present for the preset to match
     */
    tags: { [key: string]: string };
    /**
     * English search terms or related keywords
     */
    terms?: string[];
}

export type Geometry = "point" | "vertex" | "line" | "area" | "relation";

/**
 * An object specifying the IDs of regions where this preset is or isn't valid. See:
 * https://github.com/ideditor/location-conflation
 */
export type LocationSet = {
    exclude?: string[];
    include?: string[];
}

/**
 * Taginfo documentation parameters (to be used when a preset manages multiple tags)
 */
export type Reference = {
    /**
     * For documentation of a key
     */
    key: string;
    /**
     * For documentation of a tag (key and value)
     */
    value?: string;
}
