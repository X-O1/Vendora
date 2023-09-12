import { setTokenDetailsInLocalStorage } from "./LocalStorage.js";
const isTokenSymbolInTradeList = (tradeList, menuElements) => {
    const tokenSymbolExist = tradeList.some((token) => token.symbol === menuElements.tokenSymbol.innerText);
    return tokenSymbolExist;
};
const isNftInTradeList = (tradeList, menuElements) => {
    return tradeList.some((item) => item.symbol === menuElements.tokenSymbol.innerText &&
        item.tokenId === menuElements.tokenId.value);
};
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
        }
    }
    catch (error) {
        console.log("Failed to add NFT to trade list", error);
    }
};
const addEthOrErc20ToTradeList = (key, tradeList, menuElements) => {
    try {
        if (!isTokenSymbolInTradeList(tradeList, menuElements) &&
            menuElements.tokenSymbol.innerText !== "") {
        }
        tradeList.push({
            logoURI: menuElements.tokenLogo.src,
            symbol: menuElements.tokenSymbol.innerText,
            amount: menuElements.tokenAmount.value,
        });
        setTokenDetailsInLocalStorage(key, tradeList);
    }
    catch (error) {
        console.log("Failed to add Erc-20 token or ETH to trade list", error);
    }
};
export { addNftToTradeList, isNftInTradeList, isTokenSymbolInTradeList, addEthOrErc20ToTradeList, };
