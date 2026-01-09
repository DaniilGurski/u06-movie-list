import { getSearchInputValue } from "../lib/store";

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

    return form;
}
