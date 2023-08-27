"use strict";
const defaultErc721s = [
    {
        imgSrc: "./images/erc721-project-images/rareshipLogo.png",
        name: "Rareships",
        symbol: "RSHPS",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
const defaultErc1155s = [
    {
        imgSrc: "./images/erc155-project-images/bloodcrystal.png",
        name: "Blood Crytals",
        symbol: "BLOOD",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
const defaultErc20s = [
    {
        imgSrc: "./images/erc20-project-images/linktokenimage.png",
        name: "Chainlink",
        symbol: "LINK",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
const customErc721s = [
    {
        imgSrc: "./images/erc721-project-images/rareshipLogo.png",
        name: "Rareships",
        symbol: "RSHPS",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
const customErc1155s = [
    {
        imgSrc: "./images/erc155-project-images/bloodcrystal.png",
        name: "Blood Crytals",
        symbol: "BLOOD",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
const customErc20s = [
    {
        imgSrc: "./images/erc20-project-images/linktokenimage.png",
        name: "Chainlink",
        symbol: "LINK",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
document.addEventListener("DOMContentLoaded", () => {
    const erc721MenuPopUp = document.querySelector(".erc721-menu-popup");
    const erc1155MenuPopUp = document.querySelector(".erc1155-menu-popup");
    const erc20MenuPopUp = document.querySelector(".erc20-menu-popup");
    defaultErc721s.forEach((option) => {
        const tokenOptionDiv = document.createElement("div");
        tokenOptionDiv.classList.add("token-option");
        erc721MenuPopUp.appendChild(tokenOptionDiv);
        const optionImageDiv = document.createElement("div");
        optionImageDiv.classList.add("option-image");
        tokenOptionDiv.appendChild(optionImageDiv);
        const optionImage = document.createElement("img");
        optionImage.src = option.imgSrc;
        optionImageDiv.appendChild(optionImage);
        const optionDetailsDiv = document.createElement("div");
        optionDetailsDiv.classList.add("token-details");
        tokenOptionDiv.appendChild(optionDetailsDiv);
        const optionName = document.createElement("div");
        optionName.classList.add("option-name");
        optionName.innerHTML = option.name;
        const optionSymbol = document.createElement("div");
        optionSymbol.classList.add("option-symbol");
        optionSymbol.innerHTML = option.symbol;
        optionDetailsDiv.appendChild(optionName);
        optionDetailsDiv.appendChild(optionSymbol);
        const optionOrderDetailsDiv = document.createElement("div");
        optionOrderDetailsDiv.classList.add("erc721-choice-details");
        tokenOptionDiv.appendChild(optionOrderDetailsDiv);
        const optionTokenId = document.createElement("input");
        optionTokenId.type = "text";
        optionTokenId.placeholder = "Token ID";
        optionTokenId.classList.add("option-token-id");
        const addAssetButton = document.createElement("button");
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-asset");
        optionOrderDetailsDiv.appendChild(optionTokenId);
        optionOrderDetailsDiv.appendChild(addAssetButton);
    });
    defaultErc1155s.forEach((option) => {
        const tokenOptionDiv = document.createElement("div");
        tokenOptionDiv.classList.add("token-option");
        erc1155MenuPopUp.appendChild(tokenOptionDiv);
        const optionImageDiv = document.createElement("div");
        optionImageDiv.classList.add("option-image");
        tokenOptionDiv.appendChild(optionImageDiv);
        const optionImage = document.createElement("img");
        optionImage.src = option.imgSrc;
        optionImageDiv.appendChild(optionImage);
        const optionDetailsDiv = document.createElement("div");
        optionDetailsDiv.classList.add("token-details");
        tokenOptionDiv.appendChild(optionDetailsDiv);
        const optionName = document.createElement("div");
        optionName.classList.add("option-name");
        optionName.innerHTML = option.name;
        const optionSymbol = document.createElement("div");
        optionSymbol.classList.add("option-symbol");
        optionSymbol.innerHTML = option.symbol;
        optionDetailsDiv.appendChild(optionName);
        optionDetailsDiv.appendChild(optionSymbol);
        const optionOrderDetailsDiv = document.createElement("div");
        optionOrderDetailsDiv.classList.add("erc721-choice-details");
        tokenOptionDiv.appendChild(optionOrderDetailsDiv);
        const optionTokenId = document.createElement("input");
        optionTokenId.type = "text";
        optionTokenId.placeholder = "Token ID";
        optionTokenId.classList.add("option-token-id");
        const optionAmount = document.createElement("input");
        optionAmount.placeholder = "Amount";
        optionAmount.type = "text";
        optionAmount.classList.add("option-amount");
        const addAssetButton = document.createElement("button");
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-asset");
        optionOrderDetailsDiv.appendChild(optionTokenId);
        optionOrderDetailsDiv.appendChild(optionAmount);
        optionOrderDetailsDiv.appendChild(addAssetButton);
    });
    defaultErc20s.forEach((option) => {
        const tokenOptionDiv = document.createElement("div");
        tokenOptionDiv.classList.add("token-option");
        erc20MenuPopUp.appendChild(tokenOptionDiv);
        const optionImageDiv = document.createElement("div");
        optionImageDiv.classList.add("option-image");
        tokenOptionDiv.appendChild(optionImageDiv);
        const optionImage = document.createElement("img");
        optionImage.src = option.imgSrc;
        optionImageDiv.appendChild(optionImage);
        const optionDetailsDiv = document.createElement("div");
        optionDetailsDiv.classList.add("token-details");
        tokenOptionDiv.appendChild(optionDetailsDiv);
        const optionName = document.createElement("div");
        optionName.classList.add("option-name");
        optionName.innerHTML = option.name;
        const optionSymbol = document.createElement("div");
        optionSymbol.classList.add("option-symbol");
        optionSymbol.innerHTML = option.symbol;
        optionDetailsDiv.appendChild(optionName);
        optionDetailsDiv.appendChild(optionSymbol);
        const optionOrderDetailsDiv = document.createElement("div");
        optionOrderDetailsDiv.classList.add("erc721-choice-details");
        tokenOptionDiv.appendChild(optionOrderDetailsDiv);
        const optionAmount = document.createElement("input");
        optionAmount.type = "text";
        optionAmount.placeholder = "Amount";
        optionAmount.classList.add("option-amount");
        const addAssetButton = document.createElement("button");
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-asset");
        optionOrderDetailsDiv.appendChild(optionAmount);
        optionOrderDetailsDiv.appendChild(addAssetButton);
    });
});
const erc721MenuToggle = document.querySelector(".choose-erc721");
const assetPopUpContainer = document.querySelector(".asset-popups");
const erc721MenuPopUp = document.querySelector("erc721-menu-popup");
erc721MenuToggle.addEventListener("click", () => {
    erc721MenuPopUp.style.display = "block";
    assetPopUpContainer.style.display = "block";
});
