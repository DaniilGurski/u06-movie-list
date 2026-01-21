import type { TMDBMovie, TMDBMovieInList } from "../types/movie";
import {
    getPopularMoviesTMDB,
    getSearchedMovieTMDB,
} from "../services/tmdbApi.ts";

import * as movieApi from "../services/movieApi.ts";

class Store {
    renderCallback: () => void;
    userList: TMDBMovieInList[] = [];
    movies: TMDBMovie[] = [];
    searchInputValue: string = "";

    constructor() {
        this.renderCallback = () => {};
    }

    async loadPopularMovies(shouldTriggerRender: boolean = true) {
        try {
            this.movies = await getPopularMoviesTMDB();
            console.log("loadPopularMovies:", this.movies);

            if (shouldTriggerRender) {
                this.triggerRender();
            }

            return this.movies;
        } catch (error) {
            console.error("Failed to load popular movies:", error);
            return [];
        }
    }

    async loadSearchedMovie(
        movieName: string,
        shouldTriggerRender: boolean = true,
    ) {
        try {
            this.movies = await getSearchedMovieTMDB(movieName);
            if (shouldTriggerRender) {
                this.triggerRender();
            }

            return this.movies;
        } catch (error) {
            console.error("Failed to load searched movies:", error);
            return [];
        }
    }

    setSearchInputValue(value: string) {
        this.searchInputValue = value;
    }

    getSearchInputValue() {
        return this.searchInputValue;
    }

    getMovies() {
        return this.movies;
    }

    setRenderCallback(renderApp: () => void) {
        this.renderCallback = renderApp;
    }

    // Add to /watchlist

    async addMovieToWatchlist(movie: TMDBMovie | TMDBMovieInList) {
        try {
            // Få "tmdb_id" oavsett om vi använder "id" eller "tmdb_id"
            const tmdbId = "tmdb_id" in movie ? movie.tmdb_id : movie.id;

            // Tittar om filmen redan finns i databasen och gör den det så ändrar vi status från en lista till en annan (eftersom det inte går att ha en film i båda listorna
            const movieIdAlreadyExistsInDb = this.getMovieDbId(tmdbId);
            if (movieIdAlreadyExistsInDb) {
                await movieApi.updateMovieStatus(
                    movieIdAlreadyExistsInDb,
                    "watchlist",
                );
            } else {
                const convertedMovie: TMDBMovieInList = {
                    tmdb_id: tmdbId,
                    title: movie.title,
                    status: "watchlist",
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    overview: movie.overview,
                };
                await movieApi.addMovieToWatchlist(convertedMovie);
            }
            await this.fetchUserList();
        } catch (error) {
            //TODO: handle error
        }
        this.triggerRender();
    }

    // Add to /watched

    async addMovieToWatched(movie: TMDBMovie | TMDBMovieInList) {
        // Tittar om filmen redan finns i databasen och gör den det så ändrar vi status från en lista till en annan (eftersom det inte går att ha en film i båda listorna
        try {
            const tmdbId = "tmdb_id" in movie ? movie.tmdb_id : movie.id;

            const movieIdAlreadyExistsInDb = this.getMovieDbId(tmdbId);
            if (movieIdAlreadyExistsInDb) {
                await movieApi.updateMovieStatus(
                    movieIdAlreadyExistsInDb,
                    "watched",
                );
            } else {
                const convertedMovie: TMDBMovieInList = {
                    tmdb_id: tmdbId,
                    title: movie.title,
                    status: "watched",
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    overview: movie.overview,
                };
                await movieApi.addMovieToWatched(convertedMovie);
            }
            await this.fetchUserList();
        } catch (error) {
            //TODO: handle error
        }
        this.triggerRender();
    }

    // Ta bort från /watchlist

    async removeMovieFromWatchlist(movie: TMDBMovie | TMDBMovieInList) {
        const tmdbId = "tmdb_id" in movie ? movie.tmdb_id : movie.id;
        const dbId = this.getMovieDbId(tmdbId);
        if (!dbId) return;

        try {
            await movieApi.deleteMovieFromWatchlist(dbId);
            await this.fetchUserList();
        } catch (error) {
            //TODO: handle error
        }
        this.triggerRender();
    }

    // Ta bort från /watched

    async removeMovieFromWatched(movie: TMDBMovie | TMDBMovieInList) {
        const tmdbId = "tmdb_id" in movie ? movie.tmdb_id : movie.id;
        const dbId = this.getMovieDbId(tmdbId);
        if (!dbId) return;

        try {
            await movieApi.deleteMovieFromWatched(dbId);
            await this.fetchUserList();
        } catch (error) {
            //TODO: handle error
        }
        this.triggerRender();
    }

    // Update movie data (personal rating, review)

    async updateMovieData(
        tmdbId: number,
        data: { personal_rating?: number | null; review?: string | null },
    ) {
        try {
            await movieApi.updateMovieData(tmdbId, data);
            await this.fetchUserList();
        } catch (error) {
            console.error("Error updating movie data:", error);
            throw error;
        }
        this.triggerRender();
    }

    /**
     * fetches the users movie list from the api
     * @returns a promise of the user's movie list
     */
    async fetchUserList() {
        try {
            this.userList = await movieApi.getWatchlist();
        } catch (error) {
            console.error("Error fetching userList:", error);
        }

        return this.userList;
    }

    /**
     * returns the users movie list or fetches it first if it is empty
     * @returns a promise of the user's movie list
     */
    async getUserList() {
        if (this.userList.length === 0) {
            return await this.fetchUserList();
        }
        return this.userList;
    }

    // Hm.. Det här tog lite tid att fatta. Är detta ett fulhack?

    getUserListCached() {
        return this.userList;
    }

    // Hämtar databasens id från tmdb_id

    getMovieDbId(tmdbId: number): number | undefined {
        const movie = this.userList.find((movie) => {
            return movie.tmdb_id === tmdbId;
        });
        return movie?.id;
    }

    // Tittar om en film är i /watchlist

    isMovieInWatchlist(movieId: number): boolean {
        return this.userList.some((movie) => {
            return movie.tmdb_id === movieId && movie.status === "watchlist";
        });
    }

    // Tittar om en film är i /watched

    isMovieInWatched(movieId: number): boolean {
        return this.userList.some((movie) => {
            return movie.tmdb_id === movieId && movie.status === "watched";
        });
    }

    triggerRender() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }
}

const store = new Store();

// "Nu i den ordning de kommer"!

export const loadPopularMovies = store.loadPopularMovies.bind(store); // Async
export const loadSearchedMovie = store.loadSearchedMovie.bind(store); // Async
export const getSearchInputValue = store.getSearchInputValue.bind(store);
export const setSearchInputValue = store.setSearchInputValue.bind(store);
export const getMovies = store.getMovies.bind(store);
export const setRenderCallback = store.setRenderCallback.bind(store);

export const addMovieToWatchlist = store.addMovieToWatchlist.bind(store); // Async
export const addMovieToWatched = store.addMovieToWatched.bind(store); // Async

export const removeMovieFromWatchlist =
    store.removeMovieFromWatchlist.bind(store); // Async
export const removeMovieFromWatched = store.removeMovieFromWatched.bind(store); // Async
export const updateMovieData = store.updateMovieData.bind(store); // Async

export const isMovieInWatchlist = store.isMovieInWatchlist.bind(store);
export const isMovieInWatched = store.isMovieInWatched.bind(store);

export const getUserList = store.getUserList.bind(store); // Async

export const getUserListCached = store.getUserListCached.bind(store);
