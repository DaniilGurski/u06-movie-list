import header from "../../components/header";
import footer from "../../components/footer";
import SearchField from "../../components/search";
import MovieList from "../../components/movieList";
import {
    loadPopularMovies,
    loadSearchedMovie,
    getMovies,
    setSearchInputValue,
    getSearchInputValue,
} from "../../lib/store";

export default function browse() {
    const browse = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    const heading = document.createElement("h2");
    const defaultSearchInputValue = getSearchInputValue();

    heading.textContent =
        defaultSearchInputValue.trim() !== "" ? "Results" : "Popular";

    const searchField = SearchField();
    const input = searchField.querySelector("input") as HTMLInputElement;

    // Handle search
    searchField.addEventListener("submit", async (e) => {
        e.preventDefault();

        const value = input.value;
        setSearchInputValue(value);

        if (!value.trim()) {
            heading.textContent = "Popular";
            await loadPopularMovies();
            return;
        }

        heading.textContent = "Results";

        try {
            await loadSearchedMovie(value);
        } catch (error) {
            console.error("searchField:", error);
        }
    });

    // Get movies from store and render list
    const movies = getMovies();
    const movieList = MovieList(movies);

    content.append(searchField, heading, movieList);
    browse.append(header(), content, footer());

    return browse;
}
