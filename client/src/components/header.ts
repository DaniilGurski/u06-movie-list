import { routes } from "../router";

export default function header(): HTMLElement {
  const header = document.createElement("header");
  header.classList = "header";

  const navLinks = routes
    // Kolla så att ett länk har visa/visa inte i menyn
    .filter(route => route.showInNav)
    // Mappa route mot path och label  
    .map(route => `<a href="${route.path}" class="main-nav__link">${route.label}</a>`)
    .join("");

  header.innerHTML = `
  <div class="header__layout container">
    <a href="/" class="logo" aria-label="Home">
      <span class="logo__text">Maybe<span class="logo__accent">Movies</span>
    </a>
    <nav class="main-nav">
      ${navLinks}
    </nav>
  </div>
  `;

  return header;
}
