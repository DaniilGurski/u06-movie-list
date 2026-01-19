export function noMoviesInList(imgSrc?: string, heading?: string, message?: string): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("movie-cards__empty-list", "container");

    if (imgSrc) {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = "";
        img.className = "movie-cards__empty-list-image";
        container.append(img);
    }

    if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading;
        h2.className = "movie-cards__empty-list-heading";
        container.append(h2);
    }

    if (message) {
        const p = document.createElement("p");
        p.textContent = message;
        p.className = "movie-cards__empty-list-text";
        container.append(p);
    }

    return container;
}