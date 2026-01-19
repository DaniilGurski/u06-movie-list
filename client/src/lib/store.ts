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
        shouldTriggerRender: boolean = true
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

    async addMovieToWatchlist(movie: TMDBMovie) {
        // Convert to TMDBMovieInList
        const convertedMovie: TMDBMovieInList = {
            tmdb_id: movie.id,
            title: movie.title,
            status: "watchlist",
            // optional tmdb data
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview,
        };
        try {
            await movieApi.addMovieToWatchlist(convertedMovie);
            // fetch the updated user list
            // we should do this on each Create,Update,Delete to the list
            await this.fetchUserList();
        } catch (error) {
            //TODO: handle error
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

    triggerRender() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }
}

const store = new Store();

export const loadPopularMovies = store.loadPopularMovies.bind(store); // Async
export const loadSearchedMovie = store.loadSearchedMovie.bind(store); // Async
export const addMovieToWatchlist = store.addMovieToWatchlist.bind(store); // Async
export const getMovies = store.getMovies.bind(store);
export const getSearchInputValue = store.getSearchInputValue.bind(store);
export const setSearchInputValue = store.setSearchInputValue.bind(store);
export const getUserList = store.getUserList.bind(store); // Async
export const setRenderCallback = store.setRenderCallback.bind(store);

