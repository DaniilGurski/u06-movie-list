import header from "../../components/header";
import footer from "../../components/footer";
import watchedFilter from "../../components/watchedFilter";
import MovieList from "../../components/movieList";
import { getUserListCached, getWatchedFilter } from "../../lib/store";

export default () => {
    document.title = "Watched";

    const page = document.createDocumentFragment();

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
        introduction: "This page shows a all movies added to the watched list.",
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

    page.append(header(), watchedFilter(), watchlistPageMovieList, footer());

    return page;
};
