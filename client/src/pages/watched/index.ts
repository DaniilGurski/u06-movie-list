import header from "../../components/header";
import footer from "../../components/footer";
import SearchField from "../../components/search";
import { getUserList, getSearchInputValue } from "../../lib/store";




export default function watchedMovies(){

    document.title = "Watched movies"

    const page = document.createDocumentFragment();
    const content = document.createDocumentFragment();

    const heading = document.createElement("h2")
     heading.setAttribute("id", "browse-heading");
    const defaultSearchInputValue = getSearchInputValue();

    heading.textContent =
        defaultSearchInputValue.trim() !== "" ? "Results" : "Watched";

    const searchField = SearchField();

    const watchedFilmsList = document.createElement("ul")

    getUserList()
        .then((movies) => {

            const watchedMovies = movies.filter(movie => movie.status === "watched")

            if(watchedMovies.length === 0){
                const p = document.createElement("p")
                p.textContent = "You have not marked any movies as watched yet."
                watchedFilmsList.appendChild(p)
            }
            else{
                watchedFilmsList.append(
                    ...watchedMovies.map(movie => {
                        const li = document.createElement("li")
                        li.textContent = movie.title
                        return li
                    })
                )
            }
        })

     .catch((error) => {
    const errorMessage = document.createElement("li");
    errorMessage.textContent = "Kunde inte ladda filmerna. Försök igen senare.";
    watchedFilmsList.appendChild(errorMessage);
    
    console.error("Error fetching watched movies:", error);
  });

     
    page.append(searchField, heading, watchedFilmsList);
    content.append(header(), page, footer());

    return content;
}




    
