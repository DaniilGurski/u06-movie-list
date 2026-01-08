import router from "./router.ts";
import { setRenderCallback } from "./lib/store.ts";
import "./style.css";

const app = document.querySelector("#app")!;

const renderApp = () => {
    const page = router();
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
renderApp();
setRenderCallback(renderApp);
