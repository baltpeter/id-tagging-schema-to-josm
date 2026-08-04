import { join } from 'node:path';
import sqlite3 from 'better-sqlite3';

const taginfoDbPath = join(import.meta.dirname, '../../data/taginfo.db');
const db = sqlite3(taginfoDbPath, { readonly: true });

const suggestionsStmt = db.prepare<[string], string>(
    `select value from suggestions where key=? and value is not null;`,
);
suggestionsStmt.pluck(true);
/**
 * Get Taginfo value suggestions for the specified key.
 *
 * This is not quite the same as iD is doing. iD calls the Taginfo API, while we only use the `taginfo-master` database
 * which contains fewer suggestions. Since, for JOSM, we need to provide the suggestions at compile time, we'd need to
 * do thousands of calls to the API for each compile, which is just not possible.
 *
 * The other alternative would be to download the full `taginfo-db` database, but that weighs a healthy 40 GB.
 */
export const taginfoSuggestions = (key: string) => suggestionsStmt.all(key);

const taginfoPrefixedKeySuggestionsStmt = db.prepare<[number, string], string>(
    `select distinct substr(lower(key), ?) from (select key from popular_keys union select key from project_unique_keys) where key like ?;`,
);
taginfoPrefixedKeySuggestionsStmt.pluck(true);
const taginfoPrefixedKeySuggestionsCaseSensitiveStmt = db.prepare<[number, string], string>(
    `select distinct substr(key, ?) from (select key from popular_keys union select key from project_unique_keys) where key like ?;`,
);
taginfoPrefixedKeySuggestionsCaseSensitiveStmt.pluck(true);
/**
 * Get Taginfo key suggestions for common suffixes of the specified key prefix.
 *
 * @hint For the key prefix `communication:`, you would get (among others) the following results:
 *      - `2g` (matching the `communication:2g` key)
 *      - `3g` (matching the `communication:3g` key)
 *      - `amateur_radio:pota` (matching the `communication:amateur_radio:pota` key)
 */
export const taginfoPrefixedKeySuggestions = (key: string, caseSensitive: boolean) =>
    (caseSensitive ? taginfoPrefixedKeySuggestionsCaseSensitiveStmt : taginfoPrefixedKeySuggestionsStmt)
        .all(key.length + 1, key + '%')
        .filter(Boolean);
