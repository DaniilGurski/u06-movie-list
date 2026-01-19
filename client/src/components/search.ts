import { getSearchInputValue, setSearchInputValue } from "../lib/store";
import { loadPopularMovies, loadSearchedMovie } from "../lib/store";

export default function SearchField() {
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search", "container");

    const form = document.createElement("form");
    form.className = "search__form";

    const input = document.createElement("input");
    input.className = "search__input";

    const button = document.createElement("button");
    button.className = "search__button";


    const defaultSearchInputValue = getSearchInputValue();

    button.textContent = "Search";

    if (defaultSearchInputValue) {
        input.value = defaultSearchInputValue;
    }

    searchContainer.appendChild(form);
    form.appendChild(input);
    form.appendChild(button);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const value = input.value;

        setSearchInputValue(value);

        if (!value.trim()) {
            await loadPopularMovies();
            return;
        }

        try {
            await loadSearchedMovie(value);
        } catch (error) {
            console.error("searchField:", error);
        }
    });

    return searchContainer;
}
