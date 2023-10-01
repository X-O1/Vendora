import { closeTokenMenu } from "./DefaultTokenMenu.js";
import { setTokenDetailsInLocalStorage } from "./LocalStorage.js";
import { isEthOrErc20InTradeListToDelete, isNftInTradeListToDelete, } from "./TradeListMenu.js";
const isNftInTradeList = (tradeList, menuElements) => {
    return tradeList.some((token) => token.symbol === menuElements.tokenSymbol.innerText && token.tokenId
        ? token.tokenId.toString() === menuElements.tokenId.value
        : undefined);
};
const isEthOrErc20InTradeList = (tradeList, menuElements) => {
    return tradeList.some((token) => token.symbol === menuElements.tokenSymbol.innerText);
};
const addNftToTradeList = (key, tradeList, menuElements) => {
    try {
        if (!isNftInTradeList(tradeList, menuElements) &&
            menuElements.tokenId.value !== "") {
            tradeList.push({
                logoURI: menuElements.tokenLogo.src,
                name: menuElements.tokenName.innerText,
                symbol: menuElements.tokenSymbol.innerText,
                address: menuElements.tokenAddress.innerText,
                tokenId: BigInt(menuElements.tokenId.value),
                amount: BigInt(menuElements.tokenAmount.value),
            });
            setTokenDetailsInLocalStorage(key, tradeList);
            menuElements.tokenId.value = "";
            menuElements.tokenAmount.value = "";
            closeTokenMenu();
        }
    }
    catch (error) {
        console.error("Failed to add NFT to trade list", error);
    }
};
const addEthOrErc20ToTradeList = (key, tradeList, menuElements) => {
    try {
        if (!isEthOrErc20InTradeList(tradeList, menuElements) &&
            menuElements.tokenAmount.value !== "") {
            tradeList.push({
                logoURI: menuElements.tokenLogo.src,
                name: menuElements.tokenName.innerText,
                symbol: menuElements.tokenSymbol.innerText,
                address: menuElements.tokenAddress.innerText,
                amount: BigInt(menuElements.tokenAmount.value),
            });
            setTokenDetailsInLocalStorage(key, tradeList);
            menuElements.tokenAmount.value = "";
            closeTokenMenu();
        }
    }
    catch (error) {
        console.error("Failed to add Erc-20 token or ETH to trade list", error);
    }
};
const deleteNftFromTradeList = (key, tradeList, menuElements) => {
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
    }
    catch (error) {
        console.error("Failed to delete NFT from trade list", error);
    }
};
const deleteEthOrErc20FromTradeList = (key, tradeList, menuElements) => {
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
    }
    catch (error) {
        console.error("Failed to delete Erc-20 or Eth from trade list", error);
    }
};
export { addNftToTradeList, isNftInTradeList, isEthOrErc20InTradeList, addEthOrErc20ToTradeList, deleteEthOrErc20FromTradeList, deleteNftFromTradeList, };
