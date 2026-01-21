import header from "../../components/header";
import footer from "../../components/footer";
import MovieItem from "../../components/movieItem";
import type { TMDBMovie } from "../../types/movie";
import { getUserList } from "../../lib/store";

export default async (movie: TMDBMovie) => {
    document.title = "Details";

    const details = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    if (!movie) {
        throw new Error("Movie not found");
    }

    const form = document.createElement("form");
    const userList = await getUserList();
    const isMovieInList = userList.find(
        (movie) => movie.tmdb_id === movie.tmdb_id,
    );

    let card;

    // You can only edit personal rating and reviews for movies which are already in list
    if (isMovieInList) {
        card = MovieItem({
            movie,
            showEditables: {
                personalRating: true,
                personalReview: true,
            },
        });
    } else {
        card = MovieItem({
            movie,
        });
    }

    // Check if movie is in user list
    form.append(card);

    content.append(form);
    details.append(header(), content, footer());
    return details;
};
