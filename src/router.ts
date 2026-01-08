import browse from "./pages/browse";
import notFound from "./pages/notFound";

const router = (): HTMLElement | DocumentFragment => {
    const path = window.location.pathname;
    switch (path) {
        case "/":
        case "/browse":
            return browse();
        default:
            return notFound();
    }
};

export default router;
