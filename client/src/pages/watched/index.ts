import header from "../../components/header";
import footer from "../../components/footer";
import MovieList from "../../components/movieList";
import { getUserListCached } from "../../lib/store";

export default () => {
    document.title = "Watched";

    const page = document.createDocumentFragment();

    const movies = getUserListCached().filter((movie) => movie.status === "watched");

    const watchlistPageMovieList = MovieList({
        movies,
        heading: "Watched",
        introduction: "This page shows a all movies added to the watched list.",
        itemConfig: {
            showButtons: {
                remove: true,
                favorite: true,
                details: true
            },
            showPersonalRating: true,
            showPersonalReview: true
        }
    });

    page.append(header(), watchlistPageMovieList, footer());

    return page;
};