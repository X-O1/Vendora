// import { getAddTokenButtonElements } from "./BuildTradeMenu.js";
import { TokenOption } from "./DefaultTokens";
// import {
//   deleteStorageItem,
//   getTokenDetailsInLocalStorage,
//   offeredErc1155s,
//   offeredErc20s,
//   offeredErc721s,
//   offeredEth,
//   requestedErc1155s,
//   requestedErc20s,
//   requestedErc721s,
//   requestedEth,
//   setTokenDetailsInLocalStorage,
// } from "./LocalStorage.js";

const getUserTokenOptionInputs = (): [HTMLInputElement, HTMLInputElement] => {
  const tokenId = document.querySelector(".token-id") as HTMLInputElement;
  const tokenAmount = document.querySelector(
    ".token-amount"
  ) as HTMLInputElement;

  return [tokenId, tokenAmount];
};
const getTokenSymbol = (): HTMLDivElement => {
  const tokenSymbol = document.querySelector(".token-symbol") as HTMLDivElement;

  return tokenSymbol;
};

const checkIfTokenIsInTerms = async (tokensInTrade: TokenOption[]) => {
  try {
    const [tokenId, tokenAmount] = getUserTokenOptionInputs();
    const tokenSymbol = getTokenSymbol();

    let tokenExist = false;
    for (let i = 0; i < tokensInTrade.length; i++) {
      if (
        tokensInTrade[i].symbol === tokenSymbol.innerText &&
        tokensInTrade[i].tokenId === tokenId.value
      ) {
      }
    }
  } catch (error) {}
};
