import {
  activeTradesDiv,
  activeTradesDiv2,
  backToTrade,
  backToTrade2,
  finishTradeContainer,
  finishTradeContainer2,
  searchContainer,
} from "./FrontEndElements";

type TradeMenuElements = {
  tradeDiv: HTMLDivElement;
  tradeNameDiv: HTMLDivElement;
  tradePreviewDiv: HTMLDivElement;
  tokenImagesDiv: HTMLDivElement;

  tradeIdDiv: HTMLDivElement;
  id: HTMLDivElement;
};

type TradeElements = {
  enterTradeButton: HTMLButtonElement;
  approveSellerAssetsButton: HTMLButtonElement;
  approveBuyerAssetsButton: HTMLButtonElement;
  depositButton: HTMLButtonElement;
  cancelButton: HTMLButtonElement;
  deleteTradeButton: HTMLButtonElement;
};
const createTradeMenuElements = (
  tradeId: string,
  div: HTMLDivElement
): TradeMenuElements | undefined => {
  try {
    const tradeDiv: HTMLDivElement = document.createElement("div");
    const tradeNameDiv: HTMLDivElement = document.createElement("div");
    const tradePreviewDiv: HTMLDivElement = document.createElement("div");
    const tokenImagesDiv: HTMLDivElement = document.createElement("div");

    const tradeIdDiv: HTMLDivElement = document.createElement("div");
    const id: HTMLDivElement = document.createElement("div");

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

    tradeNameDiv.innerText = "Name";
    id.innerText = tradeId;

    return {
      tradeDiv,
      tradeNameDiv,
      tradePreviewDiv,
      tokenImagesDiv,

      tradeIdDiv,
      id,
    };
  } catch (error) {
    console.error("Error creating trade menu elements", error);
    return;
  }
};

const createTradeElements = (
  div: HTMLDivElement
): TradeElements | undefined => {
  try {
    const enterTradeButton: HTMLButtonElement =
      document.createElement("button");
    const approveSellerAssetsButton: HTMLButtonElement =
      document.createElement("button");
    const approveBuyerAssetsButton: HTMLButtonElement =
      document.createElement("button");
    const depositButton: HTMLButtonElement = document.createElement("button");
    const cancelButton: HTMLButtonElement = document.createElement("button");
    const deleteTradeButton: HTMLButtonElement =
      document.createElement("button");

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
  } catch (error) {
    console.error("Error creating trade elements", error);
    return;
  }
};

const displayActiveTradesPage = (): void => {
  try {
    activeTradesDiv.style.display = "flex";
    finishTradeContainer.style.display = "none";
  } catch (error) {
    console.log("Error displaying active trades page", error);
  }
};
const displayFinishTradePage = (): void => {
  try {
    activeTradesDiv.style.display = "none";
    finishTradeContainer.style.display = "flex";
  } catch (error) {
    console.log("Error displaying finish trade page", error);
  }
};

const displayActiveTradesPage2 = (): void => {
  try {
    searchContainer.style.display = "block";
    activeTradesDiv2.style.display = "flex";
    finishTradeContainer2.style.display = "none";
  } catch (error) {
    console.log("Error displaying active trades page", error);
  }
};
const displayFinishTradePage2 = (): void => {
  try {
    activeTradesDiv2.style.display = "none";
    finishTradeContainer2.style.display = "flex";
  } catch (error) {
    console.log("Error displaying finish trade page", error);
  }
};

document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
  try {
    backToTrade?.addEventListener("click", (): void => {
      displayActiveTradesPage();
    });
    backToTrade2?.addEventListener("click", (): void => {
      displayActiveTradesPage2();
    });
  } catch (error) {
    console.error("Error loading functions on content loaded");
  }
});

export {
  createTradeMenuElements,
  createTradeElements,
  TradeMenuElements,
  TradeElements,
  displayFinishTradePage,
  displayFinishTradePage2,
  displayActiveTradesPage,
};
