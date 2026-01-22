import { toTopIcon } from "./icons";


export default function footer() {


    const footer = document.createElement("footer");
    footer.classList.add("footer");

    const layoutDiv = document.createElement("div");
    layoutDiv.classList.add("footer__layout", "container");

    const groupInfo = document.createElement("p");
    groupInfo.className = "footer__group-info"
    groupInfo.textContent = "By Team 6"

    const toTop = document.createElement("button");
    toTop.className = "footer__up-button";
    toTop.setAttribute("aria-label", "To the top of the page");
    toTop.appendChild(toTopIcon());
    // toTop.textContent = "To top";

    toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    })

    const disclaimer = document.createElement("p");
    disclaimer.className = "footer__disclaimer-label"
    disclaimer.textContent = "This website was created as part of a school assignment. This is not a production website and should not be used as such. "

    const attributionTMDB = document.createElement("p");
    attributionTMDB.className = "footer__disclaimer-tmdb"
    attributionTMDB.textContent = "This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB."

    footer.appendChild(layoutDiv);
    layoutDiv.appendChild(groupInfo);
    layoutDiv.appendChild(toTop);
    layoutDiv.appendChild(disclaimer);
    layoutDiv.appendChild(attributionTMDB);


    return footer;
}
