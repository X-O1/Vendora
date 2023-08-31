import { termErc1155s, termErc20s, termErc721s } from "./FrontEndElements.js";
import { wantedErc1155s, wantedErc20s, wantedErc721s, } from "./TokenMenu.js";
document.addEventListener("DOMContentLoaded", () => {
    createWantedList(wantedErc721s);
    createWantedList(wantedErc1155s);
    createWantedList(wantedErc20s);
});
const createWantedList = async (wantedTokenType) => {
    try {
        wantedTokenType === null || wantedTokenType === void 0 ? void 0 : wantedTokenType.forEach((token) => {
            const selectedTermAssetDiv = document.createElement("div");
            const termAssetImageDiv = document.createElement("div");
            const termAssetImage = document.createElement("img");
            const termAssetSymbol = document.createElement("div");
            const termAssetTokenId = document.createElement("div");
            const termAssetAmount = document.createElement("div");
            selectedTermAssetDiv.classList.add("selected-term-asset");
            termAssetImageDiv.classList.add("term-asset-image");
            termAssetSymbol.classList.add("term-asset-symbol");
            termAssetTokenId.classList.add("term-asset-tokenId");
            termAssetAmount.classList.add("term-asset-amount");
            selectedTermAssetDiv.appendChild(termAssetImageDiv);
            termAssetImageDiv.appendChild(termAssetImage);
            selectedTermAssetDiv.appendChild(termAssetSymbol);
            if (wantedTokenType === wantedErc721s) {
                termErc721s.appendChild(selectedTermAssetDiv);
                selectedTermAssetDiv.appendChild(termAssetTokenId);
            }
            else if (wantedTokenType === wantedErc1155s) {
                termErc1155s.appendChild(selectedTermAssetDiv);
                selectedTermAssetDiv.appendChild(termAssetSymbol);
                selectedTermAssetDiv.appendChild(termAssetTokenId);
                selectedTermAssetDiv.appendChild(termAssetAmount);
            }
            else if (wantedTokenType === wantedErc20s) {
                termErc20s.appendChild(selectedTermAssetDiv);
                selectedTermAssetDiv.appendChild(termAssetAmount);
            }
            termAssetImage.src = token.imgSrc;
            termAssetSymbol.innerHTML = token.symbol;
            "amount" in token ? (termAssetAmount.innerHTML = token.amount) : null;
            "tokenId" in token ? (termAssetTokenId.innerHTML = token.tokenId) : null;
        });
    }
    catch (error) {
        error: console.log("Wanted asset list failed to load");
    }
};
export { createWantedList };
