import type { MovieListConfig } from "../types/movie";
import MovieItem from "./movieItem";
import { emptyState } from "../components/emptyState";

export default function MovieList(config: MovieListConfig) {

    const { movies, itemConfig, heading, introduction, showCount } = config;

    const section = document.createElement("section");
    section.classList.add("page", "container");

    if (heading) {
        const header = document.createElement("div");
        header.className = "page__header";

        const h1 = document.createElement("h1");
        h1.className = "page__title";
        h1.textContent = heading;
        header.appendChild(h1);

        if (showCount) {
            const count = document.createElement("span");
            count.className = "page__movie-count";
            count.textContent = `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} in list`;

            header.appendChild(count);
        }

        section.appendChild(header);
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
        section.appendChild(emptyState({
            imgSrc: "/src/assets/images/big_chungus.webp",
            heading: "No movies in this list",
            message: "Big Chungus says: maybe you should watch something with Ben Affleck? ",
            curatedMovie: {
                id: 1230631, title: "Ben Affleck & Jennifer Lopez: Never Say Never"
            }
        }));
    } else {
        const list = document.createElement("ul");
        list.classList.add("movie-cards");

        movies.forEach((movie) => {
            const card = MovieItem({ movie, ...itemConfig });
            list.appendChild(card);
        });

        section.appendChild(list);
    }

    return section;
}
