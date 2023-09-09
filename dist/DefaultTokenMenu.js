import { defaultErc1155s, defaultErc20s, defaultErc721s, defaultNativeTokens, } from "./DefaultTokens.js";
import { assetPopUpContainer, closeFullscreen, closeMenu, erc1155MenuPopUp, erc1155MenuToggle, erc20MenuPopUp, erc20MenuToggle, erc721MenuPopUp, erc721MenuToggle, ethMenuPopUp, ethMenuToggle, toggleFullscreen, } from "./FrontEndElements.js";
window.addEventListener("load", async () => {
    Promise.all([
        createTokenMenu(defaultErc721s),
        createTokenMenu(defaultErc1155s),
        createTokenMenu(defaultErc20s),
        createTokenMenu(defaultNativeTokens),
    ]);
});
const createCommonTokenMenuElements = (option) => {
    const tokenOptionDiv = document.createElement("div");
    const optionImageDiv = document.createElement("div");
    const optionImage = document.createElement("img");
    const optionDetailsDiv = document.createElement("div");
    const optionName = document.createElement("div");
    const optionSymbol = document.createElement("div");
    const optionOrderDetailsDiv = document.createElement("div");
    const optionTokenId = document.createElement("input");
    const optionAmount = document.createElement("input");
    const requestAsset = document.createElement("button");
    const offerAsset = document.createElement("button");
    tokenOptionDiv.classList.add("token-option");
    optionImageDiv.classList.add("option-image");
    optionDetailsDiv.classList.add("token-details");
    optionName.classList.add("option-name");
    optionSymbol.classList.add("option-symbol");
    optionOrderDetailsDiv.classList.add("option-order-details");
    optionTokenId.classList.add("option-token-id");
    optionAmount.classList.add("option-amount");
    offerAsset.classList.add("offer-asset-button");
    requestAsset.classList.add("request-asset-button");
    optionImageDiv.appendChild(optionImage);
    optionDetailsDiv.appendChild(optionName);
    optionDetailsDiv.appendChild(optionSymbol);
    tokenOptionDiv.appendChild(optionImageDiv);
    tokenOptionDiv.appendChild(optionDetailsDiv);
    tokenOptionDiv.appendChild(optionOrderDetailsDiv);
    option.logoURI
        ? (optionImage.src = option.logoURI)
        : console.log("logoURI does not exist");
    optionName.innerText = option.name;
    optionSymbol.innerText = option.symbol;
    optionTokenId.type = "text";
    optionTokenId.placeholder = "Token ID";
    optionAmount.placeholder = "Amount";
    optionAmount.type = "text";
    requestAsset.innerText = "Request";
    offerAsset.innerText = "Offer";
    optionAmount.addEventListener("input", () => {
        optionAmount.value = removeNonDigitInputs(optionAmount.value);
    });
    optionTokenId.addEventListener("input", () => {
        optionTokenId.value = removeNonDigitInputs(optionTokenId.value);
    });
    return {
        tokenOptionDiv,
        optionImageDiv,
        optionImage,
        optionDetailsDiv,
        optionName,
        optionSymbol,
        optionOrderDetailsDiv,
        optionTokenId,
        optionAmount,
        requestAsset,
        offerAsset,
    };
};
const removeNonDigitInputs = (input) => {
    return input.replace(/[^\d]/g, "");
};
const createErc721MenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        erc721MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerAsset.classList.add("offer-erc721-button");
        tokenOption.requestAsset.classList.add("request-erc721-button");
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.optionTokenId);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.offerAsset);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.requestAsset);
    }
    catch (error) {
        error = "Failed to create Erc721 menu elements";
        console.log(error);
    }
};
const createErc1155MenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        erc1155MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerAsset.classList.add("offer-erc1155-button");
        tokenOption.requestAsset.classList.add("request-erc1155-button");
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.optionTokenId);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.optionAmount);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.offerAsset);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.requestAsset);
    }
    catch (error) {
        error = "Failed to create Erc1155 menu elements";
        console.log(error);
    }
};
const createErc20MenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        erc20MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerAsset.classList.add("offer-erc20-button");
        tokenOption.requestAsset.classList.add("request-erc20-button");
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.optionAmount);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.offerAsset);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.requestAsset);
    }
    catch (error) {
        error = "Failed to create Erc20 menu elements";
        console.log(error);
    }
};
const createNativeTokenMenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        ethMenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerAsset.classList.add("offer-eth-button");
        tokenOption.requestAsset.classList.add("request-eth-button");
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.optionAmount);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.offerAsset);
        tokenOption.optionOrderDetailsDiv.appendChild(tokenOption.requestAsset);
    }
    catch (error) {
        error = "Failed to create native token menu elements";
        console.log(error);
    }
};
const createTokenMenu = async (defaultTokens) => {
    try {
        defaultTokens.forEach((token) => {
            if (defaultTokens === defaultErc721s) {
                createErc721MenuElements(token);
            }
            if (defaultTokens === defaultErc1155s) {
                createErc1155MenuElements(token);
            }
            if (defaultTokens === defaultErc20s) {
                createErc20MenuElements(token);
            }
            if (defaultTokens === defaultNativeTokens) {
                createNativeTokenMenuElements(token);
            }
        });
    }
    catch (error) {
        error = `Failed to display token menu items`;
        console.log(error);
    }
};
const displayErc721Menu = () => {
    ethMenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "44%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc721MenuPopUp.style.display = "block";
};
const displayErc1155Menu = () => {
    ethMenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    erc721MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "44%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc1155MenuPopUp.style.display = "block";
};
const displayErc20Menu = () => {
    ethMenuPopUp.style.display = "none";
    erc721MenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "44%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    erc20MenuPopUp.style.display = "block";
};
const displayEthMenu = () => {
    erc721MenuPopUp.style.display = "none";
    erc1155MenuPopUp.style.display = "none";
    erc20MenuPopUp.style.display = "none";
    assetPopUpContainer.style.height = "44%";
    toggleFullscreen.style.display = "block";
    closeMenu.style.display = "block";
    ethMenuPopUp.style.display = "block";
};
const expandTokenMenu = () => {
    assetPopUpContainer.style.height = "88%";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "block";
    closeMenu.style.display = "none";
};
const closeTokenMenu = () => {
    assetPopUpContainer.style.height = "0";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "none";
    assetPopUpContainer.style.border = "none";
    closeMenu.style.display = "none";
};
erc721MenuToggle.addEventListener("click", () => {
    displayErc721Menu();
});
erc1155MenuToggle.addEventListener("click", () => {
    displayErc1155Menu();
});
erc20MenuToggle.addEventListener("click", () => {
    displayErc20Menu();
});
ethMenuToggle.addEventListener("click", () => {
    displayEthMenu();
});
toggleFullscreen.addEventListener("click", () => {
    if (assetPopUpContainer.style.height == "44%") {
        expandTokenMenu();
    }
});
closeFullscreen.addEventListener("click", () => {
    if (assetPopUpContainer.style.height == "88%") {
        closeTokenMenu();
    }
});
closeMenu.addEventListener("click", () => {
    closeTokenMenu();
});
export { createTokenMenu, closeTokenMenu };
