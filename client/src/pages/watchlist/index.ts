import header from "../../components/header";
import footer from "../../components/footer";

export default () => {
    // change title
    // TODO: create a function for this
    document.title = "Watchlist";

    document.createElement("div");
    const browse = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    const heading = document.createElement("h1");
    heading.textContent = "Watchlist";
    //TODO: show users movie list
    // const movies = ...

    content.append(heading);
    browse.append(header(), content, footer());

    return browse;
};
