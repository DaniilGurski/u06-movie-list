import header from "../../components/header";
import footer from "../../components/footer";
import MovieList from "../../components/movieList";
import { getUserListCached } from "../../lib/store";

export default () => {
    document.title = "Watchlist";

    const page = document.createDocumentFragment();

    const movies = getUserListCached().filter((movie) => movie.status === "watchlist");

    const watchlistPageMovieList = MovieList({
        movies,
        heading: "Watchlist",
        introduction: "This page shows a all movies added to the watchlist.",
        showCount: true,
        itemConfig: {
            showButtons: {
                watched: true,
                details: true
            },
            showDateAdded: true
        }
    });

    page.append(header(), watchlistPageMovieList, footer());

    return page;
};