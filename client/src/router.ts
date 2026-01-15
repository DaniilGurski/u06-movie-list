import browse from "./pages/browse";
import watchlist from "./pages/watchlist";
import notFound from "./pages/notFound";
import details from "./pages/details";

const router = (): HTMLElement | DocumentFragment => {
    const path = window.location.pathname;

    // Om path börjar med /details, extrahera id/nummer om det finns

    if (path.startsWith("/details")) {
        const movieId = Number(path.split("/")[2]);

        // Visa 404-sidan om id/nummer saknas, är noll, negativt eller inte är ett nummer

        if (isNaN(movieId) || movieId <= 0) {
            return notFound();
        }

        // Annars visa details sidan med aktuellt id/nummer

        return details(movieId);
    }

    switch (path) {
        case "/":
        case "/browse":
            return browse();
        case "/watchlist":
            return watchlist();
        default:
            return notFound();
    }
};

export default router;
