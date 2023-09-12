import { defaultErc1155s, defaultErc20s, defaultErc721s, defaultNativeTokens, } from "./DefaultTokens.js";
import { assetPopUpContainer, closeFullscreen, closeMenu, erc1155MenuPopUp, erc1155MenuToggle, erc20MenuPopUp, erc20MenuToggle, erc721MenuPopUp, erc721MenuToggle, ethMenuPopUp, ethMenuToggle, toggleFullscreen, } from "./FrontEndElements.js";
import { offeredErc1155s, offeredErc20s, offeredErc721s, offeredEth, requestedErc1155s, requestedErc20s, requestedErc721s, requestedEth, } from "./LocalStorage.js";
import { addEthOrErc20ToTradeList, addNftToTradeList, } from "./ManageTradeList.js";
const createCommonTokenMenuElements = (option) => {
    const tokenOptionDiv = document.createElement("div");
    const tokenLogoDiv = document.createElement("div");
    const tokenLogo = document.createElement("img");
    const tokenDetailsDiv = document.createElement("div");
    const tokenName = document.createElement("div");
    const tokenSymbol = document.createElement("div");
    const tokenOrderDetailsDiv = document.createElement("div");
    const tokenId = document.createElement("input");
    const tokenAmount = document.createElement("input");
    const requestToken = document.createElement("button");
    const offerToken = document.createElement("button");
    tokenOptionDiv.classList.add("token-option");
    tokenLogoDiv.classList.add("token-logo-div");
    tokenLogo.classList.add("token-logo");
    tokenDetailsDiv.classList.add("token-details");
    tokenName.classList.add("token-name");
    tokenSymbol.classList.add("token-symbol");
    tokenOrderDetailsDiv.classList.add("option-order-details");
    tokenId.classList.add("token-id");
    tokenAmount.classList.add("token-amount");
    offerToken.classList.add("offer-token-button");
    requestToken.classList.add("request-token-button");
    tokenLogoDiv.appendChild(tokenLogo);
    tokenDetailsDiv.appendChild(tokenName);
    tokenDetailsDiv.appendChild(tokenSymbol);
    tokenOptionDiv.appendChild(tokenLogoDiv);
    tokenOptionDiv.appendChild(tokenDetailsDiv);
    tokenOptionDiv.appendChild(tokenOrderDetailsDiv);
    option.logoURI
        ? (tokenLogo.src = option.logoURI)
        : console.log("logoURI does not exist");
    option.name
        ? (tokenName.innerText = option.name)
        : console.log("Token name does not exist");
    tokenSymbol.innerText = option.symbol;
    tokenId.type = "text";
    tokenId.placeholder = "Token ID";
    tokenAmount.placeholder = "Amount";
    tokenAmount.type = "text";
    requestToken.innerText = "Request";
    offerToken.innerText = "Offer";
    tokenAmount.addEventListener("input", () => {
        tokenAmount.value = removeNonDigitInputs(tokenAmount.value);
    });
    tokenId.addEventListener("input", () => {
        tokenId.value = removeNonDigitInputs(tokenId.value);
    });
    return {
        tokenOptionDiv,
        tokenLogoDiv,
        tokenLogo,
        tokenDetailsDiv,
        tokenName,
        tokenSymbol,
        tokenOrderDetailsDiv,
        tokenId,
        tokenAmount,
        requestToken,
        offerToken,
    };
};
const removeNonDigitInputs = (input) => {
    return input.replace(/[^\d]/g, "");
};
const createErc721MenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        erc721MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerToken.classList.add("offer-erc721-button");
        tokenOption.requestToken.classList.add("request-erc721-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenId);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
        addNftToTradeListEventListener("requestedErc721s", requestedErc721s, tokenOption);
        addNftToTradeListEventListener("offeredErc721s", offeredErc721s, tokenOption);
    }
    catch (error) {
        console.log("Failed to create Erc721 menu elements", error);
    }
};
const createErc1155MenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        erc1155MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerToken.classList.add("offer-erc1155-button");
        tokenOption.requestToken.classList.add("request-erc1155-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenId);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
        addNftToTradeListEventListener("requestedErc1155s", requestedErc1155s, tokenOption);
        addNftToTradeListEventListener("offeredErc1155s", offeredErc1155s, tokenOption);
    }
    catch (error) {
        console.log("Failed to create Erc1155 menu elements", error);
    }
};
const createErc20MenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        erc20MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerToken.classList.add("offer-erc20-button");
        tokenOption.requestToken.classList.add("request-erc20-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
        addEthOrErc20ToTradeListEventListener("requestedErc20s", requestedErc20s, tokenOption);
        addEthOrErc20ToTradeListEventListener("offeredErc20s", offeredErc20s, tokenOption);
    }
    catch (error) {
        console.log("Failed to create Erc20 menu elements", error);
    }
};
const createNativeTokenMenuElements = async (token) => {
    try {
        const tokenOption = createCommonTokenMenuElements(token);
        ethMenuPopUp.appendChild(tokenOption.tokenOptionDiv);
        tokenOption.offerToken.classList.add("offer-eth-button");
        tokenOption.requestToken.classList.add("request-eth-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
        addEthOrErc20ToTradeListEventListener("requestedEth", requestedEth, tokenOption);
        addEthOrErc20ToTradeListEventListener("offeredEth", offeredEth, tokenOption);
    }
    catch (error) {
        console.log("Failed to create native token menu elements", error);
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
window.addEventListener("load", async () => {
    Promise.all([
        createTokenMenu(defaultErc721s),
        createTokenMenu(defaultErc1155s),
        createTokenMenu(defaultErc20s),
        createTokenMenu(defaultNativeTokens),
    ]);
});
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
const getRequestAssetButton = () => {
    const requestAssetButton = document.querySelectorAll(".request-token-button");
    return requestAssetButton;
};
const getOfferAssetButton = () => {
    const offerAssetButton = document.querySelectorAll(".offer-token-button");
    return offerAssetButton;
};
const addNftToTradeListEventListener = (key, tradeList, menuElements) => {
    if (tradeList === requestedErc721s || tradeList === requestedErc1155s) {
        menuElements.requestToken.addEventListener("click", () => {
            addNftToTradeList(key, tradeList, menuElements);
        });
    }
    if (tradeList === offeredErc721s || tradeList === offeredErc1155s) {
        menuElements.offerToken.addEventListener("click", () => {
            addNftToTradeList(key, tradeList, menuElements);
        });
    }
};
const addEthOrErc20ToTradeListEventListener = (key, tradeList, menuElements) => {
    if (tradeList === requestedErc20s || tradeList === requestedEth) {
        menuElements.requestToken.addEventListener("click", () => {
            addEthOrErc20ToTradeList(key, tradeList, menuElements);
        });
    }
    if (tradeList === offeredErc20s || tradeList === offeredEth) {
        menuElements.offerToken.addEventListener("click", () => {
            addEthOrErc20ToTradeList(key, tradeList, menuElements);
        });
    }
};
export { createTokenMenu, closeTokenMenu, getRequestAssetButton, getOfferAssetButton, };
