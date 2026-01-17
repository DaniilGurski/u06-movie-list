import type { TMDBMovie } from "../types/movie";
import {
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    isMovieInWatchlist,
    addMovieToWatched,
    removeMovieFromWatched,
    isMovieInWatched
} from "../lib/store";

export default function MovieItem(movie: TMDBMovie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const imageDiv = document.createElement("div");
    imageDiv.className = "movie-card__image";

    const img = document.createElement("img");
    img.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "/placeholder.png";
    img.alt = movie.title;
    imageDiv.appendChild(img);

    const content = document.createElement("div");
    content.className = "movie-card__content";

    const title = document.createElement("h3");
    title.className = "movie-card__title";

    const titleText = document.createTextNode(movie.title + " ");

    const year = document.createElement("span");
    year.className = "movie-card__year";
    year.textContent = `(${movie.release_date?.split("-")[0] ?? ""})`; // Året i parantes

    title.appendChild(titleText);
    title.appendChild(year);

    const rating = document.createElement("span");
    rating.className = "movie-card__rating";
    rating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;

    const description = document.createElement("p");
    description.className = "movie-card__description";
    description.textContent = movie.overview;


    // Knappen för att adda till /watchlist

    const inWatchlist = isMovieInWatchlist(movie.id);

    const addTooWatchListButton = document.createElement("button");
    addTooWatchListButton.classList.add("movie-card__button", "movie-card__button--watchlist");
    addTooWatchListButton.textContent = inWatchlist
        ? "In Watchlist"
        : "Add to Watchlist";
    addTooWatchListButton.setAttribute("aria-pressed", inWatchlist
        ? "true"
        : "false"
    );
    addTooWatchListButton.addEventListener("click", () => {
        if (isMovieInWatchlist(movie.id)) {
            removeMovieFromWatchlist(movie);
        } else {
            addMovieToWatchlist(movie);
        }
    });

    // Knappen för att adda till /watched

    const inWatched = isMovieInWatched(movie.id);

    const markAsWatchedButton = document.createElement("button");
    markAsWatchedButton.classList.add("movie-card__button", "movie-card__button--watched");
    markAsWatchedButton.textContent = inWatched
        ? "Watched"
        : "Mark as Watched";
    markAsWatchedButton.setAttribute("aria-pressed", inWatched
        ? "true"
        : "false"
    );
    markAsWatchedButton.addEventListener("click", () => {
        if (isMovieInWatched(movie.id)) {
            removeMovieFromWatched(movie);
        } else {
            addMovieToWatched(movie);
        }
    });

    const actions = document.createElement("div");
    actions.className = "movie-card__actions";
    actions.appendChild(addTooWatchListButton);
    actions.appendChild(markAsWatchedButton);

    content.appendChild(title);
    content.appendChild(rating);
    content.appendChild(description);
    content.appendChild(actions);

    card.appendChild(imageDiv);
    card.appendChild(content);

    return card;
}
