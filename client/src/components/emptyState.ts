import type { EmptyStateConfig } from "../types/movie";

export function emptyState(config: EmptyStateConfig): HTMLElement {
    const { imgSrc, heading, message, curatedMovie, randomMovieId } = config;

    const container = document.createElement("div");
    container.classList.add("empty-state");

    if (imgSrc) {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = "";
        img.className = "empty-state__image";
        container.append(img);
    }

    if (heading) {
        const emptyStateHeading = document.createElement("h2");
        emptyStateHeading.textContent = heading;
        emptyStateHeading.className = "empty-state__heading";
        container.append(emptyStateHeading);
    }

    const emptyStateText = document.createElement("p");
    emptyStateText.className = "empty-state__text";

    if (message) {
        emptyStateText.append(message);
    }

    if (curatedMovie) {
        if (message || randomMovieId) emptyStateText.append(" ");
        const curatedLink = document.createElement("a");
        curatedLink.href = `/details/${curatedMovie.id}`;
        curatedLink.textContent = curatedMovie.title;
        curatedLink.className = "empty-state__link";
        emptyStateText.append("How about: ", curatedLink, "?");
    }

    if (randomMovieId) {
        if (message) emptyStateText.append(" ");
        const randomLink = document.createElement("a");
        randomLink.href = `/details/${randomMovieId}`;
        randomLink.textContent = "random movie";
        randomLink.className = "empty-state__link";
        emptyStateText.append("Or how about a ", randomLink, "?");
    }

    if (message || randomMovieId || curatedMovie) {
        container.append(emptyStateText);
    }

    return container;
}