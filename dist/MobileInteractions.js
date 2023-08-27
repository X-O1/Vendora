import { assetPopUpContainer, erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, toggleFullscreen, closeFullscreen, } from "./FrontEndElements.js";
let startY;
assetPopUpContainer.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
});
assetPopUpContainer.addEventListener("touchmove", (e) => {
    let currentY = e.touches[0].clientY;
    if (currentY < startY) {
        openAssetList();
    }
});
erc721MenuPopUp.addEventListener("touchend", (e) => {
    let endY = e.changedTouches[0].clientY;
    if (erc721MenuPopUp.scrollTop === 0) {
        if (endY > startY) {
            closeAssetList();
        }
    }
});
erc1155MenuPopUp.addEventListener("touchend", (e) => {
    let endY = e.changedTouches[0].clientY;
    if (erc1155MenuPopUp.scrollTop === 0) {
        if (endY > startY) {
            closeAssetList();
        }
    }
});
erc20MenuPopUp.addEventListener("touchend", (e) => {
    let endY = e.changedTouches[0].clientY;
    if (erc20MenuPopUp.scrollTop === 0) {
        if (endY > startY) {
            closeAssetList();
        }
    }
});
const openAssetList = () => {
    if (assetPopUpContainer.style.height == "50%") {
        assetPopUpContainer.style.height = "100%";
        closeFullscreen.style.display = "block";
        toggleFullscreen.style.display = "none";
    }
};
const closeAssetList = () => {
    if (assetPopUpContainer.style.height == "100%") {
        assetPopUpContainer.style.height = "0";
        closeFullscreen.style.display = "none";
        toggleFullscreen.style.display = "none";
    }
};
