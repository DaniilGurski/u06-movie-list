import type { Route } from "./types/route";
import browse from "./pages/browse";
import watchlist from "./pages/watchlist";
import watched from "./pages/watched";
import notFound from "./pages/notFound";
import details from "./pages/details";
import { getMovieByIdTMDB } from "./services/tmdbApi";
import { getUserListCached } from "./lib/store";

// Nu kan vi lägga till/ta bort vad som ska finnas i menyn samt dölja det med "showInNav"

export const routes: Route[] = [
    {
        path: "/",
        label: "Home page",
        showInNav: false,
    },
    {
        path: "/browse",
        label: "Browse",
        showInNav: true,
    },
    {
        path: "/watchlist",
        label: "Watchlist",
        showInNav: true,
    },
    {
        path: "/watched",
        label: "Watched",
        showInNav: true,
    },
];

const router = async (): Promise<HTMLElement | DocumentFragment> => {
    const path = window.location.pathname;

    // Om path börjar med /details, extrahera id/nummer om det finns

    if (path.startsWith("/details")) {
        const movieId = Number(path.split("/")[2]);

        // Visa 404-sidan om id/nummer saknas, är noll, negativt eller inte är ett nummer
        if (isNaN(movieId) || movieId <= 0) {
            return notFound();
        }

        try {
            const movie = await getMovieByIdTMDB(movieId);
            return details(movie);
        } catch {
            return notFound();
        }
    }

    switch (path) {
        case "/":
        case "/browse":
            return browse();
        case "/watchlist":
            return watchlist();
        case "/watched":
            return watched();
        default:
            return notFound();
    }
};

export default router;
