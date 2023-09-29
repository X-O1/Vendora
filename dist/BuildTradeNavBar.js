import { closeTokenMenu, getOfferAssetButton, getRequestAssetButton, } from "./DefaultTokenMenu.js";
import { offerTab, requestTab, finalizeTermsTab, selectAssetsH2, selectAssets, finalizeTermsDiv, requestedAssets, offeredAssets, offeredAssetsTitle, requestedAssetsTitle, setTermsButton, } from "./FrontEndElements.js";
import { displayOfferedTradeList, displayRequestedTradeList, displayTradeList, resetTradeListElementsInnerText, } from "./TradeListMenu.js";
const displayRequestLinkContent = () => {
    requestTab.style.color = "#FFF";
    offerTab.style.color = "#7F87A2";
    finalizeTermsTab.style.color = "#7F87A2";
    selectAssets.style.display = "flex";
    requestedAssets.style.display = "flex";
    offeredAssets.style.display = "none";
    finalizeTermsDiv.style.height = "50%";
    requestedAssets.style.height = "100%";
    setTermsButton.style.display = "none";
    selectAssetsH2.innerText = "Select Assets You Want";
    resetTradeListElementsInnerText();
    displayRequestedTradeList();
};
const displayOfferLinkContent = () => {
    offerTab.style.color = "#FFF";
    requestTab.style.color = "#7F87A2";
    finalizeTermsTab.style.color = "#7F87A2";
    selectAssets.style.display = "flex";
    requestedAssets.style.display = "none";
    offeredAssets.style.display = "flex";
    finalizeTermsDiv.style.height = "50%";
    offeredAssets.style.height = "100%";
    setTermsButton.style.display = "none";
    selectAssetsH2.innerText = "Select Assets You'll Give";
    resetTradeListElementsInnerText();
    displayOfferedTradeList();
};
const displayFinalizeTermsLinkContent = () => {
    finalizeTermsTab.style.color = "#FFF";
    offerTab.style.color = "#7F87A2";
    requestTab.style.color = "#7F87A2";
    selectAssets.style.display = "none";
    requestedAssets.style.display = "flex";
    offeredAssets.style.display = "flex";
    finalizeTermsDiv.style.height = "100%";
    requestedAssets.style.height = "45%";
    offeredAssets.style.height = "45%";
    offeredAssetsTitle.innerText = "GIVE";
    requestedAssetsTitle.innerText = "RECIEVE";
    setTermsButton.style.display = "flex";
    resetTradeListElementsInnerText();
    displayTradeList();
};
const displayRequestAssetButton = () => {
    getOfferAssetButton().forEach((button) => {
        button.style.display = "none";
    });
    getRequestAssetButton().forEach((button) => {
        button.style.display = "block";
    });
};
const displayOfferAssetButton = () => {
    getOfferAssetButton().forEach((button) => {
        button.style.display = "block";
    });
    getRequestAssetButton().forEach((button) => {
        button.style.display = "none";
    });
};
requestTab.addEventListener("click", async () => {
    displayRequestLinkContent();
    displayRequestAssetButton();
    closeTokenMenu();
});
offerTab.addEventListener("click", async () => {
    displayOfferLinkContent();
    displayOfferAssetButton();
    closeTokenMenu();
});
finalizeTermsTab.addEventListener("click", () => {
    displayFinalizeTermsLinkContent();
    closeTokenMenu();
});