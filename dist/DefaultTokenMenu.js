import { defaultErc1155s, defaultErc20s, defaultErc721s, defaultNativeTokens, } from "./DefaultTokens.js";
import { assetPopUpContainer, closeFullscreen, closeMenu, erc1155MenuPopUp, erc1155MenuToggle, erc20MenuPopUp, erc20MenuToggle, erc721MenuPopUp, erc721MenuToggle, ethMenuPopUp, ethMenuToggle, toggleFullscreen, } from "./FrontEndElements.js";
const createCommonTokenMenuElements = (option) => {
    const tokenOptionDiv = document.createElement("div");
    const tokenImageDiv = document.createElement("div");
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
    tokenImageDiv.classList.add("option-image");
    tokenDetailsDiv.classList.add("token-details");
    tokenName.classList.add("token-name");
    tokenSymbol.classList.add("token-symbol");
    tokenOrderDetailsDiv.classList.add("option-order-details");
    tokenId.classList.add("token-id");
    tokenAmount.classList.add("token-amount");
    offerToken.classList.add("offer-token-button");
    requestToken.classList.add("request-token-button");
    tokenImageDiv.appendChild(tokenLogo);
    tokenDetailsDiv.appendChild(tokenName);
    tokenDetailsDiv.appendChild(tokenSymbol);
    tokenOptionDiv.appendChild(tokenImageDiv);
    tokenOptionDiv.appendChild(tokenDetailsDiv);
    tokenOptionDiv.appendChild(tokenOrderDetailsDiv);
    option.logoURI
        ? (tokenLogo.src = option.logoURI)
        : console.log("logoURI does not exist");
    tokenName.innerText = option.name;
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
        tokenImageDiv,
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
        tokenOption.offerToken.classList.add("offer-erc1155-button");
        tokenOption.requestToken.classList.add("request-erc1155-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenId);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
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
        tokenOption.offerToken.classList.add("offer-erc20-button");
        tokenOption.requestToken.classList.add("request-erc20-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
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
        tokenOption.offerToken.classList.add("offer-eth-button");
        tokenOption.requestToken.classList.add("request-eth-button");
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
        tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);
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
export { createTokenMenu, closeTokenMenu };
