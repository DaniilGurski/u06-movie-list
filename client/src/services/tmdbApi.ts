import type { TMDBMovie } from "../types/movie";

interface TMDBResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

export const getPopularMoviesTMDB = async (): Promise<TMDBMovie[]> => {
    try {
        const res = await fetch("http://localhost:3000/api/tmdb");

        if (!res.ok) {
            throw new Error(
                `Failed to fetch popular movies: ${res.statusText}`,
            );
        }

        const data: TMDBResponse = await res.json();
        return data.results;
    } catch (error) {
        console.error("Error getting popular movies:", error);
        throw error; // Re-throw so caller can handle it
    }
};

// Tar bort try/catch för att felet ska nå routern direkt utan att loggas i konsolen först

export const getMovieByIdTMDB = async (id: number) => {
    const res = await fetch(`http://localhost:3000/api/tmdb/${id}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch movie by ID: ${res.statusText}`);
    }

    const data: TMDBMovie = await res.json();
    return data;
};

export const getSearchedMovieTMDB = async (
    name: string,
): Promise<TMDBMovie[]> => {
    try {
        const res = await fetch(
            `http://localhost:3000/api/tmdb?search=${name}`,
        );

        if (!res.ok) {
            throw new Error(
                `Failed to fetch searched movies: ${res.statusText}`,
            );
        }

        const data: TMDBResponse = await res.json();
        return data.results;
    } catch (error) {
        console.error("Error getting searched movies:", error);
        throw error;
    }
};
