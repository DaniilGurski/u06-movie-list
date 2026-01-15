import { getSearchInputValue, setSearchInputValue } from "../lib/store";
import { loadPopularMovies, loadSearchedMovie } from "../lib/store";

export default function SearchField() {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");
    const defaultSearchInputValue = getSearchInputValue();

    button.textContent = "Search";

    if (defaultSearchInputValue) {
        input.value = defaultSearchInputValue;
    }

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

    return form;
}
