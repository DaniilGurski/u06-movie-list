import templateString from "./template.html?raw";
import { stringToHTMLElement } from "../../lib/utils";
import { getWatchedFilter, setWatchedFilter } from "../../lib/store";

export default () => {
    const form = stringToHTMLElement(templateString) as HTMLFormElement;

    const favoritesCheckbox: HTMLInputElement =
        form.querySelector("#favorites")!;
    const ratingMinInput: HTMLInputElement = form.querySelector("#min")!;
    const ratingMaxInput: HTMLInputElement = form.querySelector("#max")!;

    const watchedFilter = getWatchedFilter();
    // set state based on watchedFilter
    favoritesCheckbox.checked = watchedFilter.favoriteStatus === "favorite";
    ratingMinInput.value = watchedFilter.rating?.min.toString() || "0";
    ratingMaxInput.value = watchedFilter.rating?.max.toString() || "5";

    // Handle form changes
    form.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.id === "favorites") {
            console.log("Favorites checkbox changed");
        } else if (target.id === "min") {
            console.log("Min rating input changed");
        } else if (target.id === "max") {
            console.log("Max rating input changed");
        }

        const formData = new FormData(form);
        console.log(formData);

        const filterObj: Parameters<typeof setWatchedFilter>[0] = {
            favoriteStatus:
                // checkbox currently has no way to filter by not favorited
                formData.get("favorites") === "on" ? "favorite" : "all",
            rating: {
                min: parseInt(formData.get("min")!.toString()),
                max: parseInt(formData.get("max")!.toString()),
            },
        };

        console.log(filterObj);

        setWatchedFilter(filterObj);
    });

    return form;
};
