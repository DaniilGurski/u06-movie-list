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
    form.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.id === "favorites") {
            console.log("Favorites checkbox changed");
        } else if (target.id === "rating") {
            console.log("Rating select changed");
        }

        const formData = new FormData(form);
        console.log(formData);

        const filterObj: Parameters<typeof setWatchedFilter>[0] = {
            favoriteStatus:
                // checkbox currently has no way to filter by not favorited
                formData.get("favorites") === "on" ? "favorite" : "all",
            rating:
                ratingSelect.value === "all"
                    ? undefined
                    : parseInt(ratingSelect.value),
        };

        console.log(filterObj);

        setWatchedFilter(filterObj);
    });

    return form;
};
