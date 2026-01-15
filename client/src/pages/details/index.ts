import header from "../../components/header";
import footer from "../../components/footer";

export default (movieId: number) => {

    document.title = "Details";

    const details = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    const heading = document.createElement("h1");
    heading.textContent = `Details for movie ${movieId}`;

    content.append(heading);
    details.append(header(), content, footer());

    return details;
};
