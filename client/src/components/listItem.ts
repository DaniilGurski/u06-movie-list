import type { TMDBMovie } from "../types/movie";

export default function ListItem(movie: TMDBMovie) {
    const listItem = document.createElement("li");

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

    const img = document.createElement("img");
    img.src = posterUrl;
    img.alt = movie.title;

    const movieInfo = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;

    const releaseDate = document.createElement("p");
    releaseDate.textContent = movie.release_date;

    const overview = document.createElement("p");
    overview.textContent = movie.overview;

    movieInfo.appendChild(title);
    movieInfo.appendChild(rating);
    movieInfo.appendChild(releaseDate);
    movieInfo.appendChild(overview);

    listItem.appendChild(img);
    listItem.appendChild(movieInfo);

    return listItem;
}
