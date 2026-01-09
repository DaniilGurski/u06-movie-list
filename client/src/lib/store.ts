import type { TMDBMovie } from "../types/movie";
import {
    getPopularMoviesTMDB,
    getSearchedMovieTMDB,
} from "../services/tmdbApi.ts";

class Store {
    renderCallback: () => void;

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

    triggerRender() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }
}

const store = new Store();

export const loadPopularMovies = store.loadPopularMovies.bind(store); // Async
export const loadSearchedMovie = store.loadSearchedMovie.bind(store); // Async
export const getMovies = store.getMovies.bind(store);
export const getSearchInputValue = store.getSearchInputValue.bind(store);
export const setSearchInputValue = store.setSearchInputValue.bind(store);
export const setRenderCallback = store.setRenderCallback.bind(store);
