import { createTermsList } from "./DisplayTerms.js";
import { erc721MenuToggle, erc1155MenuToggle, erc20MenuToggle, assetPopUpContainer, erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, toggleFullscreen, closeFullscreen, closeMenu, offerTab, requestTab, finalizeTermsTab, selectAssetsH2, termAssetsH2, ethMenuToggle, ethMenuPopUp, selectAssets, termAssets, finalizeTermsDiv, requestedTermsErc721s, requestedTermsErc1155s, requestedTermsErc20s, requestedTermsEth, offeredTermsErc721s, offeredTermsErc1155s, offeredTermsErc20s, offeredTermsEth, } from "./FrontEndElements.js";
import { offeredErc1155s, offeredErc20s, offeredErc721s, offeredEth, wantedErc1155s, wantedErc20s, wantedErc721s, wantedEth, } from "./TokenMenu.js";
erc721MenuToggle.addEventListener("click", () => {
    ethMenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc721MenuPopUp.style.display = "block";
});
erc1155MenuToggle.addEventListener("click", () => {
    ethMenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    erc721MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc1155MenuPopUp.style.display = "block";
});
erc20MenuToggle.addEventListener("click", () => {
    ethMenuPopUp.style.display = "none";
    erc721MenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc20MenuPopUp.style.display = "block";
});
ethMenuToggle.addEventListener("click", () => {
    erc721MenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    ethMenuPopUp.style.display = "block";
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
    closeMenuPopUp();
});
const closeMenuPopUp = () => {
    assetPopUpContainer.style.height = "0";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "none";
    assetPopUpContainer.style.border = "none";
    closeMenu.style.display = "none";
};
requestTab.addEventListener("click", () => {
    requestTab.style.color = "#FFF";
    offerTab.style.color = "#7F87A2";
    finalizeTermsTab.style.color = "#7F87A2";
    selectAssets.style.display = "flex";
    termAssets.style.display = "flex";
    finalizeTermsDiv.style.display = "none";
    selectAssetsH2.innerHTML = "Select Assets You Want";
    termAssetsH2.innerHTML = "REQUESTED ASSETS";
});
offerTab.addEventListener("click", () => {
    offerTab.style.color = "#FFF";
    requestTab.style.color = "#7F87A2";
    finalizeTermsTab.style.color = "#7F87A2";
    selectAssets.style.display = "flex";
    termAssets.style.display = "flex";
    finalizeTermsDiv.style.display = "none";
    selectAssetsH2.innerHTML = "Select Assets You'll Give";
    termAssetsH2.innerHTML = "OFFERED ASSETS";
});
finalizeTermsTab.addEventListener("click", () => {
    finalizeTermsTab.style.color = "#FFF";
    finalizeTermsDiv.style.display = "flex";
    offerTab.style.color = "#7F87A2";
    requestTab.style.color = "#7F87A2";
    selectAssets.style.display = "none";
    termAssets.style.display = "none";
    requestedTermsErc721s.innerHTML = "";
    requestedTermsErc1155s.innerHTML = "";
    requestedTermsErc20s.innerHTML = "";
    requestedTermsEth.innerHTML = "";
    offeredTermsErc721s.innerHTML = "";
    offeredTermsErc1155s.innerHTML = "";
    offeredTermsErc20s.innerHTML = "";
    offeredTermsEth.innerHTML = "";
    closeMenuPopUp();
    createTermsList(wantedErc721s);
    createTermsList(wantedErc1155s);
    createTermsList(wantedErc20s);
    createTermsList(wantedEth);
    createTermsList(offeredErc721s);
    createTermsList(offeredErc1155s);
    createTermsList(offeredErc20s);
    createTermsList(offeredEth);
});
