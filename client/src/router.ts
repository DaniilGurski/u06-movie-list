import browse from "./pages/browse";
import watchlist from "./pages/watchlist";
import notFound from "./pages/notFound";
import watched from "./pages/watched"

const router = (): HTMLElement | DocumentFragment => {
    const path = window.location.pathname;
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
