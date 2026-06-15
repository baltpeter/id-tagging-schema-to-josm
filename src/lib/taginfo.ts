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
