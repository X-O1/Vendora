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
  tokenImage1: HTMLImageElement;
  tokenImage2: HTMLImageElement;
  tokenImage3: HTMLImageElement;
  tokenImage4: HTMLImageElement;
  tradeIdDiv: HTMLDivElement;
  id: HTMLDivElement;
};

type TradeElements = {
  enterTradeButton: HTMLButtonElement;
  approveSellerAssetsButton: HTMLButtonElement;
  approveBuyerAssetsButton: HTMLButtonElement;
  depositButton: HTMLButtonElement;
  cancelButton: HTMLButtonElement;
};

const createTradeMenuElements = (
  tradeId: string,
  div: HTMLDivElement /** tradeName: string,  imgSrc1: string, imgSrc2: string, imgSrc3: string, imgSrc4: string */
): TradeMenuElements | undefined => {
  try {
    const tradeDiv: HTMLDivElement = document.createElement("div");
    const tradeNameDiv: HTMLDivElement = document.createElement("div");
    const tradePreviewDiv: HTMLDivElement = document.createElement("div");
    const tokenImagesDiv: HTMLDivElement = document.createElement("div");
    const tokenImage1: HTMLImageElement = document.createElement("img");
    const tokenImage2: HTMLImageElement = document.createElement("img");
    const tokenImage3: HTMLImageElement = document.createElement("img");
    const tokenImage4: HTMLImageElement = document.createElement("img");
    const tradeIdDiv: HTMLDivElement = document.createElement("div");
    const id: HTMLDivElement = document.createElement("div");

    tradeDiv.classList.add("trade");
    tradeNameDiv.classList.add("trade-name");
    tradePreviewDiv.classList.add("trade-preview");
    tokenImagesDiv.classList.add("token-images");
    tokenImage1.classList.add("token-image");
    tokenImage2.classList.add("token-image");
    tokenImage3.classList.add("token-image");
    tokenImage4.classList.add("token-image");
    tradeIdDiv.classList.add("trade-id");
    id.classList.add("id");

    div.appendChild(tradeDiv);
    tradeDiv.appendChild(tradeNameDiv);
    tradeDiv.appendChild(tradePreviewDiv);
    tradePreviewDiv.appendChild(tokenImagesDiv);
    tokenImagesDiv.appendChild(tokenImage1);
    tokenImagesDiv.appendChild(tokenImage2);
    tokenImagesDiv.appendChild(tokenImage3);
    tokenImagesDiv.appendChild(tokenImage4);
    tradeDiv.appendChild(tradeIdDiv);
    tradeIdDiv.appendChild(id);

    tradeNameDiv.innerText = "Name";
    tokenImage1.src = "./images/erc721-project-images/rareshipLogo.png";
    tokenImage2.src = "./images/erc721-project-images/msamaLogo.png";
    tokenImage3.src = "./images/erc20-project-images/linktokenimage.png";
    tokenImage4.src = "./images/erc20-project-images/samaToken.png";
    id.innerText = tradeId;

    return {
      tradeDiv,
      tradeNameDiv,
      tradePreviewDiv,
      tokenImagesDiv,
      tokenImage1,
      tokenImage2,
      tokenImage3,
      tokenImage4,
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

    enterTradeButton.classList.add("enter-trade");
    approveSellerAssetsButton.classList.add("approve-seller-assets");
    approveBuyerAssetsButton.classList.add("approve-buyer-assets");
    depositButton.classList.add("deposit");
    cancelButton.classList.add("cancel-trade");

    div.appendChild(enterTradeButton);
    div.appendChild(approveSellerAssetsButton);
    div.appendChild(approveBuyerAssetsButton);
    div.appendChild(depositButton);
    div.appendChild(cancelButton);

    enterTradeButton.innerText = "Enter Trade";
    approveSellerAssetsButton.innerText = "Approve Seller Assets";
    approveBuyerAssetsButton.innerText = "Approve Buyer Assets";
    depositButton.innerText = "Deposit";
    cancelButton.innerText = "Cancel and Withdraw";

    return {
      enterTradeButton,
      approveSellerAssetsButton,
      approveBuyerAssetsButton,
      depositButton,
      cancelButton,
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
    backToTrade?.addEventListener("click", displayActiveTradesPage);
    backToTrade2?.addEventListener("click", displayActiveTradesPage2);
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
};
