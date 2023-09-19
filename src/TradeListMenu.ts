import { TokenOption } from "./DefaultTokens";
import {
  offeredErc1155sDiv,
  offeredErc20sDiv,
  offeredErc721sDiv,
  offeredEthDiv,
  requestedErc1155sDiv,
  requestedErc20sDiv,
  requestedErc721sDiv,
  requestedEthDiv,
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
  deleteEthOrErc20FromTradeList,
  deleteNftFromTradeList,
} from "./ManageTradeList.js";

type CommonTradeListElements = {
  selectedTermAssetDiv: HTMLDivElement;
  termAssetImageDiv: HTMLDivElement;
  termAssetImage: HTMLImageElement;
  termAssetSymbol: HTMLDivElement;
  termAssetTokenIdTitle: HTMLDivElement;
  termAssetTokenId: HTMLDivElement;
  termAssetAmountTitle: HTMLDivElement;
  termAssetAmount: HTMLDivElement;
  termAssetAddress: HTMLDivElement;
  deleteAssetButton: HTMLButtonElement;
};
const createCommonTradeListELements = (
  token: TokenOption
): CommonTradeListElements => {
  const selectedTermAssetDiv = document.createElement("div");
  const termAssetImageDiv = document.createElement("div");
  const termAssetImage = document.createElement("img");
  const termAssetSymbol = document.createElement("div");
  const termAssetTokenIdTitle = document.createElement("div");
  const termAssetTokenId = document.createElement("div");
  const termAssetAmountTitle = document.createElement("div");
  const termAssetAmount = document.createElement("div");
  const termAssetAddress = document.createElement("div");
  const deleteAssetButton = document.createElement("button");

  selectedTermAssetDiv.classList.add("selected-term-asset");
  termAssetImageDiv.classList.add("term-asset-image");
  termAssetSymbol.classList.add("term-asset-symbol");
  termAssetTokenIdTitle.classList.add("term-asset-tokenId-title");
  termAssetTokenId.classList.add("term-asset-tokenId");
  termAssetAmountTitle.classList.add("term-asset-amount-title");
  termAssetAmount.classList.add("term-asset-amount");
  termAssetAddress.classList.add("term-asset-address");
  deleteAssetButton.classList.add("delete-asset");

  termAssetImageDiv.appendChild(termAssetImage);
  selectedTermAssetDiv.appendChild(termAssetImageDiv);
  selectedTermAssetDiv.appendChild(termAssetSymbol);
  selectedTermAssetDiv.appendChild(termAssetAddress);

  if (token.logoURI) termAssetImage.src = token.logoURI;
  if (token.symbol) termAssetSymbol.innerText = token.symbol;
  termAssetTokenIdTitle.innerText = "#";
  termAssetAmountTitle.innerText = "Amt:";
  if (token.amount) termAssetAmount.innerText = token.amount;
  if (token.tokenId) termAssetTokenId.innerText = token.tokenId;
  if (token.address) termAssetAddress.innerText = token.address;

  deleteAssetButton.innerText = "Delete";

  return {
    selectedTermAssetDiv,
    termAssetImageDiv,
    termAssetImage,
    termAssetSymbol,
    termAssetTokenIdTitle,
    termAssetTokenId,
    termAssetAmountTitle,
    termAssetAmount,
    termAssetAddress,
    deleteAssetButton,
  };
};

const createErc721TradeListElements = (
  token: TokenOption,
  tradeListDiv: HTMLDivElement
): void => {
  const tradeListElements = createCommonTradeListELements(token);

  tradeListDiv.appendChild(tradeListElements.selectedTermAssetDiv);

  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetTokenIdTitle
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetTokenId
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.deleteAssetButton
  );

  deleteNftFromTradeListEventListener(
    "requestedErc721s",
    requestedErc721s,
    tradeListElements
  );
  deleteNftFromTradeListEventListener(
    "offeredErc721s",
    offeredErc721s,
    tradeListElements
  );
};
const createErc1155TradeListElements = (
  token: TokenOption,
  tradeListDiv: HTMLDivElement
): void => {
  const tradeListElements = createCommonTradeListELements(token);

  tradeListDiv.appendChild(tradeListElements.selectedTermAssetDiv);

  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetTokenIdTitle
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetTokenId
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetAmountTitle
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetAmount
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.deleteAssetButton
  );
  deleteNftFromTradeListEventListener(
    "requestedErc1155s",
    requestedErc1155s,
    tradeListElements
  );
  deleteNftFromTradeListEventListener(
    "offeredErc1155s",
    offeredErc1155s,
    tradeListElements
  );
};
const createErc20TradeListElements = (
  token: TokenOption,
  tradeListDiv: HTMLDivElement
): void => {
  const tradeListElements = createCommonTradeListELements(token);

  tradeListDiv.appendChild(tradeListElements.selectedTermAssetDiv);

  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetAmountTitle
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetAmount
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.deleteAssetButton
  );
  deleteEthOrErc20FromTradeListEventListener(
    "requestedErc20s",
    requestedErc20s,
    tradeListElements
  );
  deleteEthOrErc20FromTradeListEventListener(
    "offeredErc20s",
    offeredErc20s,
    tradeListElements
  );
};
const createNativeTokenTradeListElements = (
  token: TokenOption,
  tradeListDiv: HTMLDivElement
): void => {
  const tradeListElements = createCommonTradeListELements(token);

  tradeListDiv.appendChild(tradeListElements.selectedTermAssetDiv);

  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetAmountTitle
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetAmount
  );
  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.deleteAssetButton
  );
  deleteEthOrErc20FromTradeListEventListener(
    "requestedEth",
    requestedEth,
    tradeListElements
  );
  deleteEthOrErc20FromTradeListEventListener(
    "offeredEth",
    offeredEth,
    tradeListElements
  );
};

const createRequestedTradeListMenu = (tradeList: TokenOption[]): void => {
  try {
    tradeList.forEach((token): void => {
      if (tradeList === requestedErc721s && tradeList.length !== 0) {
        createErc721TradeListElements(token, requestedErc721sDiv);
        requestedErc721sDiv.style.display = "block";
      }

      if (tradeList === requestedErc1155s && tradeList.length !== 0) {
        createErc1155TradeListElements(token, requestedErc1155sDiv);
        requestedErc1155sDiv.style.display = "block";
      }

      if (tradeList === requestedErc20s && tradeList.length !== 0) {
        createErc20TradeListElements(token, requestedErc20sDiv);
        requestedErc20sDiv.style.display = "block";
      }

      if (tradeList === requestedEth && tradeList.length !== 0) {
        createNativeTokenTradeListElements(token, requestedEthDiv);
        requestedEthDiv.style.display = "block";
      }
    });
  } catch (error) {
    console.error("Failed to create requested trade list menu", error);
  }
};
const createOfferedTradeListMenu = (tradeList: TokenOption[]): void => {
  try {
    tradeList.forEach((token): void => {
      if (tradeList === offeredErc721s && tradeList.length !== 0) {
        createErc721TradeListElements(token, offeredErc721sDiv);
        offeredErc721sDiv.style.display = "block";
      }

      if (tradeList === offeredErc1155s && tradeList.length !== 0) {
        createErc1155TradeListElements(token, offeredErc1155sDiv);
        offeredErc1155sDiv.style.display = "block";
      }

      if (tradeList === offeredErc20s && tradeList.length !== 0) {
        createErc20TradeListElements(token, offeredErc20sDiv);
        offeredErc20sDiv.style.display = "block";
      }

      if (tradeList === offeredEth && tradeList.length !== 0) {
        createNativeTokenTradeListElements(token, offeredEthDiv);
        offeredEthDiv.style.display = "block";
      }
    });
  } catch (error) {
    console.error("Failed to create offered trade list menu", error);
  }
};

const displayRequestedTradeList = async (): Promise<void> => {
  Promise.all([
    createRequestedTradeListMenu(requestedErc721s),
    createRequestedTradeListMenu(requestedErc1155s),
    createRequestedTradeListMenu(requestedErc20s),
    createRequestedTradeListMenu(requestedEth),
  ]);
};

const displayOfferedTradeList = async (): Promise<void> => {
  Promise.all([
    createOfferedTradeListMenu(offeredErc721s),
    createOfferedTradeListMenu(offeredErc1155s),
    createOfferedTradeListMenu(offeredErc20s),
    createOfferedTradeListMenu(offeredEth),
  ]);
};

const displayTradeList = async (): Promise<void> => {
  Promise.all([displayOfferedTradeList(), displayRequestedTradeList()]);
};

const resetRequestedTradeListElementsInnerText = (): void => {
  requestedErc721sDiv.innerText = "";
  requestedErc1155sDiv.innerText = "";
  requestedErc20sDiv.innerText = "";
  requestedEthDiv.innerText = "";
};
const resetOfferedTradeListElementsInnerText = (): void => {
  offeredErc721sDiv.innerText = "";
  offeredErc1155sDiv.innerText = "";
  offeredErc20sDiv.innerText = "";
  offeredEthDiv.innerText = "";
};
const resetTradeListElementsInnerText = (): void => {
  resetOfferedTradeListElementsInnerText();
  resetRequestedTradeListElementsInnerText();
};

const isNftInTradeListToDelete = (
  tradeList: TokenOption[],
  menuElements: CommonTradeListElements
): boolean => {
  return tradeList.some(
    (token) =>
      token.symbol === menuElements.termAssetSymbol.innerText &&
      token.tokenId === menuElements.termAssetTokenId.innerText
  );
};
const isEthOrErc20InTradeListToDelete = (
  tradeList: TokenOption[],
  menuElements: CommonTradeListElements
): boolean => {
  return tradeList.some(
    (token) => token.symbol === menuElements.termAssetSymbol.innerText
  );
};
const deleteNftFromTradeListEventListener = (
  key: string,
  tradeList: TokenOption[],
  menuElements: CommonTradeListElements
): void => {
  if (tradeList === requestedErc721s || tradeList === requestedErc1155s) {
    menuElements.deleteAssetButton.addEventListener("click", (): void => {
      deleteNftFromTradeList(key, tradeList, menuElements);
      resetRequestedTradeListElementsInnerText();
      displayRequestedTradeList();
    });
  }
  if (tradeList === offeredErc721s || tradeList === offeredErc1155s) {
    menuElements.deleteAssetButton.addEventListener("click", (): void => {
      deleteNftFromTradeList(key, tradeList, menuElements);
      resetOfferedTradeListElementsInnerText();
      displayOfferedTradeList();
    });
  }
};

const deleteEthOrErc20FromTradeListEventListener = (
  key: string,
  tradeList: TokenOption[],
  menuElements: CommonTradeListElements
): void => {
  if (tradeList === requestedErc20s || tradeList === requestedEth) {
    menuElements.deleteAssetButton.addEventListener("click", (): void => {
      deleteEthOrErc20FromTradeList(key, tradeList, menuElements);
      resetRequestedTradeListElementsInnerText();
      displayRequestedTradeList();
    });
  }
  if (tradeList === offeredErc20s || tradeList === offeredEth) {
    menuElements.deleteAssetButton.addEventListener("click", (): void => {
      deleteEthOrErc20FromTradeList(key, tradeList, menuElements);
      resetOfferedTradeListElementsInnerText();
      displayOfferedTradeList();
    });
  }
};

window.addEventListener("load", (): void => {
  displayTradeList();
});

export {
  displayOfferedTradeList,
  displayRequestedTradeList,
  displayTradeList,
  resetTradeListElementsInnerText,
  CommonTradeListElements,
  isNftInTradeListToDelete,
  isEthOrErc20InTradeListToDelete,
};
