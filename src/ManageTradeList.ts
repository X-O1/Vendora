import { TokenMenuElements, closeTokenMenu } from "./DefaultTokenMenu.js";
import { TokenOption } from "./DefaultTokens.js";
import { setTokenDetailsInLocalStorage } from "./LocalStorage.js";
import {
  CommonTradeListElements,
  isEthOrErc20InTradeListToDelete,
  isNftInTradeListToDelete,
} from "./TradeListMenu.js";

const isNftInTradeList = (
  tradeList: TokenOption[],
  menuElements: TokenMenuElements
): boolean => {
  return tradeList.some(
    (token) =>
      token.symbol === menuElements.tokenSymbol.innerText &&
      token.tokenId === menuElements.tokenId.value
  );
};

const isEthOrErc20InTradeList = (
  tradeList: TokenOption[],
  menuElements: TokenMenuElements
): boolean => {
  return tradeList.some(
    (token) => token.symbol === menuElements.tokenSymbol.innerText
  );
};
const addNftToTradeList = (
  key: string,
  tradeList: TokenOption[],
  menuElements: TokenMenuElements
) => {
  try {
    if (
      !isNftInTradeList(tradeList, menuElements) &&
      menuElements.tokenId.value !== ""
    ) {
      tradeList.push({
        logoURI: menuElements.tokenLogo.src,
        name: menuElements.tokenName.innerText,
        symbol: menuElements.tokenSymbol.innerText,
        address: menuElements.tokenAddress.innerText,
        tokenId: menuElements.tokenId.value,
        amount: menuElements.tokenAmount.value,
      });
      setTokenDetailsInLocalStorage(key, tradeList);
      menuElements.tokenId.value = "";
      menuElements.tokenAmount.value = "";
      closeTokenMenu();
      // createSelectedAssetMenu()
    }
  } catch (error) {
    console.error("Failed to add NFT to trade list", error);
  }
};

const addEthOrErc20ToTradeList = (
  key: string,
  tradeList: TokenOption[],
  menuElements: TokenMenuElements
) => {
  try {
    if (
      !isEthOrErc20InTradeList(tradeList, menuElements) &&
      menuElements.tokenAmount.value !== ""
    ) {
      tradeList.push({
        logoURI: menuElements.tokenLogo.src,
        name: menuElements.tokenName.innerText,
        symbol: menuElements.tokenSymbol.innerText,
        address: menuElements.tokenAddress.innerText,
        amount: menuElements.tokenAmount.value,
      });
      setTokenDetailsInLocalStorage(key, tradeList);
      menuElements.tokenAmount.value = "";
      closeTokenMenu();
    }
    // createSelectedAssetMenu()
  } catch (error) {
    console.error("Failed to add Erc-20 token or ETH to trade list", error);
  }
};

const deleteNftFromTradeList = (
  key: string,
  tradeList: TokenOption[],
  menuElements: CommonTradeListElements
) => {
  try {
    tradeList.forEach((token) => {
      if (isNftInTradeListToDelete(tradeList, menuElements)) {
        const index = tradeList.indexOf(token);
        index !== -1
          ? tradeList.splice(index, 1)
          : console.error("This NFT does not exist in trade list");
      }
    });
    setTokenDetailsInLocalStorage(key, tradeList);
  } catch (error) {
    console.error("Failed to delete NFT from trade list", error);
  }
};
const deleteEthOrErc20FromTradeList = (
  key: string,
  tradeList: TokenOption[],
  menuElements: CommonTradeListElements
) => {
  try {
    tradeList.forEach((token) => {
      if (isEthOrErc20InTradeListToDelete(tradeList, menuElements)) {
        const index = tradeList.indexOf(token);
        index !== -1
          ? tradeList.splice(index, 1)
          : console.error("This Erc-20 or Eth does not exist in trade list");
      }
    });
    setTokenDetailsInLocalStorage(key, tradeList);
  } catch (error) {
    console.error("Failed to delete Erc-20 or Eth from trade list", error);
  }
};

export {
  addNftToTradeList,
  isNftInTradeList,
  isEthOrErc20InTradeList,
  addEthOrErc20ToTradeList,
  deleteEthOrErc20FromTradeList,
  deleteNftFromTradeList,
};
