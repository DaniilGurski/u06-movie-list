import { setPageTitle, getRandomMovieId } from "../../lib/utils";
import { emptyState } from "../../components/emptyState";
import header from "../../components/header";
import footer from "../../components/footer";
import backButton from "../../components/backButton";

export default function notFound() {
    setPageTitle("Error 404: Page not found");

    const content = document.createDocumentFragment();

    const main = document.createElement("main");
    main.classList.add("container");

    const section = document.createElement("section");
    section.classList.add("page");

    section.appendChild(emptyState({
        // imgSrc: "/src/assets/images/nicolas_cage.jpg",
        heading: "Error 404: Page not found",
        message: "The page you requested doesn't exist. Looking for a movie to watch?",
        curatedMovie: {
            id: 1230631, title: "Ben Affleck & Jennifer Lopez: Never Say Never"
        },
        randomMovieId: getRandomMovieId()
    }));

    main.append(section);
    section.appendChild(backButton());
    content.append(header(), main, footer());

    return content;
}
