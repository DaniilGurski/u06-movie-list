import express, { Request, Response } from 'express';
import db, { saveDatabase } from '../database.js';

const router = express.Router();

type MovieStatus = 'watchlist' | 'watched';

interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  overview: string | null;
  status: MovieStatus;
  personal_rating: number | null;
  review: string | null;
  is_favorite: number;
  date_added: string;
  date_watched: string | null;
}

interface CreateMovieBody {
  tmdb_id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  overview?: string | null;
  status: MovieStatus;
  personal_rating?: number | null;
  review?: string | null;
  is_favorite?: boolean;
  date_watched?: string | null;
}

interface UpdateMovieBody {
  status?: MovieStatus;
  personal_rating?: number | null;
  review?: string | null;
  is_favorite?: boolean;
  date_watched?: string | null;
}

interface StatsResponse {
  totalMovies: number;
  watchlistCount: number;
  watchedCount: number;
  favoritesCount: number;
  averageRating: number;
}

/**
 * GET /api/movies
 * Hämta alla filmer
 * Query params: ?status=watchlist|watched
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { status } = req.query as { status?: MovieStatus };

    let query = 'SELECT * FROM movies';
    const params: unknown[] = [];

    // Filtrera på status om den skickas in
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY date_added DESC';

    const stmt = db.prepare(query);
    stmt.bind(params);
    const movies: Movie[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      movies.push(row as unknown as Movie);
    }
    stmt.free();

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      error: 'Failed to fetch movies',
      message: (error as Error).message
    });
  }
});

/**
 * GET /api/movies/:id
 * Hämta en specifik film via ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('SELECT * FROM movies WHERE id = ?');
    stmt.bind([id]);
    let movie: Movie | undefined;
    if (stmt.step()) {
      movie = stmt.getAsObject() as unknown as Movie;
    }
    stmt.free();

    if (!movie) {
      return res.status(404).json({
        error: 'Movie not found',
        hint: 'Make sure the movie exists and belongs to your user'
      });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      error: 'Failed to fetch movie',
      message: (error as Error).message
    });
  }
});

/**
 * POST /api/movies
 * Lägg till en ny film (i watchlist eller watched)
 * Body: { tmdb_id, title, poster_path, release_date, vote_average, overview, status, personal_rating?, review?, is_favorite?, date_watched? }
 */
router.post('/', (req: Request<unknown, unknown, CreateMovieBody>, res: Response) => {
  try {
    const {
      tmdb_id,
      title,
      poster_path,
      release_date,
      vote_average,
      overview,
      status,
      personal_rating,
      review,
      is_favorite,
      date_watched
    } = req.body;

    // Validering
    if (!tmdb_id || !title || !status) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['tmdb_id', 'title', 'status'],
        hint: 'Make sure to include tmdb_id, title, and status (watchlist or watched)'
      });
    }

    if (!['watchlist', 'watched'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        hint: 'Status must be either "watchlist" or "watched"'
      });
    }

    // Om status är "watched", validera personal_rating
    if (status === 'watched' && personal_rating != null) {
      if (personal_rating < 1 || personal_rating > 5) {
        return res.status(400).json({
          error: 'Invalid personal_rating',
          hint: 'Personal rating must be between 1 and 5'
        });
      }
    }

    // Spara filmen i databasen
    const stmt = db.prepare(`
      INSERT INTO movies (
        tmdb_id, title, poster_path, release_date,
        vote_average, overview, status, personal_rating,
        review, is_favorite, date_watched
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.bind([
      tmdb_id,
      title,
      poster_path || null,
      release_date || null,
      vote_average || null,
      overview || null,
      status,
      personal_rating ?? null,
      review ?? null,
      is_favorite ? 1 : 0,
      date_watched || null
    ]);
    stmt.step();
    const lastInsertRowid = db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0] as number;
    stmt.free();

    // Spara databasen
    saveDatabase();

    // Hämta den skapade filmen
    const getStmt = db.prepare('SELECT * FROM movies WHERE id = ?');
    getStmt.bind([lastInsertRowid]);
    let movie: Movie | undefined;
    if (getStmt.step()) {
      movie = getStmt.getAsObject() as unknown as Movie;
    }
    getStmt.free();

    res.status(201).json(movie);
  } catch (error) {
    // Hantera dubblett (UNIQUE constraint-överträdelser)
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'Movie already exists',
        hint: 'This movie is already in your watchlist or watched list. Try updating it instead.'
      });
    }

    console.error('Error creating movie:', error);
    res.status(500).json({
      error: 'Failed to create movie',
      message: (error as Error).message
    });
  }
});

/**
 * PUT /api/movies/:id
 * Uppdatera en film (t.ex. flytta från watchlist till watched, uppdatera betyg/recension)
 * Body: { status?, personal_rating?, review?, is_favorite?, date_watched? }
 */
router.put('/:id', (req: Request<{ id: string }, unknown, UpdateMovieBody>, res: Response) => {
  try {
    const { id } = req.params;
    const {
      status,
      personal_rating,
      review,
      is_favorite,
      date_watched
    } = req.body;

    // Kolla om filmen finns
    const checkStmt = db.prepare('SELECT * FROM movies WHERE id = ?');
    checkStmt.bind([id]);
    let existingMovie: Movie | undefined;
    if (checkStmt.step()) {
      existingMovie = checkStmt.getAsObject() as unknown as Movie;
    }
    checkStmt.free();

    if (!existingMovie) {
      return res.status(404).json({
        error: 'Movie not found',
        hint: 'Make sure the movie exists and belongs to your user'
      });
    }

    // Validera status om den skickas in
    if (status && !['watchlist', 'watched'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        hint: 'Status must be either "watchlist" or "watched"'
      });
    }

    // Validera personal_rating om den skickas in
    if (personal_rating !== undefined && personal_rating !== null) {
      if (personal_rating < 1 || personal_rating > 5) {
        return res.status(400).json({
          error: 'Invalid personal_rating',
          hint: 'Personal rating must be between 1 and 5'
        });
      }
    }

    // Bygg upp en dynamisk UPDATE-query baserat på vilka fält som skickats in
    const updates: string[] = [];
    const params: unknown[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (personal_rating !== undefined) {
      updates.push('personal_rating = ?');
      params.push(personal_rating);
    }
    if (review !== undefined) {
      updates.push('review = ?');
      params.push(review);
    }
    if (is_favorite !== undefined) {
      updates.push('is_favorite = ?');
      params.push(is_favorite ? 1 : 0);
    }
    if (date_watched !== undefined) {
      updates.push('date_watched = ?');
      params.push(date_watched);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        hint: 'Provide at least one field to update'
      });
    }

    // Lägg till parametrar till WHERE-villkoret
    params.push(id);

    // Uppdatera filmen
    const query = `
      UPDATE movies
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    const updateStmt = db.prepare(query);
    updateStmt.bind(params);
    updateStmt.step();
    updateStmt.free();

    // Spara databasen
    saveDatabase();

    // Hämta uppdaterad film
    const getStmt = db.prepare('SELECT * FROM movies WHERE id = ?');
    getStmt.bind([id]);
    let movie: Movie | undefined;
    if (getStmt.step()) {
      movie = getStmt.getAsObject() as unknown as Movie;
    }
    getStmt.free();

    res.json(movie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({
      error: 'Failed to update movie',
      message: (error as Error).message
    });
  }
});

/**
 * DELETE /api/movies/:id
 * Ta bort en film
 */
router.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Kolla om filmen finns
    const checkStmt = db.prepare('SELECT * FROM movies WHERE id = ?');
    checkStmt.bind([id]);
    let movie: Movie | undefined;
    if (checkStmt.step()) {
      movie = checkStmt.getAsObject() as unknown as Movie;
    }
    checkStmt.free();

    if (!movie) {
      return res.status(404).json({
        error: 'Movie not found',
        hint: 'Make sure the movie exists and belongs to your user'
      });
    }

    // Ta bort filmen
    const deleteStmt = db.prepare('DELETE FROM movies WHERE id = ?');
    deleteStmt.bind([id]);
    deleteStmt.step();
    deleteStmt.free();

    // Spara databasen
    saveDatabase();

    res.json({
      message: 'Movie deleted successfully',
      movie
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      error: 'Failed to delete movie',
      message: (error as Error).message
    });
  }
});

/**
 * GET /api/movies/user/stats
 * Hämta statistik för alla sparade filmer
 */
router.get('/user/stats', (req: Request, res: Response) => {
  try {
    // Räkna totalt antal filmer
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM movies');
    totalStmt.step();
    const totalMovies = (totalStmt.getAsObject() as { count: number }).count;
    totalStmt.free();

    // Räkna antal watchlist-filmer
    const watchlistStmt = db.prepare('SELECT COUNT(*) as count FROM movies WHERE status = "watchlist"');
    watchlistStmt.step();
    const watchlistCount = (watchlistStmt.getAsObject() as { count: number }).count;
    watchlistStmt.free();

    // Räkna antal watched-filmer
    const watchedStmt = db.prepare('SELECT COUNT(*) as count FROM movies WHERE status = "watched"');
    watchedStmt.step();
    const watchedCount = (watchedStmt.getAsObject() as { count: number }).count;
    watchedStmt.free();

    // Räkna antal favoriter
    const favoritesStmt = db.prepare('SELECT COUNT(*) as count FROM movies WHERE is_favorite = 1');
    favoritesStmt.step();
    const favoritesCount = (favoritesStmt.getAsObject() as { count: number }).count;
    favoritesStmt.free();

    // Beräkna genomsnittligt personligt betyg
    const avgStmt = db.prepare('SELECT AVG(personal_rating) as avg FROM movies WHERE personal_rating IS NOT NULL');
    let avgRating: number | null = null;
    if (avgStmt.step()) {
      const avgRow = avgStmt.getAsObject() as { avg: number | null };
      avgRating = avgRow.avg;
    }
    avgStmt.free();

    const response: StatsResponse = {
      totalMovies,
      watchlistCount,
      watchedCount,
      favoritesCount,
      averageRating: avgRating ? Number(avgRating.toFixed(2)) : 0
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: (error as Error).message
    });
  }
});

export default router;


