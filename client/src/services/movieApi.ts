// API-anrop till Movie API
import type { TMDBMovieInList } from "../types/movie";

const baseURL = "http://localhost:3000/api/movies";

// Lägg till film i /watchlist eller /watched

const addMovie = async (movie: TMDBMovieInList): Promise<TMDBMovieInList> => {
    try {
        const res = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(movie),
        });

        if (!res.ok) {
            throw new Error(
                `Failed to add movie to watchlist: ${res.statusText}`,
            );
        }

        const data: TMDBMovieInList = await res.json();
        return data;
    } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        // slutliga error medelland blir så här:
        // "Error adding movie to watchlist: Error: Failed to add movie to watchlist: Conflict"
        // gillar inte dubbel error.
        throw error; // Re-throw so caller can handle it
    }
};

// Jag tycker det här blir enklare. Vad tycker ni?

export const addMovieToWatchlist = addMovie;
export const addMovieToWatched = addMovie;

// Uppdatera en films status (exempelvis om en film redan finns i /watchlist eller /watched)
export const updateMovieStatus = async (
    tmdb_id: number,
    status: "watchlist" | "watched",
): Promise<TMDBMovieInList> => {
    try {
        const res = await fetch(`${baseURL}/${tmdb_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status,
            }),
        });

        if (!res.ok) {
            throw new Error(`Failed to update movie status: ${res.statusText}`);
        }

        const data: TMDBMovieInList = await res.json();
        return data;
    } catch (error) {
        console.error("Error updating movie status:", error);
        throw error;
    }
};

// Update data like personal rating, personal review for a movie
export const updateMovieData = async (
    tmdbId: TMDBMovieInList["id"],
    data: Pick<TMDBMovieInList, "personal_rating" | "review">,
): Promise<TMDBMovieInList> => {
    try {
        const res = await fetch(`${baseURL}/${tmdbId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(`Failed to update movie data: ${res.statusText}`);
        }

        const updatedMovie: TMDBMovieInList = await res.json();
        return updatedMovie;
    } catch (error) {
        console.error("Error updating movie data:", error);
        throw error;
    }
};

// Uppdatera en films favorite-status
export const updateMovieFavorite = async (
    id: TMDBMovieInList["id"],
    isFavorite: boolean,
): Promise<TMDBMovieInList> => {
    try {
        const res = await fetch(`${baseURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_favorite: isFavorite,
            }),
        });

        if (!res.ok) {
            throw new Error(
                `Failed to update favorite status: ${res.statusText}`,
            );
        }

        const data: TMDBMovieInList = await res.json();
        return data;
    } catch (error) {
        console.error("Error updating favorite status:", error);
        throw error;
    }
};

// Ta bort en film från /watchlist eller /watched

const deleteMovie = async (id: TMDBMovieInList["id"]): Promise<void> => {
    try {
        const res = await fetch(`${baseURL}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error(`Failed to delete movie: ${res.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting movie:", error);
        throw error;
    }
};

export const deleteMovieFromWatchlist = deleteMovie;
export const deleteMovieFromWatched = deleteMovie;

// Borde inte denna heta getAllUserMovies eller nått?

export const getWatchlist = async (): Promise<TMDBMovieInList[]> => {
    try {
        const res = await fetch(baseURL);

        if (!res.ok) {
            throw new Error(`Failed to fetch watchlist: ${res.statusText}`);
        }

        const data: TMDBMovieInList[] = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        throw error; // Re-throw so caller can handle it
    }
};
