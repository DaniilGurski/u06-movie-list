import { routes } from "../router";

export default function header(): HTMLElement {
  const header = document.createElement("header");
  header.classList.add("header");

  const layoutDiv = document.createElement("div");
  layoutDiv.classList.add("header__layout", "container");

  const logoLink = document.createElement("a");
  logoLink.href = "/";
  logoLink.classList.add("logo");
  logoLink.setAttribute("aria-label", "Home");

  const logoText = document.createElement("span");
  logoText.classList.add("logo__text");
  logoText.textContent = "Maybe";

  const logoAccent = document.createElement("span");
  logoAccent.classList.add("logo__accent");
  logoAccent.textContent = "Movies";

  logoText.appendChild(logoAccent);
  logoLink.appendChild(logoText);

  const nav = document.createElement("nav");
  nav.classList.add("main-nav");

  routes
    // Kolla så att ett länk har visa/visa inte i menyn
    .filter(route => route.showInNav)
    // Mappa route mot path och label
    .forEach(route => {
      const link = document.createElement("a");
      link.href = route.path;
      link.classList.add("main-nav__link");
      link.textContent = route.label;
      nav.appendChild(link);
    });

  layoutDiv.appendChild(logoLink);
  layoutDiv.appendChild(nav);
  header.appendChild(layoutDiv);

  return header;
}
