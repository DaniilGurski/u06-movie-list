README.md

# MaybeMovies - a full-stack movie watchlist and tracking application

MaybeMovies lets users browse movies, maintain a watchlist, and track watched movies with personal ratings and reviews.

This project was built by Team 6 as part of a school assignment at Chas Academy: Douglas, Isak, Ernest, Adam and Daniil.

## Main features

### Browse Movies
View popular movies or search using TMDB (The Movie Database)

### Watchlist
Save movies to watch later

### Watched List
Track movies you've seen with personal 1-5 star ratings and reviews

### Favorites
Mark watched movies as favorites

### Filtering
Filter watched movies by rating or favorites

### Movie Details
View detailed information about any movie

## How it's built

The app has three layers: Frontend (TypeScript),  Backend (Express) and TMDB API. The backend acts as a proxy for TMDB requests. This keeps the API key secret and the frontend never sees it.

The frontend has three main files:
- tmdbApi.ts fetches movie data from TMDB (through our backend)
- movieApi.ts handles the user's lists: adding, updating and deleting movies
- store.ts keeps track of state and tells the page when to update

**Tech stack:** TypeScript, Express, TMDB API, Vite

## Our approach

1. Read the API docs. Since the backend was ready, we studied what endpoints existed
2. Created services/functions to talk to the API
3. Expanded store and added state for everything we needed to track
4. Created types to define what our data looked like 
5. Built reusable and configurable components
6. Assembled pages by combining components into full pages
7. Connected everything by hooking up buttons, forms, navigation et cetera

## Highlights

### State management (store.ts)

We expanded the basic store pattern we were given to handle all user actions. Every time something changes, we update the state and call `triggerRender()` to refresh the page.

Components and pages never call the API directly - they always go through the store. This keeps data flow predictable.

#### Things we figured out:

- Handling two different IDs: TMDB gives movies one ID, our database gives them another. We built getMovieDbId() to translate between them. This was a tricky problem to solve.

- Check before adding: Before adding a movie, we check if it already exists. If it does, we just update its status instead of creating a duplicate.

- Cached vs fresh data: We have both getUserList() (fetches from API) and getUserListCached() (returns what we already have). This avoids unnecessary API calls.

- Always fresh data: After every update to the backend, we fetch the full list again instead of updating local state manually. This avoids sync issues - we never have to worry about local and server data getting out of step.

### TMDB Service (tmdbApi.ts)

Each function does one thing: fetch data from TMDB through our backend. We created one central place for this instead of having every page fetch its own data.

#### Things we figured out:

- Returning only what we need: The TMDB API returns { page, results, total_pages, ... } but we only return results. Keeps it simple for the rest of the app.

- Intentionally no try/catch on one function: getMovieByIdTMDB skips error handling so the error reaches the router directly, which then shows the 404 page. We left a comment explaining why.

### User Data Service (movieApi.ts)
One function per action: add, update, delete, get. We chose to have separate update functions for status, rating, and favorites instead of one generic function. It made the code easier to work with.

#### Things we figured out:

- Same function, two names: addMovie is exported as both addMovieToWatchlist and addMovieToWatched. The function is identical (the status field in the data decides where it goes), but the names make the code more readable where it's used.

- Same pattern for delete: deleteMovie exported as deleteMovieFromWatchlist and deleteMovieFromWatched.

### Type Definitions (types/movie.ts)
Define clear shapes for our data so TypeScript can catch mistakes.

#### Things we figured out:

- TMDBMovieInList builds on TMDBMovie: Instead of duplicating fields, we used `Partial<Omit<TMDBMovie, "id" | "title">>` to inherit most fields. Advanced TypeScript, but avoids repetition.

- Config types: MovieItemConfig and MovieListConfig let us configure components without changing their code. This enabled one MovieItem component to work on all pages.

### Movie Card Component
One component that can look different depending on configuration. Instead of making separate components for browse/watchlist/watched, we made one flexible component.

#### Things we figured out:

- Configuration over duplication: Pass `showButtons: { watchlist: true }` and the button appears. Pass `showPersonalRating: true` and the rating shows. Same component, 4 different uses.

- Handles both movie types: Works with `TMDBMovie` (from browse) and `TMDBMovieInList` (from user's lists). The code checks which type it has: `"tmdb_id" in movie ? movie.tmdb_id : movie.id`

## How we worked together

### What worked well

#### Mixed skills
Some of us leaned more frontend, others backend, others Git. We balanced each other out.

#### Extra eyes
Someone always caught what someone else missed.

#### Clear structure
We agreed on folder organization early, which helped.

### What was hard

#### Git conflicts
We had a lot of them. At one point, several branches got merged and reverted without review. When we tried to merge those changes again, Git didn't recognize them as changes anymore. It got messy.

#### Strong opinions
Many brains with strong wills. We didn't always agree on how things should be done.

#### Time pressure
The project was bigger than the time we had.

### What we learned

- Pull requests should require reviews. Our Git disaster could have been avoided.
- More planning upfront - especially around code structure and who's working on what.
- More frequent check-ins would have helped us stay aligned.

### Working with the "Simple SPA" pattern

We started with a template for building a single-page application. Honestly, we didn't love everything about it - for example, we thought pages should control whether they have a header and footer.

We moved code around and renamed files until it felt more manageable. The router now expects HTML elements instead of strings, which meant all components had to return actual elements.

For many of us, this was the most complex project we'd worked on. Previous assignments usually needed just one JavaScript file. Understanding how all the pieces connected - store, router, components, services - took time. But once it clicked, it made sense.