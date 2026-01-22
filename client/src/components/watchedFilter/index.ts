import templateString from "./template.html?raw";
import { stringToHTMLElement } from "../../lib/utils";
import { getWatchedFilter, setWatchedFilter } from "../../lib/store";
import "./style.css";

export default () => {
    const form = stringToHTMLElement(templateString) as HTMLFormElement;

    const favoritesCheckbox: HTMLInputElement =
        form.querySelector("#favorites")!;
    const ratingSelect: HTMLSelectElement = form.querySelector("#rating")!;

    const watchedFilter = getWatchedFilter();
    // set state based on watchedFilter
    favoritesCheckbox.checked = watchedFilter.favoriteStatus === "favorite";
    ratingSelect.value = watchedFilter.rating?.toString() || "all";

    // Handle form changes
    form.addEventListener("change", () => {
        const formData = new FormData(form);
        setWatchedFilter({
            favoriteStatus:
                // checkbox currently has no way to filter by not favorited
                formData.get("favorites") === "on" ? "favorite" : "all",
            rating:
                ratingSelect.value === "all"
                    ? undefined
                    : parseInt(ratingSelect.value),
        });
    });

    return form;
};
