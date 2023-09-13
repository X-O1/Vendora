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
// import { deleteNftFromTradeList } from "./ManageTradeList";

type CommonTradeListElements = {
  selectedTermAssetDiv: HTMLDivElement;
  termAssetImageDiv: HTMLDivElement;
  termAssetImage: HTMLImageElement;
  termAssetSymbol: HTMLDivElement;
  termAssetTokenIdTitle: HTMLDivElement;
  termAssetTokenId: HTMLDivElement;
  termAssetAmountTitle: HTMLDivElement;
  termAssetAmount: HTMLDivElement;
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
  const deleteAssetButton = document.createElement("button");

  selectedTermAssetDiv.classList.add("selected-term-asset");
  termAssetImageDiv.classList.add("term-asset-image");
  termAssetSymbol.classList.add("term-asset-symbol");
  termAssetTokenIdTitle.classList.add("term-asset-tokenId-title");
  termAssetTokenId.classList.add("term-asset-tokenId");
  termAssetAmountTitle.classList.add("term-asset-amount-title");
  termAssetAmount.classList.add("term-asset-amount");
  deleteAssetButton.classList.add("delete-asset");

  termAssetImageDiv.appendChild(termAssetImage);
  selectedTermAssetDiv.appendChild(termAssetImageDiv);
  selectedTermAssetDiv.appendChild(termAssetSymbol);

  if (token.logoURI) termAssetImage.src = token.logoURI;
  termAssetSymbol.innerText = token.symbol;
  termAssetTokenIdTitle.innerText = "#";
  termAssetAmountTitle.innerText = "Amt:";
  if (token.amount) termAssetAmount.innerText = token.amount;
  if (token.tokenId) termAssetTokenId.innerText = token.tokenId;
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
};
const createErc1155TradeListElements = (
  token: TokenOption,
  tradeListDiv: HTMLDivElement
): void => {
  const tradeListElements = createCommonTradeListELements(token);

  tradeListDiv.appendChild(tradeListElements.selectedTermAssetDiv);

  tradeListElements.selectedTermAssetDiv.appendChild(
    tradeListElements.termAssetSymbol
  );
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
    console.log("Failed to create requested trade list menu", error);
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
    console.log("Failed to create offered trade list menu", error);
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

const resetTradeListElementsInnerText = (): void => {
  requestedErc721sDiv.innerText = "";
  requestedErc1155sDiv.innerText = "";
  requestedErc20sDiv.innerText = "";
  requestedEthDiv.innerText = "";
  offeredErc721sDiv.innerText = "";
  offeredErc1155sDiv.innerText = "";
  offeredErc20sDiv.innerText = "";
  offeredEthDiv.innerText = "";
};

window.addEventListener("load", (): void => {
  displayTradeList();
});

export {
  displayOfferedTradeList,
  displayRequestedTradeList,
  displayTradeList,
  resetTradeListElementsInnerText,
};
