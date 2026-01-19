export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
}

export type TMDBMovieInList = {
    tmdb_id: TMDBMovie["id"];
    title: TMDBMovie["title"];
    status: "watchlist" | "watched";
    personal_rating?: number;
    review?: string;
    date_watched?: string;
    is_favorite?: boolean;
} & Partial<Omit<TMDBMovie, "id" | "title">>;
