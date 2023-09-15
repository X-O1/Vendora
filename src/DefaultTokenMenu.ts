import {
  defaultErc1155s,
  defaultErc20s,
  defaultErc721s,
  defaultNativeTokens,
  TokenOption,
} from "./DefaultTokens.js";
import {
  assetPopUpContainer,
  closeFullscreen,
  closeMenu,
  erc1155MenuPopUp,
  erc1155MenuToggle,
  erc20MenuPopUp,
  erc20MenuToggle,
  erc721MenuPopUp,
  erc721MenuToggle,
  ethMenuPopUp,
  ethMenuToggle,
  toggleFullscreen,
} from "./FrontEndElements.js";
import {
  offeredErc1155s,
  offeredErc20s,
  offeredErc721s,
  offeredEth,
  requestedErc1155s,
  requestedErc20s,
  requestedErc721s,
  requestedEth,
} from "./LocalStorage.js";
import {
  addEthOrErc20ToTradeList,
  addNftToTradeList,
} from "./ManageTradeList.js";
import {
  displayOfferedTradeList,
  displayRequestedTradeList,
  resetTradeListElementsInnerText,
} from "./TradeListMenu.js";

type TokenMenuElements = {
  tokenOptionDiv: HTMLDivElement;
  tokenLogoDiv: HTMLDivElement;
  tokenLogo: HTMLImageElement;
  tokenDetailsDiv: HTMLDivElement;
  tokenName: HTMLDivElement;
  tokenSymbol: HTMLDivElement;
  tokenAddress: HTMLDivElement;
  tokenOrderDetailsDiv: HTMLDivElement;
  tokenId: HTMLInputElement;
  tokenAmount: HTMLInputElement;
  requestToken: HTMLButtonElement;
  offerToken: HTMLButtonElement;
};

const createCommonTokenMenuElements = (
  option: TokenOption
): TokenMenuElements => {
  const tokenOptionDiv: HTMLDivElement = document.createElement("div");
  const tokenLogoDiv: HTMLDivElement = document.createElement("div");
  const tokenLogo: HTMLImageElement = document.createElement("img");
  const tokenDetailsDiv: HTMLDivElement = document.createElement("div");
  const tokenName: HTMLDivElement = document.createElement("div");
  const tokenSymbol: HTMLDivElement = document.createElement("div");
  const tokenAddress: HTMLDivElement = document.createElement("div");
  const tokenOrderDetailsDiv: HTMLDivElement = document.createElement("div");
  const tokenId: HTMLInputElement = document.createElement("input");
  const tokenAmount: HTMLInputElement = document.createElement("input");
  const requestToken: HTMLButtonElement = document.createElement("button");
  const offerToken: HTMLButtonElement = document.createElement("button");

  tokenOptionDiv.classList.add("token-option");
  tokenLogoDiv.classList.add("token-logo-div");
  tokenLogo.classList.add("token-logo");
  tokenDetailsDiv.classList.add("token-details");
  tokenName.classList.add("token-name");
  tokenSymbol.classList.add("token-symbol");
  tokenAddress.classList.add("token-address");
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

  if (option.logoURI) tokenLogo.src = option.logoURI;
  if (option.name) tokenName.innerText = option.name;
  if (option.address) tokenAddress.innerText = option.address;
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
    tokenAddress,
    tokenOrderDetailsDiv,
    tokenId,
    tokenAmount,
    requestToken,
    offerToken,
  };
};

const removeNonDigitInputs = (input: string): string => {
  return input.replace(/[^\d]/g, "");
};

const createErc721MenuElements = async (token: TokenOption) => {
  try {
    const tokenOption = createCommonTokenMenuElements(token);
    erc721MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
    tokenOption.offerToken.classList.add("offer-erc721-button");
    tokenOption.requestToken.classList.add("request-erc721-button");
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenId);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);

    addNftToTradeListEventListener(
      "requestedErc721s",
      requestedErc721s,
      tokenOption
    );
    addNftToTradeListEventListener(
      "offeredErc721s",
      offeredErc721s,
      tokenOption
    );
  } catch (error) {
    console.log("Failed to create Erc721 menu elements", error);
  }
};
const createErc1155MenuElements = async (token: TokenOption) => {
  try {
    const tokenOption = createCommonTokenMenuElements(token);
    erc1155MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
    tokenOption.offerToken.classList.add("offer-erc1155-button");
    tokenOption.requestToken.classList.add("request-erc1155-button");
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenId);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);

    addNftToTradeListEventListener(
      "requestedErc1155s",
      requestedErc1155s,
      tokenOption
    );
    addNftToTradeListEventListener(
      "offeredErc1155s",
      offeredErc1155s,
      tokenOption
    );
  } catch (error) {
    console.log("Failed to create Erc1155 menu elements", error);
  }
};
const createErc20MenuElements = async (token: TokenOption) => {
  try {
    const tokenOption = createCommonTokenMenuElements(token);
    erc20MenuPopUp.appendChild(tokenOption.tokenOptionDiv);
    tokenOption.offerToken.classList.add("offer-erc20-button");
    tokenOption.requestToken.classList.add("request-erc20-button");
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);

    addEthOrErc20ToTradeListEventListener(
      "requestedErc20s",
      requestedErc20s,
      tokenOption
    );
    addEthOrErc20ToTradeListEventListener(
      "offeredErc20s",
      offeredErc20s,
      tokenOption
    );
  } catch (error) {
    console.log("Failed to create Erc20 menu elements", error);
  }
};
const createNativeTokenMenuElements = async (token: TokenOption) => {
  try {
    const tokenOption = createCommonTokenMenuElements(token);
    ethMenuPopUp.appendChild(tokenOption.tokenOptionDiv);
    tokenOption.offerToken.classList.add("offer-eth-button");
    tokenOption.requestToken.classList.add("request-eth-button");
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.tokenAmount);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.offerToken);
    tokenOption.tokenOrderDetailsDiv.appendChild(tokenOption.requestToken);

    addEthOrErc20ToTradeListEventListener(
      "requestedEth",
      requestedEth,
      tokenOption
    );
    addEthOrErc20ToTradeListEventListener(
      "offeredEth",
      offeredEth,
      tokenOption
    );
  } catch (error) {
    console.log("Failed to create native token menu elements", error);
  }
};

const createTokenMenu = async (defaultTokens: TokenOption[]) => {
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
  } catch (error) {
    error = `Failed to display token menu items`;
    console.log(error);
  }
};

const displayErc721Menu = (): void => {
  ethMenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "44%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  erc721MenuPopUp.style.display = "block";
};

const displayErc1155Menu = (): void => {
  ethMenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";
  erc721MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "44%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  erc1155MenuPopUp.style.display = "block";
};
const displayErc20Menu = (): void => {
  ethMenuPopUp.style.display = "none";
  erc721MenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "44%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  erc20MenuPopUp.style.display = "block";
};
const displayEthMenu = (): void => {
  erc721MenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "44%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  ethMenuPopUp.style.display = "block";
};

const expandTokenMenu = (): void => {
  assetPopUpContainer.style.height = "88%";
  toggleFullscreen.style.display = "none";
  closeFullscreen.style.display = "block";
  closeMenu.style.display = "none";
};
const closeTokenMenu = (): void => {
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

erc721MenuToggle.addEventListener("click", (): void => {
  displayErc721Menu();
});

erc1155MenuToggle.addEventListener("click", (): void => {
  displayErc1155Menu();
});
erc20MenuToggle.addEventListener("click", (): void => {
  displayErc20Menu();
});

ethMenuToggle.addEventListener("click", (): void => {
  displayEthMenu();
});

toggleFullscreen.addEventListener("click", (): void => {
  if (assetPopUpContainer.style.height == "44%") {
    expandTokenMenu();
  }
});
closeFullscreen.addEventListener("click", (): void => {
  if (assetPopUpContainer.style.height == "88%") {
    closeTokenMenu();
  }
});
closeMenu.addEventListener("click", () => {
  closeTokenMenu();
});

const getRequestAssetButton = (): NodeListOf<HTMLButtonElement> => {
  const requestAssetButton: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".request-token-button");

  return requestAssetButton;
};
const getOfferAssetButton = (): NodeListOf<HTMLButtonElement> => {
  const offerAssetButton: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".offer-token-button");

  return offerAssetButton;
};

const addNftToTradeListEventListener = (
  key: string,
  tradeList: TokenOption[],
  menuElements: TokenMenuElements
): void => {
  if (tradeList === requestedErc721s || tradeList === requestedErc1155s) {
    menuElements.requestToken.addEventListener("click", (): void => {
      addNftToTradeList(key, tradeList, menuElements);
      resetTradeListElementsInnerText();
      displayRequestedTradeList();
    });
  }
  if (tradeList === offeredErc721s || tradeList === offeredErc1155s) {
    menuElements.offerToken.addEventListener("click", (): void => {
      addNftToTradeList(key, tradeList, menuElements);
      resetTradeListElementsInnerText();
      displayOfferedTradeList();
    });
  }
};

const addEthOrErc20ToTradeListEventListener = (
  key: string,
  tradeList: TokenOption[],
  menuElements: TokenMenuElements
): void => {
  if (tradeList === requestedErc20s || tradeList === requestedEth) {
    menuElements.requestToken.addEventListener("click", (): void => {
      addEthOrErc20ToTradeList(key, tradeList, menuElements);
      resetTradeListElementsInnerText();
      displayRequestedTradeList();
    });
  }
  if (tradeList === offeredErc20s || tradeList === offeredEth) {
    menuElements.offerToken.addEventListener("click", (): void => {
      addEthOrErc20ToTradeList(key, tradeList, menuElements);
      resetTradeListElementsInnerText();
      displayOfferedTradeList();
    });
  }
};

export {
  createTokenMenu,
  closeTokenMenu,
  getRequestAssetButton,
  getOfferAssetButton,
  TokenMenuElements,
};
