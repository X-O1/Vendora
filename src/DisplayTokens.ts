
import {defaultErc721s, defaultErc1155s, defaultErc20s} from './TokenList';

document.addEventListener("DOMContentLoaded", () => {
    const erc721MenuPopUp = document.querySelector(".erc721-menu-popup") as HTMLDivElement;
    const erc1155MenuPopUp = document.querySelector(".erc1155-menu-popup") as HTMLDivElement;
    const erc20MenuPopUp = document.querySelector(".erc20-menu-popup") as HTMLDivElement;
    
    defaultErc721s.forEach((option) => {
        const tokenOptionDiv = document.createElement("div") as HTMLDivElement;
        tokenOptionDiv.classList.add("token-option");
        erc721MenuPopUp.appendChild(tokenOptionDiv);

        const optionImageDiv = document.createElement("div") as HTMLDivElement;
        optionImageDiv.classList.add("option-image");
        tokenOptionDiv.appendChild(optionImageDiv);

        const optionImage = document.createElement("img") as HTMLImageElement;
        optionImage.src = option.imgSrc;
        optionImageDiv.appendChild(optionImage);

        const optionDetailsDiv = document.createElement("div") as HTMLDivElement;
        optionDetailsDiv.classList.add("token-details");
        tokenOptionDiv.appendChild(optionDetailsDiv);

        const optionName = document.createElement("div") as HTMLDivElement;
        optionName.classList.add("option-name");
        optionName.innerHTML = option.name;

        const optionSymbol = document.createElement("div") as HTMLDivElement;
        optionSymbol.classList.add("option-symbol");
        optionSymbol.innerHTML = option.symbol;

        optionDetailsDiv.appendChild(optionName);
        optionDetailsDiv.appendChild(optionSymbol);

        const optionOrderDetailsDiv = document.createElement("div") as HTMLDivElement;
        optionOrderDetailsDiv.classList.add("erc721-choice-details");
        tokenOptionDiv.appendChild(optionOrderDetailsDiv);
    
        const optionTokenId = document.createElement("input") as HTMLInputElement;
        optionTokenId.type = "text";
        optionTokenId.placeholder = "Token ID";
        optionTokenId.classList.add("option-token-id");
    
        const addAssetButton = document.createElement("button") as HTMLButtonElement;
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-asset");
    
        optionOrderDetailsDiv.appendChild(optionTokenId);
        optionOrderDetailsDiv.appendChild(addAssetButton);

    })


    defaultErc1155s.forEach((option) => {
        const tokenOptionDiv = document.createElement("div") as HTMLDivElement;
        tokenOptionDiv.classList.add("token-option");
        erc1155MenuPopUp.appendChild(tokenOptionDiv);

        const optionImageDiv = document.createElement("div") as HTMLDivElement;
        optionImageDiv.classList.add("option-image");
        tokenOptionDiv.appendChild(optionImageDiv);

        const optionImage = document.createElement("img") as HTMLImageElement;
        optionImage.src = option.imgSrc;
        optionImageDiv.appendChild(optionImage);

        const optionDetailsDiv = document.createElement("div") as HTMLDivElement;
        optionDetailsDiv.classList.add("token-details");
        tokenOptionDiv.appendChild(optionDetailsDiv);

        const optionName = document.createElement("div") as HTMLDivElement;
        optionName.classList.add("option-name");
        optionName.innerHTML = option.name;

        const optionSymbol = document.createElement("div") as HTMLDivElement;
        optionSymbol.classList.add("option-symbol");
        optionSymbol.innerHTML = option.symbol;

        optionDetailsDiv.appendChild(optionName);
        optionDetailsDiv.appendChild(optionSymbol);

        const optionOrderDetailsDiv = document.createElement("div") as HTMLDivElement;
        optionOrderDetailsDiv.classList.add("erc721-choice-details");
        tokenOptionDiv.appendChild(optionOrderDetailsDiv);
    
        const optionTokenId = document.createElement("input") as HTMLInputElement;
        optionTokenId.type = "text";
        optionTokenId.placeholder = "Token ID";

        optionTokenId.classList.add("option-token-id");

        const optionAmount = document.createElement("input") as HTMLInputElement;
        optionAmount.placeholder = "Amount";
        optionAmount.type = "text";
        optionAmount.classList.add("option-amount");
    
        const addAssetButton = document.createElement("button") as HTMLButtonElement;
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-asset");
    
        optionOrderDetailsDiv.appendChild(optionTokenId);
        optionOrderDetailsDiv.appendChild(optionAmount);
        optionOrderDetailsDiv.appendChild(addAssetButton);

    })

    defaultErc20s.forEach((option) => {
        const tokenOptionDiv = document.createElement("div") as HTMLDivElement;
        tokenOptionDiv.classList.add("token-option");
        erc20MenuPopUp.appendChild(tokenOptionDiv);

        const optionImageDiv = document.createElement("div") as HTMLDivElement;
        optionImageDiv.classList.add("option-image");
        tokenOptionDiv.appendChild(optionImageDiv);

        const optionImage = document.createElement("img") as HTMLImageElement;
        optionImage.src = option.imgSrc;
        optionImageDiv.appendChild(optionImage);

        const optionDetailsDiv = document.createElement("div") as HTMLDivElement;
        optionDetailsDiv.classList.add("token-details");
        tokenOptionDiv.appendChild(optionDetailsDiv);

        const optionName = document.createElement("div") as HTMLDivElement;
        optionName.classList.add("option-name");
        optionName.innerHTML = option.name;

        const optionSymbol = document.createElement("div") as HTMLDivElement;
        optionSymbol.classList.add("option-symbol");
        optionSymbol.innerHTML = option.symbol;

        optionDetailsDiv.appendChild(optionName);
        optionDetailsDiv.appendChild(optionSymbol);

        const optionOrderDetailsDiv = document.createElement("div") as HTMLDivElement;
        optionOrderDetailsDiv.classList.add("erc721-choice-details");
        tokenOptionDiv.appendChild(optionOrderDetailsDiv);
    
        const optionAmount = document.createElement("input") as HTMLInputElement;
        optionAmount.type = "text";
        optionAmount.placeholder = "Amount";
        optionAmount.classList.add("option-amount");
    
        const addAssetButton = document.createElement("button") as HTMLButtonElement;
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-asset");
    
        optionOrderDetailsDiv.appendChild(optionAmount);
        optionOrderDetailsDiv.appendChild(addAssetButton);

    })

})

const erc721MenuToggle = document.querySelector(".choose-erc721") as HTMLDivElement;
// const erc1155MenuToggle = document.querySelector(".choose-erc1155") as HTMLDivElement;
// const erc20MenuToggle = document.querySelector(".choose-erc20") as HTMLDivElement;
// const toggleFullscreen = document.querySelector(".toggle-fullscreen") as HTMLDivElement;
// const closeFullscreen = document.querySelector(".close-fullscreen") as HTMLDivElement;
const assetPopUpContainer = document.querySelector(".asset-popups") as HTMLDivElement;
const erc721MenuPopUp = document.querySelector("erc721-menu-popup") as HTMLDivElement;

erc721MenuToggle.addEventListener("click", () => {
    erc721MenuPopUp.style.display = "block";
    assetPopUpContainer.style.display = "block";

});