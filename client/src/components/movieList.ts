import type { TMDBMovie } from "../types/movie";
import ListItem from "./listItem";

export default function MovieList(movies: TMDBMovie[]) {
    const list = document.createElement("ul");

    if (movies.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No movies found";
        list.appendChild(emptyMessage);
        return list;
    }

    movies.forEach((movie) => {
        const listItem = ListItem(movie);

        list.appendChild(listItem);
    });

    return list;
}
