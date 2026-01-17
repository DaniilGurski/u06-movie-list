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

    // Error handling ifall poster inte kan hämtas/laddas

    const posterImage = document.createElement("div");
    posterImage.className = "movie-card__image";

    const createPlaceholder = (message: string) => {
        const placeholder = document.createElement("div");
        placeholder.className = "movie-card__placeholder";

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("class", "movie-card__placeholder-icon");
        svg.setAttribute("aria-hidden", "true");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "m2 2 20 20M10.41 10.41a2 2 0 1 1-2.83-2.83M13.5 13.5 6 21M18 12l3 3");

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59M21 15V5a2 2 0 0 0-2-2H9");

        svg.appendChild(path1);
        svg.appendChild(path2);

        const span = document.createElement("span");
        span.className = "movie-card__placeholder-label";
        span.textContent = message;

        placeholder.appendChild(svg);
        placeholder.appendChild(span);
        return placeholder;
    };

    if (movie.poster_path) {
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = ""; // Bilden är dekorativ, så ingen alt-text

        img.addEventListener("error", () => {
            posterImage.replaceChildren(createPlaceholder("Error loading poster"));
        });

        posterImage.appendChild(img);
    } else {
        posterImage.appendChild(createPlaceholder("No poster available"));
    }

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

    const watchlistIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    watchlistIcon.setAttribute("viewBox", "0 0 24 24");
    watchlistIcon.setAttribute("fill", "none");
    watchlistIcon.setAttribute("stroke", "currentColor");
    watchlistIcon.setAttribute("stroke-linecap", "round");
    watchlistIcon.setAttribute("stroke-linejoin", "round");
    watchlistIcon.setAttribute("stroke-width", "2");
    watchlistIcon.setAttribute("class", "movie-card__icon movie-card__icon--watchlist");
    watchlistIcon.setAttribute("aria-hidden", "true");

    const watchlistPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    watchlistPath.setAttribute("d", "M5 12h14M12 5v14");
    watchlistIcon.appendChild(watchlistPath);

    const addToWatchlistButton = document.createElement("button");
    addToWatchlistButton.classList.add("movie-card__button", "movie-card__button--watchlist");
    addToWatchlistButton.setAttribute("aria-label", inWatchlist
        ? "In Watchlist"
        : "Add to Watchlist"
    );
    addToWatchlistButton.setAttribute("aria-pressed", inWatchlist ? "true" : "false");
    addToWatchlistButton.appendChild(watchlistIcon);

    addToWatchlistButton.addEventListener("click", () => {
        if (isMovieInWatchlist(movie.id)) {
            removeMovieFromWatchlist(movie);
        } else {
            addMovieToWatchlist(movie);
        }
    });

    // Knappen för att adda till /watched

    const inWatched = isMovieInWatched(movie.id);

    const watchedIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    watchedIcon.setAttribute("viewBox", "0 0 24 24");
    watchedIcon.setAttribute("fill", "none");
    watchedIcon.setAttribute("stroke", "currentColor");
    watchedIcon.setAttribute("stroke-linecap", "round");
    watchedIcon.setAttribute("stroke-linejoin", "round");
    watchedIcon.setAttribute("stroke-width", "2");
    watchedIcon.setAttribute("class", "movie-card__icon movie-card__icon--watched");
    watchedIcon.setAttribute("aria-hidden", "true");

    const watchedPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    watchedPath.setAttribute("d", "M20 6 9 17l-5-5");
    watchedIcon.appendChild(watchedPath);

    const markAsWatchedButton = document.createElement("button");
    markAsWatchedButton.classList.add("movie-card__button", "movie-card__button--watched");
    markAsWatchedButton.setAttribute("aria-label", inWatched
        ? "Watched"
        : "Mark as Watched"
    );
    markAsWatchedButton.setAttribute("aria-pressed", inWatched ? "true" : "false");
    markAsWatchedButton.appendChild(watchedIcon);

    markAsWatchedButton.addEventListener("click", () => {
        if (isMovieInWatched(movie.id)) {
            removeMovieFromWatched(movie);
        } else {
            addMovieToWatched(movie);
        }
    });

    // Knappen för att navigera till /details-sidan

    const detailsLink = document.createElement("a");
    detailsLink.classList.add("movie-card__button", "movie-card__button--details");
    detailsLink.href = `/details/${movie.id}`;
    detailsLink.textContent = "View Details";

    // Wrapper för interaktionsknapparna

    const actions = document.createElement("div");
    actions.className = "movie-card__actions";
    actions.appendChild(addToWatchlistButton);
    actions.appendChild(markAsWatchedButton);
    actions.appendChild(detailsLink);

    content.appendChild(title);
    content.appendChild(rating);
    content.appendChild(description);
    content.appendChild(actions);

    card.appendChild(posterImage);
    card.appendChild(content);

    return card;
}
