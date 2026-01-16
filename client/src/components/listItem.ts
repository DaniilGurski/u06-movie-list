import type { TMDBMovie } from "../types/movie";
import { addMovieToWatchlist } from "../lib/store";

export default function listItem(movie: TMDBMovie): HTMLElement {
    const card = document.createElement("div");
    card.className = "movie-card";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const poster = document.createElement("img");
    poster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : "";
    poster.alt = movie.title;

    const button = document.createElement("button");
    button.textContent = "Add to Watchlist";

    button.addEventListener("click", async () => {
        await addMovieToWatchlist(movie);
        button.disabled = true;
        button.textContent = "Added ✔";
    });

    card.append(poster, title, button);

    return card;
}
