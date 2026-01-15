import header from "../../components/header";
import footer from "../../components/footer";
import SearchField from "../../components/search";
import MovieList from "../../components/movieList";
import { getSearchInputValue } from "../../lib/store";
import { getWatchedMovies } from "../../services/movieApi";



export default function watchedMovies(){

    const browseWatched = document.createDocumentFragment();
    const contentWatched = document.createDocumentFragment();

    const heading = document.createElement("h2")
     heading.setAttribute("id", "browse-heading");
    const defaultSearchInputValue = getSearchInputValue();

    heading.textContent =
        defaultSearchInputValue.trim() !== "" ? "Results" : "Watched";

    const searchField = SearchField();

    const watchedFilmsList = document.createElement("ul")

     const movieList = getWatchedMovies();

     movieList.then((movies) => {
        watchedFilmsList.append(
            ...movies.map((movie) => {
                let li = document.createElement("li")
                li.textContent= movie.title
                return li
            })
        )
     })

     .catch((error) => {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Kunde inte ladda filmerna. Försök igen senare.";
    errorMessage.style.color = "red"; // kan ändras senare
    watchedFilmsList.appendChild(errorMessage);
    
    console.error("Error fetching watched movies:", error);
  });

     
    browseWatched.append(searchField, heading, watchedFilmsList);
    contentWatched.append(header(), browseWatched, footer());

    return contentWatched;
}




    
