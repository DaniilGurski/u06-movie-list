export default function backButton() {
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "Go back";
    backButton.addEventListener("click", () => {
        history.back();
    });

    return backButton;
}
