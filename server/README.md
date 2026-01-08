# Movie Watchlist API

A simple Express REST API with SQLite database for managing movie watchlists and watched movies.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Test the API

Visit `http://localhost:3000` in your browser to see available endpoints.

Or use the health check:
```bash
curl http://localhost:3000/api/health
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Send your team ID via the `x-user-id` header with every request:

```javascript
headers: {
  'x-user-id': 'team-1'
}
```

---

## 🎬 Movies Endpoints

### Get All Movies

**GET** `/api/movies`

Get all movies for the current user.

**Query Parameters:**
- `status` (optional): Filter by status (`watchlist` or `watched`)

**Examples:**
```bash
# Get all movies
curl -H "x-user-id: team-1" http://localhost:3000/api/movies

# Get only watchlist
curl -H "x-user-id: team-1" http://localhost:3000/api/movies?status=watchlist

# Get only watched movies
curl -H "x-user-id: team-1" http://localhost:3000/api/movies?status=watched
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": "team-1",
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "release_date": "1999-10-15",
    "vote_average": 8.4,
    "overview": "A ticking-time-bomb insomniac...",
    "status": "watchlist",
    "personal_rating": null,
    "review": null,
    "is_favorite": 0,
    "date_added": "2025-01-15 10:30:00",
    "date_watched": null
  }
]
```

---

### Get Single Movie

**GET** `/api/movies/:id`

Get a specific movie by ID.

**Example:**
```bash
curl -H "x-user-id: team-1" http://localhost:3000/api/movies/1
```

**Response:**
```json
{
  "id": 1,
  "user_id": "team-1",
  "tmdb_id": 550,
  "title": "Fight Club",
  ...
}
```

---

### Add Movie

**POST** `/api/movies`

Add a new movie to watchlist or watched list.

**Required Headers:**
```
Content-Type: application/json
x-user-id: team-1
```

**Required Fields:**
- `tmdb_id` (number): TMDB movie ID
- `title` (string): Movie title
- `status` (string): Either `"watchlist"` or `"watched"`

**Optional Fields:**
- `poster_path` (string): TMDB poster path
- `release_date` (string): Release date
- `vote_average` (number): TMDB rating
- `overview` (string): Movie description
- `personal_rating` (number): Your rating (1-5, only for watched movies)
- `review` (string): Your review text
- `is_favorite` (boolean): Mark as favorite
- `date_watched` (string): Date watched (for watched movies)

**Example:**
```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -H "x-user-id: team-1" \
  -d '{
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "release_date": "1999-10-15",
    "vote_average": 8.4,
    "overview": "A ticking-time-bomb insomniac...",
    "status": "watchlist"
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3000/api/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'team-1'
  },
  body: JSON.stringify({
    tmdb_id: 550,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    overview: 'A ticking-time-bomb insomniac...',
    status: 'watchlist'
  })
});

const movie = await response.json();
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user_id": "team-1",
  "tmdb_id": 550,
  "title": "Fight Club",
  "status": "watchlist",
  ...
}
```

**Error Response (409 Conflict - Duplicate):**
```json
{
  "error": "Movie already exists",
  "hint": "This movie is already in your watchlist or watched list. Try updating it instead."
}
```

---

### Update Movie

**PUT** `/api/movies/:id`

Update a movie (e.g., move from watchlist to watched, add rating/review).

**Required Headers:**
```
Content-Type: application/json
x-user-id: team-1
```

**Optional Fields (provide at least one):**
- `status` (string): Change status to `"watchlist"` or `"watched"`
- `personal_rating` (number): Your rating (1-5)
- `review` (string): Your review text
- `is_favorite` (boolean): Mark as favorite
- `date_watched` (string): Date watched

**Example - Mark as Watched:**
```bash
curl -X PUT http://localhost:3000/api/movies/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: team-1" \
  -d '{
    "status": "watched",
    "personal_rating": 5,
    "review": "One of the best movies ever!",
    "date_watched": "2025-01-15"
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3000/api/movies/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'team-1'
  },
  body: JSON.stringify({
    status: 'watched',
    personal_rating: 5,
    review: 'One of the best movies ever!',
    date_watched: '2025-01-15'
  })
});

const updatedMovie = await response.json();
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": "team-1",
  "tmdb_id": 550,
  "title": "Fight Club",
  "status": "watched",
  "personal_rating": 5,
  "review": "One of the best movies ever!",
  ...
}
```

---

### Delete Movie

**DELETE** `/api/movies/:id`

Delete a movie from your list.

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/movies/1 \
  -H "x-user-id: team-1"
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3000/api/movies/1', {
  method: 'DELETE',
  headers: {
    'x-user-id': 'team-1'
  }
});

const result = await response.json();
```

**Response (200 OK):**
```json
{
  "message": "Movie deleted successfully",
  "movie": {
    "id": 1,
    "title": "Fight Club",
    ...
  }
}
```

---

### Get User Statistics

**GET** `/api/movies/user/stats`

Get statistics for the current user.

**Example:**
```bash
curl -H "x-user-id: team-1" http://localhost:3000/api/movies/user/stats
```

**Response:**
```json
{
  "totalMovies": 25,
  "watchlistCount": 10,
  "watchedCount": 15,
  "favoritesCount": 8,
  "averageRating": 4.2
}
```

---

## 🔍 Testing the API

### Using Browser
Visit `http://localhost:3000` to see all available endpoints.

### Using curl
```bash
# Health check
curl http://localhost:3000/api/health

# Get all movies
curl -H "x-user-id: team-1" http://localhost:3000/api/movies
```

### Using Browser DevTools Console
```javascript
// Add movie to watchlist
const response = await fetch('http://localhost:3000/api/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'team-1'
  },
  body: JSON.stringify({
    tmdb_id: 550,
    title: 'Fight Club',
    status: 'watchlist'
  })
});

const movie = await response.json();
console.log(movie);
```

---

## 📊 Database Schema

### Movies Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | TEXT | Team identifier (from x-user-id header) |
| tmdb_id | INTEGER | TMDB movie ID |
| title | TEXT | Movie title |
| poster_path | TEXT | TMDB poster path |
| release_date | TEXT | Release date |
| vote_average | REAL | TMDB rating |
| overview | TEXT | Movie description |
| status | TEXT | "watchlist" or "watched" |
| personal_rating | INTEGER | Your rating (1-5) |
| review | TEXT | Your review |
| is_favorite | INTEGER | 0 or 1 (boolean) |
| date_added | TEXT | Timestamp when added |
| date_watched | TEXT | Date watched (for watched movies) |

**Constraints:**
- `UNIQUE(user_id, tmdb_id)` - Prevents duplicate movies per user
- `CHECK(status IN ('watchlist', 'watched'))` - Only valid statuses
- `CHECK(personal_rating BETWEEN 1 AND 5)` - Rating must be 1-5

---

## 🛠️ Available Scripts

```bash
# Start server in development mode (with auto-reload)
npm run dev

# Start server in production mode
npm start

# Reset database (deletes all data and recreates tables)
npm run reset-db
```

---

## ❌ Common Errors

### 1. "Failed to fetch"
**Problem:** Backend server is not running

**Solution:** Make sure you started the server with `npm run dev`

### 2. CORS Errors
**Problem:** Browser blocking requests

**Solution:** CORS is already enabled in this API. Make sure you're using the correct URL (`http://localhost:3000`)

### 3. "Movie already exists"
**Problem:** Trying to add a movie that's already in your list

**Solution:** Each user can only have one entry per TMDB movie. Use PUT to update it instead.

### 4. 404 Not Found
**Problem:** Wrong endpoint or movie doesn't exist

**Solution:** Check the endpoint URL and make sure the movie belongs to your user_id

---

## 💡 Tips for Students

1. **Always include `x-user-id` header** - This is how the API knows which team's data to access

2. **Check the Network tab** - Open Browser DevTools → Network tab to see all requests and responses

3. **Status must be exact** - Use `"watchlist"` or `"watched"` (lowercase, exact spelling)

4. **Test with Postman or curl first** - Before integrating into your frontend, test endpoints directly

5. **Read error messages** - Error responses include helpful hints

6. **Use async/await** - All fetch calls should use async/await or .then()

7. **Handle loading states** - API calls take time, show loading indicators

8. **Handle errors** - Always use try/catch with fetch calls

---

## 🔧 Troubleshooting

### Database Issues
If you encounter database errors, reset it:
```bash
npm run reset-db
```

### Port Already in Use
If port 3000 is already in use, create a `.env` file:
```bash
PORT=3001
```

### Can't Connect from Frontend
Make sure:
1. Backend is running (`npm run dev` in server folder)
2. Using correct URL: `http://localhost:3000`
3. Including `x-user-id` header
4. CORS is enabled (it is by default)

---

## 📝 Example Frontend Integration

```typescript
// src/services/movieApi.ts
const API_BASE_URL = 'http://localhost:3000/api';
const USER_ID = 'team-1'; // Your team ID

export async function getWatchlist(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies?status=watchlist`, {
    headers: {
      'x-user-id': USER_ID
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch watchlist');
  }

  return await response.json();
}

export async function addToWatchlist(movie: Movie): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID
    },
    body: JSON.stringify({
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.posterPath,
      release_date: movie.releaseDate,
      vote_average: movie.voteAverage,
      overview: movie.overview,
      status: 'watchlist'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add movie');
  }
}

export async function markAsWatched(
  movieId: number,
  rating: number,
  review?: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID
    },
    body: JSON.stringify({
      status: 'watched',
      personal_rating: rating,
      review: review,
      date_watched: new Date().toISOString().split('T')[0]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update movie');
  }
}

export async function deleteMovie(movieId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': USER_ID
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete movie');
  }
}

export async function getStats(): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/movies/user/stats`, {
    headers: {
      'x-user-id': USER_ID
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return await response.json();
}
```

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [MDN: HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## 📄 License

MIT - Free to use for educational purposes
