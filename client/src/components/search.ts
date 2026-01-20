import { getSearchInputValue, setSearchInputValue } from "../lib/store";
import { loadPopularMovies, loadSearchedMovie } from "../lib/store";

import { clearIcon } from "./icons";

export default function SearchField() {
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search", "container");

    const form = document.createElement("form");
    form.className = "search__form";

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "search__input-wrapper";

    const input = document.createElement("input");
    input.className = "search__input";

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "search__input-clear-button";
    clearButton.appendChild(clearIcon());

    clearButton.addEventListener("click", () => {
        input.value = "";
        input.focus();
    });


    const button = document.createElement("button");
    button.className = "search__button";

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(clearButton);


    const defaultSearchInputValue = getSearchInputValue();

    button.textContent = "Search";

    if (defaultSearchInputValue) {
        input.value = defaultSearchInputValue;
    }

    searchContainer.appendChild(form);
    form.appendChild(inputWrapper);
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
