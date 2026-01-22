import header from "../../components/header";
import footer from "../../components/footer";
import MovieItem from "../../components/movieItem";
import type { TMDBMovie } from "../../types/movie";
import { getUserListCached, updateMovieData } from "../../lib/store";
import backButton from "../../components/backButton";
import { setPageTitle } from "../../lib/utils";

export default async (movie: TMDBMovie) => {
    setPageTitle("Details");

    const details = document.createDocumentFragment();
    const content = document.createElement("main");

    if (!movie) {
        throw new Error("Movie not found");
    }

    const form = document.createElement("form");
    const savedMovie = getUserListCached().find((savedMovie) => {
        return savedMovie.tmdb_id === movie.id;
    });

    let card;

    // You can only edit personal ratings and reviews for movies that are already in the list
    if (savedMovie) {
        card = MovieItem({
            movie,
            showButtons: {
                watched: true,
                watchlist: true,
            },
            showEditables: {
                personalRating: true,
                personalReview: true,
            },
            defaultValues: {
                personalRating: savedMovie.personal_rating,
                personalReview: savedMovie.review,
            },
        });
    } else {
        card = MovieItem({
            movie,
            showButtons: {
                watched: true,
                watchlist: true,
            },
        });
    }

    // Check if movie is in user list
    form.append(card);

    // Handle form submission for updating personal rating and review
    if (savedMovie) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const personalRating = formData.get("personal_rating");
            const review = formData.get("review") as string;

            const statusSpan = form.querySelector(
                "#status-message",
            ) as HTMLSpanElement;

            if (!personalRating) {
                statusSpan.textContent = "Rating required";
                return;
            }

            if (!savedMovie.id) return;

            await updateMovieData(savedMovie.id, {
                personal_rating: personalRating ? Number(personalRating) : null,
                review: review || null,
            });

            statusSpan.textContent = "Changes saved !";
        });
    }

    content.append(form, backButton());
    details.append(header(), content, footer());
    return details;
};
