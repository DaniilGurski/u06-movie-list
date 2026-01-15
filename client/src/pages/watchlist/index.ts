import header from "../../components/header";
import footer from "../../components/footer";
import { getUserList } from "../../lib/store";

export default () => {
    // change title
    // TODO: create a function for this
    document.title = "Watchlist";

    const page = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    const heading = document.createElement("h1");
    heading.textContent = "Watchlist";

    const main = document.createElement("main");

    const userList = document.createElement("ol");

    const movies = getUserList();
    movies.then((data) => {
        userList.append(
            ...data
                .filter((movie) => movie.status === "watchlist")
                .map((movie) => {
                    //TODO: use an actual card.
                    // right now the problem is that this is a TMDBMovieInList
                    // while the current card expects a TMDBMovie
                    const li = document.createElement("li");
                    li.textContent = movie.title;
                    return li;
                }),
        );
    });

    main.appendChild(userList);
    content.append(heading, main);
    page.append(header(), content, footer());

    return page;
};
