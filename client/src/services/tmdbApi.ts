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
                `Failed to fetch popular movies: ${res.statusText}`
            );
        }

        const data: TMDBResponse = await res.json();
        return data.results;
    } catch (error) {
        console.error("Error getting popular movies:", error);
        throw error; // Re-throw so caller can handle it
    }
};

export const getSearchedMovieTMDB = async (
    name: string
): Promise<TMDBMovie[]> => {
    try {
        const res = await fetch(`http://localhost:3000/api/tmdb/${name}`);

        if (!res.ok) {
            throw new Error(
                `Failed to fetch popular movies: ${res.statusText}`
            );
        }

        const data: TMDBResponse = await res.json();
        return data.results;
    } catch (error) {
        console.error("Error getting searched movies:", error);
        throw error; // Re-throw so caller can handle it
    }
};
