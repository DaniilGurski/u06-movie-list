import header from "../../components/header";
import footer from "../../components/footer";
import type { TMDBMovieInList } from "../../types/movie";
import MovieList from "../../components/movieList";

export default function test() {
    const fragment = document.createDocumentFragment();

    // Header
    fragment.appendChild(header());

    // Main
    const main = document.createElement("main");

    // En test-film med ALLA fält ifyllda
    const testMovie: TMDBMovieInList = {
        id: 1,
        tmdb_id: 157336,
        title: "Interstellar",
        status: "watched",
        overview: "A team of explorers travel through a wormhole in space.",
        poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        release_date: "2014-11-05",
        vote_average: 8.6,
        personal_rating: 5,
        review: "One of the best sci-fi movies ever made!",
        is_favorite: true,
        date_added: "2067-67-15"
    };

    // MovieList som returnerar en section med optional h1 och p samt filmkort 
    const movieListSection = MovieList({
        movies: [testMovie],
        itemConfig: {
            showButtons: {
                watchlist: true,
                watched: true,
                details: true,
                remove: true,
                edit: true,
                favorite: true
            },
            showDateAdded: true,
            showPersonalRating: true,
            showPersonalReview: true
        },
        heading: "Test Page",
        introduction: "This page shows a movie card with all fields and buttons visible."
    });

    main.appendChild(movieListSection);
    fragment.appendChild(main);

    // Footer
    fragment.appendChild(footer());

    return fragment;
}
