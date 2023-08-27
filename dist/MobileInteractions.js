import { assetPopUpContainer, toggleFullscreen, closeFullscreen, } from "./FrontEndElements.js";
let startY;
assetPopUpContainer.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
});
assetPopUpContainer.addEventListener("touchmove", (e) => {
    let currentY = e.touches[0].clientY;
    if (currentY < startY) {
        if (assetPopUpContainer.style.height == "50%") {
            assetPopUpContainer.style.height = "100%";
            closeFullscreen.style.display = "block";
            toggleFullscreen.style.display = "none";
        }
    }
});
