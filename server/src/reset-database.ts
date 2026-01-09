import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { unlinkSync, existsSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../database.db');

console.log('🗑️  Återställer databasen...');

// Ta bort databasen om filen finns
if (existsSync(dbPath)) {
  unlinkSync(dbPath);
  console.log('✓ Tog bort befintlig databas');
}

// Initiera sql.js
const require = createRequire(import.meta.url);
const sqlJsPath = require.resolve('sql.js');
const sqlJsDir = dirname(sqlJsPath);

const SQL = await initSqlJs({
  locateFile: (file: string) => {
    return join(sqlJsDir, file);
  }
});

// Skapa ny databas
const db = new SQL.Database();

// Slå på foreign keys
db.run('PRAGMA foreign_keys = ON');

// Skapa tabeller (en databas per projekt, ingen användaruppdelning)
const createMoviesTable = `
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    release_date TEXT,
    vote_average REAL,
    overview TEXT,
    status TEXT NOT NULL CHECK(status IN ('watchlist', 'watched')),
    personal_rating INTEGER CHECK(personal_rating BETWEEN 1 AND 5),
    review TEXT,
    is_favorite INTEGER DEFAULT 0,
    date_added TEXT DEFAULT (datetime('now')),
    date_watched TEXT,
    UNIQUE(tmdb_id)
  )
`;

db.run(createMoviesTable);

// Spara databasen
const data = db.export();
const buffer = Buffer.from(data);
writeFileSync(dbPath, buffer);

console.log('✓ Skapade nya databastabeller');
console.log('');
console.log('✅ Databasåterställning klar!');
console.log('   Du kan nu starta servern med: npm run dev');

db.close();
