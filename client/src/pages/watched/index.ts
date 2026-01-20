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

        const rating = movie.personal_rating || 0;

        const passesRating =
            watchedFilterState.rating === undefined ||
            (rating >= watchedFilterState.rating.min &&
                rating <= watchedFilterState.rating.max);

        const passes = passesFavoriteStatus && passesRating;
        if (!passes) {
            console.log(`Movie ${movie.title} does not pass the filter`);
            console.log(`Favorite status: ${passesFavoriteStatus}`);
            console.log(`Rating: ${passesRating}`);
            console.log(movie);
        }

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
