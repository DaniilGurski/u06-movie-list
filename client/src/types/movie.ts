export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
}

export type TMDBMovieInList = {
    id?: number; // ??Backend tilldelar??
    tmdb_id: TMDBMovie["id"];
    title: TMDBMovie["title"];
    status: "watchlist" | "watched";
    personal_rating?: number;
    review?: string;
    date_added?: string;
    is_favorite?: boolean;
} & Partial<Omit<TMDBMovie, "id" | "title">>;

export type MovieItemConfig = {
    movie: TMDBMovie | TMDBMovieInList;
    showButtons?: {
        watchlist?: boolean;
        watched?: boolean;
        details?: boolean;
        remove?: boolean;
        edit?: boolean;
        favorite?: boolean;
    };
    showEditables?: {
        personalRating: boolean;
        personalReview: boolean;
    };
    showDateAdded?: boolean;
    showPersonalRating?: boolean;
    showPersonalReview?: boolean;
    defaultValues?: {
        personalRating?: number;
        personalReview?: string;
    };
};

export type MovieListConfig = {
    movies: (TMDBMovie | TMDBMovieInList)[];
    itemConfig: Omit<MovieItemConfig, "movie">;
    heading?: string;
    introduction?: string;
    showCount?: boolean;
};
