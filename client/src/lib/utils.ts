/**
 * Converts a string of HTML into an HTMLElement.
 * @param htmlString The HTML string to convert.
 * @returns The HTMLElement created from the HTML string.
 */
export const stringToHTMLElement = (htmlString: string) => {
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    return template.content.firstElementChild!;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const setPageTitle = (title: string) => {
    document.title = `${title} | Maybe?.Movies`;
};

// AND BOOM GOES THE DYNAMITE.

export function showToast(message: string, type?: "success" | "error") {
    const toast = document.createElement("div");
    toast.className = "page__toast";
    toast.dataset.type = type;
    toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    toast.textContent = message;
    document.body.appendChild(toast);

    //setTimeout, minns ni den ELLER?!!?!?
    setTimeout(() => toast.remove(), 3000);
}

// "Slumpa fram en film", tar mellan 1 och 1000 för att va säker (och slippa en fetch här), eller?

export function getRandomMovieId(min: number = 1, max: number = 100000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
