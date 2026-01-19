import type { MovieListConfig } from "../types/movie";
import MovieItem from "./movieItem";

export default function MovieList(config: MovieListConfig) {

    const { movies, itemConfig, heading, introduction } = config;

    const section = document.createElement("section");
    section.classList.add("page", "container");

    if (heading) {
        const h1 = document.createElement("h1");
        h1.className = "page__title";
        h1.textContent = heading;
        section.appendChild(h1);
    }

    if (introduction) {
        const p = document.createElement("p");
        p.className = "page__introduction";
        p.textContent = introduction;
        section.appendChild(p);
    }

    const list = document.createElement("ul");
    list.classList.add("movie-cards");

    if (movies.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No movies found";
        list.appendChild(emptyMessage);
    } else {
        movies.forEach((movie) => {
            // 
            const card = MovieItem({ movie, ...itemConfig });
            list.appendChild(card);
        });
    }

    section.appendChild(list);
    return section;
}
