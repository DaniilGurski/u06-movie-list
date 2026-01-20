const XMLNS = "http://www.w3.org/2000/svg";

function baseSVG(className: string): SVGElement {
    const svg = document.createElementNS(XMLNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    return svg;
}

function svgPath(svg: SVGElement, d: string): void {
    const path = document.createElementNS(XMLNS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
}

// Jag har tagit bort alla ikoner fron movieItem.ts nu dock.. Men de kan sålart läggas till igen relativt enkelt

// Ikon för att lägga till/ta bort i /watchlist

export function watchlistIcon(): SVGElement {
    const svg = baseSVG("movie-card__icon movie-card__icon--watchlist");
    svgPath(svg, "M5 12h14M12 5v14");
    return svg;
}

// Ikon för att lägga till/ta bort i /watched

export function watchedIcon(): SVGElement {
    const svg = baseSVG("movie-card__icon movie-card__icon--watched");
    svgPath(svg, "M20 6 9 17l-5-5");
    return svg;
}

// Edit-ikon för movie-card

export function editIcon(): SVGElement {
    const svg = baseSVG("movie-card__icon movie-card__icon--edit");
    svgPath(svg, "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4");
    return svg;
}

// Hjärt-ikon för movie-card

export function heartIcon(): SVGElement {
    const svg = baseSVG("movie-card__icon movie-card__icon--heart");
    svgPath(svg, "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5");
    return svg;
}

// Kryss-ikon för söket

export function clearIcon(): SVGElement {
    const svg = baseSVG("search__input-icon");
    svgPath(svg, "M18 6 6 18M6 6l12 12");
    return svg;
}

// Error-ikon för när en posterbild inte kan läsas in

export function placeholderIcon(): SVGElement {
    const svg = baseSVG("movie-card__placeholder-icon");
    svgPath(svg, "m2 2 20 20M10.41 10.41a2 2 0 1 1-2.83-2.83M13.5 13.5 6 21M18 12l3 3");
    svgPath(svg, "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59M21 15V5a2 2 0 0 0-2-2H9");
    return svg;
}

// Todo ikon för att ta bort en film, ikon för att redigera en film, ikon för att "hjärta" en film? Övriga ikoner?
// Jag har använt https://lucide.dev/icons/