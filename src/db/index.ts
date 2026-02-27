import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { createTables, createSearchIndexVirtualTable } from '../recall/recall.schema.js';

const db: DatabaseType = new Database('duck-recall.db');

db.exec(createTables);
db.exec(createSearchIndexVirtualTable);

export default db;
