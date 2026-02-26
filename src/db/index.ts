import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { createTables } from '../recall/recall.schema.js';

const db: DatabaseType = new Database('duck-recall.db');

db.exec(createTables);

export default db;
