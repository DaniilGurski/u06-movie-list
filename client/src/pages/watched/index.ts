import header from "../../components/header";
import footer from "../../components/footer";
import watchedFilter from "../../components/watchedFilter";
import MovieList from "../../components/movieList";
import { getUserListCached, getWatchedFilter } from "../../lib/store";
import { setPageTitle } from "../../lib/utils";

export default () => {
    setPageTitle("Watched");

    const page = document.createDocumentFragment();
    const content = document.createElement("main");

    const movies = getUserListCached().filter(
        (movie) => movie.status === "watched",
    );

    const watchedFilterState = getWatchedFilter();

    const filteredMovies = movies.filter((movie) => {
        const passesFavoriteStatus =
            watchedFilterState.favoriteStatus === "all" ||
            (watchedFilterState.favoriteStatus === "favorite" &&
                movie.is_favorite) ||
            (watchedFilterState.favoriteStatus === "no_favorite" &&
                !movie.is_favorite);

        const passesRating =
            watchedFilterState.rating === undefined ||
            movie.personal_rating === watchedFilterState.rating;

        return passesFavoriteStatus && passesRating;
    });

    const watchlistPageMovieList = MovieList({
        movies: filteredMovies,
        heading: "Watched",
        showCount: true,
        introduction: "This page shows all movies added to the watched list.",
        itemConfig: {
            showButtons: {
                remove: true,
                favorite: true,
                details: true,
            },
            showPersonalRating: true,
            showPersonalReview: true,
        },
    });

    content.append( watchedFilter(), watchlistPageMovieList);
    page.append(header(), content, footer());

    return page;
};
