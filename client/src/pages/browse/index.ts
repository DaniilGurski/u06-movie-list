import header from "../../components/header";
import footer from "../../components/footer";
import SearchField from "../../components/search";
import MovieList from "../../components/movieList";
import { getMovies, getSearchInputValue } from "../../lib/store";

export default function browse() {
    const browse = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    const heading = document.createElement("h2");
    // const defaultSearchInputValue = getSearchInputValue();

    // heading.textContent =
    //     defaultSearchInputValue.trim() !== "" ? "Results" : "Popular";

    const searchField = SearchField();

    // Get movies from store and render list
    const movies = getMovies();
    const browsePageMovieList = MovieList({
        heading: "Popular",
        introduction: "This movies are popular right now.",
        showCount: false,
        movies,
        itemConfig: {
            showButtons: {
                watchlist: true,
                watched: true,
                details: true
            }
        }
    });

    content.append(searchField, heading, browsePageMovieList);
    browse.append(header(), content, footer());

    return browse;
}
