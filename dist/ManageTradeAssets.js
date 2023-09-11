import { requestedErc721s } from "./LocalStorage.js";
const getTokenSymbol = () => {
    const tokenSymbol = document.querySelector(".token-symbol");
    return tokenSymbol;
};
const checkIfTokenWasSelected = (tokensInTrade) => {
    const tokenSymbol = getTokenSymbol();
    return tokensInTrade.some((token) => token.symbol === tokenSymbol.innerText);
};
console.log(checkIfTokenWasSelected(requestedErc721s));
