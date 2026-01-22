
import { setPageTitle } from "../../lib/utils";

export default function notFound() {
    setPageTitle("Not Found");

    const notFound = document.createElement("div");
    notFound.replaceChildren("Not Found");

    return notFound;
}
