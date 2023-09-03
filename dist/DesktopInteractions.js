import { erc721MenuToggle, erc1155MenuToggle, erc20MenuToggle, assetPopUpContainer, erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, toggleFullscreen, closeFullscreen, closeMenu, offerTab, requestTab, finalizeTermsTab, selectAssetsH2, termAssetsH2, } from "./FrontEndElements.js";
erc721MenuToggle.addEventListener("click", () => {
    erc1155MenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc721MenuPopUp.style.display = "block";
});
erc1155MenuToggle.addEventListener("click", () => {
    erc20MenuPopUp.style.display = "none";
    erc721MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc1155MenuPopUp.style.display = "block";
});
erc20MenuToggle.addEventListener("click", () => {
    erc721MenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc20MenuPopUp.style.display = "block";
});
toggleFullscreen.addEventListener("click", () => {
    if (assetPopUpContainer.style.height == "50%") {
        assetPopUpContainer.style.height = "100%";
        toggleFullscreen.style.display = "none";
        closeFullscreen.style.display = "block";
        closeMenu.style.display = "none";
    }
    else {
        assetPopUpContainer.style.height = "50%";
        toggleFullscreen.style.display = "block";
        closeFullscreen.style.display = "none";
    }
});
closeFullscreen.addEventListener("click", () => {
    if (assetPopUpContainer.style.height == "100%") {
        assetPopUpContainer.style.height = "0";
        toggleFullscreen.style.display = "none";
        closeFullscreen.style.display = "none";
        assetPopUpContainer.style.border = "none";
        closeMenu.style.display = "none";
    }
    else {
        assetPopUpContainer.style.height = "100%";
        toggleFullscreen.style.display = "none";
        closeFullscreen.style.display = "block";
        assetPopUpContainer.style.border = "1px solid rgba(152, 161, 192, 0.24)";
    }
});
closeMenu.addEventListener("click", () => {
    assetPopUpContainer.style.height = "0";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "none";
    assetPopUpContainer.style.border = "none";
    closeMenu.style.display = "none";
});
requestTab.addEventListener("click", () => {
    requestTab.style.color = "#FFF";
    offerTab.style.color = "#7F87A2";
    finalizeTermsTab.style.color = "#7F87A2";
    selectAssetsH2.innerHTML = "Select Assets You Want";
    termAssetsH2.innerHTML = "REQUESTED ASSETS";
});
offerTab.addEventListener("click", () => {
    offerTab.style.color = "#FFF";
    requestTab.style.color = "#7F87A2";
    finalizeTermsTab.style.color = "#7F87A2";
    selectAssetsH2.innerHTML = "Select Assets You'll Give";
    termAssetsH2.innerHTML = "OFFERED ASSETS";
});
finalizeTermsTab.addEventListener("click", () => {
    finalizeTermsTab.style.color = "#FFF";
    offerTab.style.color = "#7F87A2";
    requestTab.style.color = "#7F87A2";
});
