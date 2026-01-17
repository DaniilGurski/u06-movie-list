import type { TMDBMovie } from "../types/movie";
import MovieItem from "./movieItem";

export default function MovieList(movies: TMDBMovie[]) {
    const list = document.createElement("ul");
    list.classList.add("movie-cards", "container");

    if (movies.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No movies found";
        list.appendChild(emptyMessage);
        return list;
    }

    movies.forEach((movie) => {
        const listItem = MovieItem(movie);
        list.appendChild(listItem);
    });

    return list;
}
