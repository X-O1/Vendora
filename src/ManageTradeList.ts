import { TokenOption } from "./DefaultTokens.js";
import { setTokenDetailsInLocalStorage } from "./LocalStorage.js";

const getTokenIdInputValue = (): string => {
  const tokenId = document.querySelector(".token-id") as HTMLInputElement;
  return tokenId.value;
};
const getTokenAmountInputValue = (): string => {
  const tokenAmount = document.querySelector(
    ".token-amount"
  ) as HTMLInputElement;
  return tokenAmount.value;
};
const getTokenSymbolValue = (): string => {
  const tokenSymbol = document.querySelector(".token-symbol") as HTMLDivElement;
  return tokenSymbol.innerText;
};
const getTokenLogoUriValue = (): string => {
  const tokenLogo = document.querySelector(".token-logo") as HTMLImageElement;
  return tokenLogo.src;
};

const isTokenSymbolInTradeList = (tradeList: TokenOption[]): boolean => {
  const tokenSymbol = getTokenSymbolValue();
  return tradeList.some((token) => token.symbol === tokenSymbol);
};

const isTokenIdInTradeList = (tradeList: TokenOption[]): boolean => {
  const tokenId = getTokenIdInputValue();
  return tradeList.some((token) => token.tokenId === tokenId);
};

const isTokenIdInputValueEmpty = (): boolean => {
  const tokenId = getTokenIdInputValue();
  return tokenId === "";
};

const isTokenAmountInputValueEmpty = (): boolean => {
  const tokenAmount = getTokenAmountInputValue();
  return tokenAmount === "";
};

const addErc721ToTradeList = (tradeList: TokenOption[], key: string) => {
  try {
    if (
      !isTokenSymbolInTradeList(tradeList) &&
      !isTokenIdInTradeList(tradeList) &&
      !isTokenIdInputValueEmpty()
    ) {
      tradeList.push({
        logoURI: getTokenLogoUriValue(),
        symbol: getTokenSymbolValue(),
        tokenId: getTokenIdInputValue(),
      });
      setTokenDetailsInLocalStorage(key, tradeList);
    }
  } catch (error) {
    console.log("Failed to add Erc-721 to trade list", error);
  }
};
const addErc1155ToTradeList = (tradeList: TokenOption[], key: string) => {
  try {
    if (
      !isTokenSymbolInTradeList(tradeList) &&
      !isTokenIdInTradeList(tradeList) &&
      !isTokenIdInputValueEmpty() &&
      !isTokenAmountInputValueEmpty()
    ) {
      tradeList.push({
        logoURI: getTokenLogoUriValue(),
        symbol: getTokenSymbolValue(),
        tokenId: getTokenIdInputValue(),
        amount: getTokenAmountInputValue(),
      });
      setTokenDetailsInLocalStorage(key, tradeList);
    }
  } catch (error) {
    console.log("Failed to add Erc-1155 to trade list", error);
  }
};

const addErc20ToTradeList = (tradeList: TokenOption[], key: string) => {
  try {
    if (
      !isTokenSymbolInTradeList(tradeList) &&
      !isTokenAmountInputValueEmpty()
    ) {
      tradeList.push({
        logoURI: getTokenLogoUriValue(),
        symbol: getTokenSymbolValue(),
        amount: getTokenAmountInputValue(),
      });
      setTokenDetailsInLocalStorage(key, tradeList);
    }
  } catch (error) {
    console.log("Failed to add Erc-20 to trade list", error);
  }
};

const addNativeTokenToTradeList = (tradeList: TokenOption[], key: string) => {
  try {
    if (
      !isTokenSymbolInTradeList(tradeList) &&
      !isTokenAmountInputValueEmpty()
    ) {
      tradeList.push({
        logoURI: getTokenLogoUriValue(),
        symbol: getTokenSymbolValue(),
        amount: getTokenAmountInputValue(),
      });
      setTokenDetailsInLocalStorage(key, tradeList);
    }
  } catch (error) {
    console.log("Failed to add Native Token to trade list", error);
  }
};
