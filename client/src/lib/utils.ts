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
