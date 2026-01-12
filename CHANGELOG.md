# Changelog

### Tillagd

- **Browse page logik** - Implementerad grundläggande funktionalitet för filmvisning
- **Movie list component** - Visa filmer med affisch, titel, betyg, utgivningsdatum och beskrivning
- **Sökfunktionalitet** - Sökfält component med formulärhantering
- **Store system** - State management för filmer, sökinmatning och render callbacks
- **TMDB API-integrering** - Hämta populära filmer och sökresultat från TMDB
- **TMDB-routes** - Backend-endpoints för `/api/tmdb` och `/api/tmdb/:name`
- **sql.js-databas** - Migrerad från better-sqlite3 till sql.js
- **Databasverktyg** - Lade till sparning/laddning av sql.js-databas

## Ändrat

- **Projektstruktur** - Organiserade om client filer i `client/`
- **Filmtyp** - Uppdaterade fältnamn för att matcha TMDB API (snake_case: `poster_path`, `release_date`, `vote_average`)
- **Huvudapp-initiering** - Läser nu in populära filmer vid sidladdning via `DOMContentLoaded` event
