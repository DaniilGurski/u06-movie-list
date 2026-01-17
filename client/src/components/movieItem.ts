import type { TMDBMovie } from "../types/movie";
import { addMovieToWatchlist, isMovieInWatchlist } from "../lib/store";

export default function MovieItem(movie: TMDBMovie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    // Image
    const imageDiv = document.createElement("div");
    imageDiv.className = "movie-card__image";

    const img = document.createElement("img");
    img.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "/placeholder.png";
    img.alt = movie.title;
    imageDiv.appendChild(img);

    // Content
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

    const inWatchlist = isMovieInWatchlist(movie.id);

    const addButton = document.createElement("button");
    addButton.classList.add("movie-card__button", "movie-card__button--watchlist");
    addButton.textContent = inWatchlist
        ? "In Watchlist"
        : "Add to Watchlist";
    addButton.setAttribute("aria-pressed", inWatchlist
        ? "true"
        : "false"
    );
    addButton.addEventListener("click", () => {
        addMovieToWatchlist(movie);
        addButton.setAttribute("aria-pressed", "true");
    });

    const actions = document.createElement("div");
    actions.className = "movie-card__actions";
    actions.appendChild(addButton);

    content.appendChild(title);
    content.appendChild(rating);
    content.appendChild(description);
    content.appendChild(actions);

    card.appendChild(imageDiv);
    card.appendChild(content);

    return card;
}
