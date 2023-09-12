import { closeTokenMenu } from "./DefaultTokenMenu.js";
import { setTokenDetailsInLocalStorage } from "./LocalStorage.js";
const addNftToTradeList = (key, tradeList, menuElements) => {
    try {
        if (!isNftInTradeList(tradeList, menuElements) &&
            menuElements.tokenId.value !== "") {
            tradeList.push({
                logoURI: menuElements.tokenLogo.src,
                symbol: menuElements.tokenSymbol.innerText,
                tokenId: menuElements.tokenId.value,
                amount: menuElements.tokenAmount.value,
            });
            setTokenDetailsInLocalStorage(key, tradeList);
            menuElements.tokenId.value = "";
            menuElements.tokenAmount.value = "";
            closeTokenMenu();
        }
    }
    catch (error) {
        console.log("Failed to add NFT to trade list", error);
    }
};
const addEthOrErc20ToTradeList = (key, tradeList, menuElements) => {
    try {
        if (!isEthOrErc20InTradeList(tradeList, menuElements) &&
            menuElements.tokenSymbol.innerText !== "") {
        }
        tradeList.push({
            logoURI: menuElements.tokenLogo.src,
            symbol: menuElements.tokenSymbol.innerText,
            amount: menuElements.tokenAmount.value,
        });
        setTokenDetailsInLocalStorage(key, tradeList);
        menuElements.tokenAmount.value = "";
        closeTokenMenu();
    }
    catch (error) {
        console.log("Failed to add Erc-20 token or ETH to trade list", error);
    }
};
const isNftInTradeList = (tradeList, menuElements) => {
    return tradeList.some((token) => token.symbol === menuElements.tokenSymbol.innerText &&
        token.tokenId === menuElements.tokenId.value);
};
const isEthOrErc20InTradeList = (tradeList, menuElements) => {
    const tokenSymbolExist = tradeList.some((token) => token.symbol === menuElements.tokenSymbol.innerText);
    return tokenSymbolExist;
};
export { addNftToTradeList, isNftInTradeList, isEthOrErc20InTradeList, addEthOrErc20ToTradeList, };
