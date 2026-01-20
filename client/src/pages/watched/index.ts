import header from "../../components/header";
import footer from "../../components/footer";
import MovieList from "../../components/movieList";
import { getUserListCached } from "../../lib/store";
import {store} from "../../lib/store"

export default () => {
    document.title = "Watched";

    const page = document.createDocumentFragment();

    const movies = getUserListCached().filter((movie) => movie.status === "watched");

    let watchlistPageMovieList = MovieList({
        movies,
        heading: "Watched",
        introduction: "This page shows a all movies added to the watched list.",
        itemConfig: {
            showButtons: {
                remove: true,
                favorite: true,
                details: true
            },
            showPersonalRating: true,
            showPersonalReview: true
        }
    });

    store.renderCallback = () => {
        // Skapa en ny MovieList med uppdaterad userList
        const updatedMovies = store.getUserListCached().filter((movie) => movie.status === "watched");

        // Skapa ny MovieList
        const newMovieList = MovieList({
            movies: updatedMovies,
            heading: "Watched",
            introduction: "This page shows all movies added to the watched list.",
            itemConfig: {
                showButtons: {
                    remove: true,
                    favorite: true,
                    details: true
                },
                showPersonalRating: true,
                showPersonalReview: true
            }
        });

        // Byt ut den gamla listan mot den nya
        page.replaceChild(newMovieList, watchlistPageMovieList);

        // Uppdatera referensen så att nästa gång renderCallback körs använder vi nya listan
        watchlistPageMovieList = newMovieList;
    };


    page.append(header(), watchlistPageMovieList, footer());

    return page;
};