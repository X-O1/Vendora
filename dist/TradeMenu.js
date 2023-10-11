import { activeTradesDiv, activeTradesDiv2, backToTrade, backToTrade2, finishTradeContainer, finishTradeContainer2, searchContainer, } from "./FrontEndElements";
const createTradeMenuElements = (tradeId, div) => {
    try {
        const tradeDiv = document.createElement("div");
        const tradeNameDiv = document.createElement("div");
        const tradePreviewDiv = document.createElement("div");
        const tokenImagesDiv = document.createElement("div");
        const tradeIdDiv = document.createElement("div");
        const id = document.createElement("div");
        tradeDiv.classList.add("trade");
        tradeNameDiv.classList.add("trade-name");
        tradePreviewDiv.classList.add("trade-preview");
        tokenImagesDiv.classList.add("token-images");
        tradeIdDiv.classList.add("trade-id");
        id.classList.add("id");
        div.appendChild(tradeDiv);
        tradeDiv.appendChild(tradeNameDiv);
        tradeDiv.appendChild(tradePreviewDiv);
        tradePreviewDiv.appendChild(tokenImagesDiv);
        tradeDiv.appendChild(tradeIdDiv);
        tradeIdDiv.appendChild(id);
        id.innerText = tradeId;
        return {
            tradeDiv,
            tradeNameDiv,
            tradePreviewDiv,
            tokenImagesDiv,
            tradeIdDiv,
            id,
        };
    }
    catch (error) {
        console.error("Error creating trade menu elements", error);
        return;
    }
};
const createTradeElements = (div) => {
    try {
        const enterTradeButton = document.createElement("button");
        const approveSellerAssetsButton = document.createElement("button");
        const approveBuyerAssetsButton = document.createElement("button");
        const depositButton = document.createElement("button");
        const cancelButton = document.createElement("button");
        const deleteTradeButton = document.createElement("button");
        enterTradeButton.classList.add("enter-trade");
        approveSellerAssetsButton.classList.add("approve-seller-assets");
        approveBuyerAssetsButton.classList.add("approve-buyer-assets");
        depositButton.classList.add("deposit");
        cancelButton.classList.add("cancel-trade");
        deleteTradeButton.classList.add("delete-trade");
        div.appendChild(enterTradeButton);
        div.appendChild(approveSellerAssetsButton);
        div.appendChild(approveBuyerAssetsButton);
        div.appendChild(depositButton);
        div.appendChild(cancelButton);
        div.appendChild(deleteTradeButton);
        enterTradeButton.innerText = "Enter Trade";
        approveSellerAssetsButton.innerText = "Approve Seller Assets";
        approveBuyerAssetsButton.innerText = "Approve Buyer Assets";
        depositButton.innerText = "Deposit";
        cancelButton.innerText = "Cancel and Withdraw";
        deleteTradeButton.innerText = "Delete Trade";
        return {
            enterTradeButton,
            approveSellerAssetsButton,
            approveBuyerAssetsButton,
            depositButton,
            cancelButton,
            deleteTradeButton,
        };
    }
    catch (error) {
        console.error("Error creating trade elements", error);
        return;
    }
};
const displayActiveTradesPage = () => {
    try {
        activeTradesDiv.style.display = "flex";
        finishTradeContainer.style.display = "none";
    }
    catch (error) {
        console.log("Error displaying active trades page", error);
    }
};
const displayFinishTradePage = () => {
    try {
        activeTradesDiv.style.display = "none";
        finishTradeContainer.style.display = "flex";
    }
    catch (error) {
        console.log("Error displaying finish trade page", error);
    }
};
const displayActiveTradesPage2 = () => {
    try {
        searchContainer.style.display = "block";
        activeTradesDiv2.style.display = "flex";
        finishTradeContainer2.style.display = "none";
    }
    catch (error) {
        console.log("Error displaying active trades page", error);
    }
};
const displayFinishTradePage2 = () => {
    try {
        activeTradesDiv2.style.display = "none";
        finishTradeContainer2.style.display = "flex";
    }
    catch (error) {
        console.log("Error displaying finish trade page", error);
    }
};
document.addEventListener("DOMContentLoaded", async () => {
    try {
        backToTrade === null || backToTrade === void 0 ? void 0 : backToTrade.addEventListener("click", () => {
            displayActiveTradesPage();
        });
        backToTrade2 === null || backToTrade2 === void 0 ? void 0 : backToTrade2.addEventListener("click", () => {
            displayActiveTradesPage2();
        });
    }
    catch (error) {
        console.error("Error loading functions on content loaded");
    }
});
export { createTradeMenuElements, createTradeElements, displayFinishTradePage, displayFinishTradePage2, displayActiveTradesPage, };
