import type { TMDBMovie } from "../types/movie";
import { addMovieToWatchlist } from "../lib/store";
import { getMovieByIdTMDB } from "../services/tmdbApi";

export default function MovieItem(movie: TMDBMovie) {
    const listItem = document.createElement("li");

    if (movie.poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        const img = document.createElement("img");
        img.src = posterUrl;
        img.alt = movie.title;

        listItem.appendChild(img);
    } else {
        const placeholderPoster = document.createElement("div");
        placeholderPoster.textContent = "No Poster";
        listItem.appendChild(placeholderPoster);
    }

    const movieInfo = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;

    const releaseDate = document.createElement("p");
    releaseDate.textContent = movie.release_date;

    const overview = document.createElement("p");
    overview.textContent = movie.overview;

    const addButton = document.createElement("button");
    addButton.textContent = "Add to Watchlist";
    addButton.addEventListener("click", () => {
        addMovieToWatchlist(movie);
    });

    movieInfo.appendChild(title);
    movieInfo.appendChild(rating);
    movieInfo.appendChild(releaseDate);
    movieInfo.appendChild(overview);
    movieInfo.appendChild(addButton);

    listItem.appendChild(movieInfo);

    return listItem;
}
