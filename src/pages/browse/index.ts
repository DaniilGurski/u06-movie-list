import header from "../../components/header";
import footer from "../../components/footer";

export default function browse() {
    const browse = document.createDocumentFragment();
    const content = document.createDocumentFragment();
    const h1 = document.createElement("h1");
    h1.textContent = "Browse";

    content.append(h1);

    browse.append(header(), content, footer());

    return browse;
}
