import header from "../../components/header";
import footer from "../../components/footer";
import MovieItem from "../../components/movieItem";
import type { TMDBMovie } from "../../types/movie";

export default (movie: TMDBMovie) => {
    document.title = "Details";

    const details = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    if (!movie) {
        throw new Error("Movie not found");
    }

    const form = document.createElement("form");
    const card = MovieItem({
        movie,
        showEditables: {
            personalRating: true,
            personalReview: true,
        },
    });
    form.append(card);

    content.append(form);
    details.append(header(), content, footer());
    return details;
};
