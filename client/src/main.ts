import router from "./router.ts";
import {
    loadPopularMovies,
    setRenderCallback,
    getUserList,
} from "./lib/store.ts";
import "./style.css";

const app = document.querySelector("#app")!;

const renderApp = async () => {
    const page = await router();
    app.replaceChildren(page);
};

// Rerender-logic
window.addEventListener("popstate", () => {
    renderApp();
});

// Prevent default link behaivor
document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        window.history.pushState({}, "", path);
        renderApp();
    }
});

// Init
window.addEventListener("DOMContentLoaded", async () => {
    await loadPopularMovies(false);
    await getUserList(); // Hämta användarens listor

    renderApp();
    setRenderCallback(renderApp);
});

// Add date formatting
// Validation for rate select
