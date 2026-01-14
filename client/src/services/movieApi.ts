// API-anrop till Movie API
import type { TMDBMovieInList } from "../types/movie";

const baseURL = "http://localhost:3000/api/movies";

export const addMovieToWatchlist = async (
    movie: TMDBMovieInList,
): Promise<TMDBMovieInList> => {
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
