import { toTopIcon } from "./icons";


export default function footer() {


    const footer = document.createElement("footer");
    footer.classList.add("footer");

    const layoutDiv = document.createElement("div");
    layoutDiv.classList.add("footer__layout", "container");

    const groupInfo = document.createElement("p");
    groupInfo.className = "footer__team"
    groupInfo.textContent = "By Team 6"

    const toTop = document.createElement("button");
    toTop.className = "footer__up-button";
    toTop.setAttribute("aria-label", "To the top of the page");
    toTop.appendChild(toTopIcon());

    toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    })

    const footerInfo = document.createElement("div");
    footerInfo.className = "footer__info";

    const footerInfoText1 = document.createElement("p");
    footerInfoText1.className = "footer__info-text"
    footerInfoText1.textContent = "This website was created as part of a school assignment. This is not a production website and should not be used as such."

    const footerInfoText2 = document.createElement("p");
    footerInfoText2.className = "footer__info-text"
    footerInfoText2.textContent = "This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB."

    footer.appendChild(layoutDiv);
    layoutDiv.appendChild(groupInfo);
    layoutDiv.appendChild(toTop);
    layoutDiv.appendChild(footerInfo);

    footerInfo.appendChild(footerInfoText1);
    footerInfo.appendChild(footerInfoText2);


    return footer;
}
