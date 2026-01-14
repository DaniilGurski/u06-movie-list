import type { TMDBMovie, TMDBMovieInList } from "../types/movie";
import {
    getPopularMoviesTMDB,
    getSearchedMovieTMDB,
} from "../services/tmdbApi.ts";

import * as movieApi from "../services/movieApi.ts";

class Store {
    renderCallback: () => void;
    watchlist: TMDBMovieInList[] = [];
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
            const addedMovie = await movieApi.addMovieToWatchlist(convertedMovie);
            this.watchlist.push(addedMovie);
        } catch (error) {
         
        }
        this.triggerRender();
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
export const setRenderCallback = store.setRenderCallback.bind(store);
