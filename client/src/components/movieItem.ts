import type { MovieItemConfig } from "../types/movie";
import {
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    isMovieInWatchlist,
    addMovieToWatched,
    removeMovieFromWatched,
    isMovieInWatched,
    toggleFavorite
} from "../lib/store";

export default function MovieItem(config: MovieItemConfig) {
    const card = document.createElement("div");
    card.className = "movie-card";

    // Olika sidor kan "använda" olika UI-element. Exempelvis kan /watchlist ha olika knappar från /watched

    const {
        movie,
        showButtons = { }, // Varje sida måste själv enabla vilka knappar ett kort ska ha
        showDateAdded,
        showPersonalRating,
        showPersonalReview
    } = config;

    // Få "tmdb_id" oavsett om vi använder "id" eller "tmdb_id"
    const tmdbId = "tmdb_id" in movie ? movie.tmdb_id : movie.id;

    // Poster

    const posterImage = document.createElement("div");
    posterImage.className = "movie-card__image";

    const createPlaceholder = (message: string) => {
        const placeholder = document.createElement("div");
        placeholder.className = "movie-card__placeholder";

        const span = document.createElement("span");
        span.className = "movie-card__placeholder-label";
        span.textContent = message;

        placeholder.appendChild(span);
        return placeholder;
    };

    if (movie.poster_path) {
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        img.alt = "";

        img.addEventListener("error", () => {
            posterImage.replaceChildren(createPlaceholder("Error loading poster"));
        });

        posterImage.appendChild(img);
    } else {
        posterImage.appendChild(createPlaceholder("No poster available"));
    }

    // Content wrapper

    const content = document.createElement("div");
    content.className = "movie-card__content";

    // Titel (med år i parantes)

    const title = document.createElement("h3");
    title.className = "movie-card__title";

    const titleText = document.createTextNode(movie.title + " ");

    const year = document.createElement("span");
    year.className = "movie-card__year";
    year.textContent = `(${movie.release_date?.split("-")[0] ?? ""})`;

    title.appendChild(titleText);
    title.appendChild(year);

    content.appendChild(title);

    // Beskrivning av filmen

    const description = document.createElement("p");
    description.className = "movie-card__description";
    description.textContent = movie.overview ?? "";

    content.appendChild(description);

    // Betyg från TMDB

    const rating = document.createElement("div");
    rating.classList.add("movie-card__content-group", "movie-card__content-group--rating");

    const ratingLabel = document.createElement("span");
    ratingLabel.className = "movie-card__content-group-label";
    ratingLabel.textContent = "TMDB Movie Rating";

    const ratingValue = document.createElement("span");
    ratingValue.className = "movie-card__content-group-value";
    ratingValue.textContent = `⭐ ${movie.vote_average?.toFixed(1) ?? "n/a"}`;

    rating.appendChild(ratingLabel);
    rating.appendChild(ratingValue);
    content.appendChild(rating);

    // Datum tillagd

    if (showDateAdded && "date_added" in movie && movie.date_added) {
        const dateAdded = document.createElement("div");
        dateAdded.classList.add("movie-card__content-group", "movie-card__content-group--date-added");

        const dateAddedLabel = document.createElement("span");
        dateAddedLabel.className = "movie-card__content-group-label";
        dateAddedLabel.textContent = "Date added to watchlist";

        const dateAddedValue = document.createElement("span");
        dateAddedValue.className = "movie-card__content-group-value";
        dateAddedValue.textContent = movie.date_added;

        dateAdded.appendChild(dateAddedLabel);
        dateAdded.appendChild(dateAddedValue);
        content.appendChild(dateAdded);
    }

    // "Mitt ditt personliga betyg"

    if (showPersonalRating && "personal_rating" in movie && movie.personal_rating) {
        const personalRating = document.createElement("div");
        personalRating.classList.add("movie-card__content-group", "movie-card__content-group--personal-rating");

        const personalRatingLabel = document.createElement("span");
        personalRatingLabel.className = "movie-card__content-group-label";
        personalRatingLabel.textContent = "My rating";

        const personalRatingValue = document.createElement("span");
        personalRatingValue.className = "movie-card__content-group-value";
        personalRatingValue.textContent = "⭐".repeat(movie.personal_rating);

        personalRating.appendChild(personalRatingLabel);
        personalRating.appendChild(personalRatingValue);
        content.appendChild(personalRating);
    }

    // "Min recension/anteckning"

    if (showPersonalReview && "review" in movie && movie.review) {
        const review = document.createElement("div");
        review.classList.add("movie-card__content-group", "movie-card__content-group--review");

        const reviewLabel = document.createElement("span");
        reviewLabel.className = "movie-card__content-group-label";
        reviewLabel.textContent = "My note about this movie";

        const reviewValue = document.createElement("p");
        reviewValue.className = "movie-card__content-group-value";
        reviewValue.textContent = movie.review;

        review.appendChild(reviewLabel);
        review.appendChild(reviewValue);
        content.appendChild(review);
    }

    // Behållare för knappar

    const actions = document.createElement("div");
    actions.className = "movie-card__actions";

    // Watchlist

    if (showButtons.watchlist) {
        const inWatchlist = isMovieInWatchlist(tmdbId);

        const addToWatchlistButton = document.createElement("button");
        addToWatchlistButton.classList.add("movie-card__button", "movie-card__button--watchlist");
        addToWatchlistButton.textContent = inWatchlist ? "In Watchlist" : "Add to Watchlist";
        addToWatchlistButton.setAttribute("aria-pressed", inWatchlist ? "true" : "false");

        addToWatchlistButton.addEventListener("click", () => {
            if (isMovieInWatchlist(tmdbId)) {
                removeMovieFromWatchlist(movie);
            } else {
                addMovieToWatchlist(movie);
            }
        });

        actions.appendChild(addToWatchlistButton);
    }

    // Watched

    if (showButtons.watched) {
        const inWatched = isMovieInWatched(tmdbId);

        const markAsWatchedButton = document.createElement("button");
        markAsWatchedButton.classList.add("movie-card__button", "movie-card__button--watched");
        markAsWatchedButton.textContent = inWatched ? "Watched" : "Mark as Watched";
        markAsWatchedButton.setAttribute("aria-pressed", inWatched ? "true" : "false");

        markAsWatchedButton.addEventListener("click", () => {
            if (isMovieInWatched(tmdbId)) {
                removeMovieFromWatched(movie);
            } else {
                addMovieToWatched(movie);
            }
        });

        actions.appendChild(markAsWatchedButton);
    }

    // Favorit

    if (showButtons.favorite) {
        const isFavorite = "is_favorite" in movie && movie.is_favorite;

        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("movie-card__button", "movie-card__button--favorite");
        favoriteButton.textContent = isFavorite ? "Remove as favorite" : "Add as favorite";
        favoriteButton.setAttribute("aria-pressed", isFavorite ? "true" : "false");

        favoriteButton.addEventListener("click", () => {
            // ========== ERNEST - TASK 3.5: Favorite toggle ==========
            // Implemented: Call toggleFavorite function from store
            toggleFavorite(movie);
            // ========== END ERNEST - TASK 3.5 ==========
        });

        actions.appendChild(favoriteButton);
    }

    // Edit

    if (showButtons.edit) {
        const editButton = document.createElement("button");
        editButton.classList.add("movie-card__button", "movie-card__button--edit");
        editButton.textContent = "Edit personal note or score";

        editButton.addEventListener("click", () => {
            // TODO: Öppna edit-modal eller navigera till edit-vy
            console.log("TODO inte klar.");
        });

        actions.appendChild(editButton);
    }

    // Ta bort film från /watched

    if (showButtons.remove) {
        const removeButton = document.createElement("button");
        removeButton.classList.add("movie-card__button", "movie-card__button--remove");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            if ("status" in movie) {
                if (movie.status === "watchlist") {
                    removeMovieFromWatchlist(movie);
                } else {
                    removeMovieFromWatched(movie);
                }
            }
        });

        actions.appendChild(removeButton);
    }

    // Detaljlänken

    if (showButtons.details) {
        const detailsLink = document.createElement("a");
        detailsLink.classList.add("movie-card__button", "movie-card__button--details");
        detailsLink.href = `/details/${tmdbId}`;
        detailsLink.textContent = "View Details";

        actions.appendChild(detailsLink);
    }

    content.appendChild(actions);

    card.appendChild(posterImage);
    card.appendChild(content);

    return card;
}