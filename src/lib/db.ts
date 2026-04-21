import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'scanner.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    partnumber TEXT NOT NULL,
    qty INTEGER NOT NULL,
    condition TEXT NOT NULL CHECK(condition IN ('good', 'damage')),
    pallet_number TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;