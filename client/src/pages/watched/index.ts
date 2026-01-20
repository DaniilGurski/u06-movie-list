import header from "../../components/header";
import footer from "../../components/footer";
import MovieList from "../../components/movieList";
import { getUserListCached, getWatchedFilter } from "../../lib/store";

export default () => {
    document.title = "Watched";

    const page = document.createDocumentFragment();

    const movies = getUserListCached().filter(
        (movie) => movie.status === "watched",
    );

    const watchedFilter = getWatchedFilter();

    const filteredMovies = movies.filter((movie) => {
        const passesFavoriteStatus =
            watchedFilter.favoriteStatus === "all" ||
            (watchedFilter.favoriteStatus === "favorite" &&
                movie.is_favorite) ||
            (watchedFilter.favoriteStatus === "no_favorite" &&
                !movie.is_favorite);

        const passesRating =
            watchedFilter.rating === undefined ||
            (typeof movie.personal_rating === "number" &&
                movie.personal_rating >= watchedFilter.rating.min &&
                movie.personal_rating <= watchedFilter.rating.max);

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

    page.append(header(), watchlistPageMovieList, footer());

    return page;
};
