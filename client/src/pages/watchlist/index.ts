import header from "../../components/header";
import footer from "../../components/footer";
import MovieList from "../../components/movieList";
import { getUserListCached } from "../../lib/store";
import { setPageTitle } from "../../lib/utils";

export default () => {
    setPageTitle("Watchlist");

    const page = document.createDocumentFragment();
    const content = document.createElement("main");

    const movies = getUserListCached().filter((movie) => movie.status === "watchlist");

    const watchlistPageMovieList = MovieList({
        movies,
        heading: "Watchlist",
        introduction: "This page shows all movies added to the watchlist.",
        showCount: true,
        itemConfig: {
            showButtons: {
                watched: true,
                details: true
            },
            showDateAdded: true
        }
    });

    content.append(watchlistPageMovieList);
    page.append(header(), content, footer());

    return page;
};