import { offeredErc1155sDivPreview, offeredErc20sDivPreview, offeredErc721sDivPreview, offeredEthDivPreview, requestedErc1155sDivPreview, requestedErc20sDivPreview, requestedErc721sDivPreview, requestedEthDivPreview, } from "./FrontEndElements";
const _createCommonTradePreviewELements = (token) => {
    const selectedTermAssetDiv = document.createElement("div");
    const termAssetImageDiv = document.createElement("div");
    const termAssetImage = document.createElement("img");
    const termAssetSymbol = document.createElement("div");
    const termAssetTokenIdTitle = document.createElement("div");
    const termAssetTokenId = document.createElement("div");
    const termAssetAmountTitle = document.createElement("div");
    const termAssetAmount = document.createElement("div");
    const termAssetAddress = document.createElement("div");
    selectedTermAssetDiv.classList.add("selected-term-asset-preview");
    termAssetImageDiv.classList.add("term-asset-image-preview");
    termAssetSymbol.classList.add("term-asset-symbol-preview");
    termAssetTokenIdTitle.classList.add("term-asset-tokenId-title-preview");
    termAssetTokenId.classList.add("term-asset-tokenId-preview");
    termAssetAmountTitle.classList.add("term-asset-amount-title-preview");
    termAssetAmount.classList.add("term-asset-amount-preview");
    termAssetAddress.classList.add("term-asset-address-preview");
    termAssetImageDiv.appendChild(termAssetImage);
    selectedTermAssetDiv.appendChild(termAssetImageDiv);
    selectedTermAssetDiv.appendChild(termAssetSymbol);
    selectedTermAssetDiv.appendChild(termAssetAddress);
    if (token.logoURI)
        termAssetImage.src = token.logoURI;
    if (token.symbol)
        termAssetSymbol.innerText = token.symbol;
    termAssetTokenIdTitle.innerText = "#";
    termAssetAmountTitle.innerText = "Amt:";
    if (token.amount)
        termAssetAmount.innerText = token.amount.toString();
    if (token.tokenId)
        termAssetTokenId.innerText = token.tokenId.toString();
    if (token.address)
        termAssetAddress.innerText = token.address;
    return {
        selectedTermAssetDiv,
        termAssetImageDiv,
        termAssetImage,
        termAssetSymbol,
        termAssetTokenIdTitle,
        termAssetTokenId,
        termAssetAmountTitle,
        termAssetAmount,
        termAssetAddress,
    };
};
const _createErc721TradePreviewElements = (token, tradePreviewDiv) => {
    const tradePreviewElements = _createCommonTradePreviewELements(token);
    tradePreviewDiv.appendChild(tradePreviewElements.selectedTermAssetDiv);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetTokenIdTitle);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetTokenId);
};
const _createErc1155TradePreviewElements = (token, tradePreviewDiv) => {
    const tradePreviewElements = _createCommonTradePreviewELements(token);
    tradePreviewDiv.appendChild(tradePreviewElements.selectedTermAssetDiv);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetTokenIdTitle);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetTokenId);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetAmountTitle);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetAmount);
};
const _createErc20TradePreviewElements = (token, tradePreviewDiv) => {
    const tradePreviewElements = _createCommonTradePreviewELements(token);
    tradePreviewDiv.appendChild(tradePreviewElements.selectedTermAssetDiv);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetAmountTitle);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetAmount);
};
const _createNativeTokenTradePreviewElements = (token, tradePreviewDiv) => {
    const tradePreviewElements = _createCommonTradePreviewELements(token);
    tradePreviewDiv.appendChild(tradePreviewElements.selectedTermAssetDiv);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetAmountTitle);
    tradePreviewElements.selectedTermAssetDiv.appendChild(tradePreviewElements.termAssetAmount);
};
const _createRequestedErc721PreviewMenu = (tradeListPreview) => {
    requestedErc721sDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            requestedErc721sDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createErc721TradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create requested erc721 trade preview menu", error);
        }
    }
};
const _createRequestedErc1155PreviewMenu = (tradeListPreview) => {
    requestedErc1155sDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            requestedErc1155sDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createErc1155TradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create requested erc1155 trade preview menu", error);
        }
    }
};
const _createRequestedErc20PreviewMenu = (tradeListPreview) => {
    requestedErc20sDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            requestedErc20sDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createErc20TradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create requested erc20 trade preview menu", error);
        }
    }
};
const _createRequestedEthPreviewMenu = (tradeListPreview) => {
    requestedEthDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            requestedEthDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createNativeTokenTradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create requested eth trade preview menu", error);
        }
    }
};
const _createOfferedErc721PreviewMenu = (tradeListPreview) => {
    offeredErc721sDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            offeredErc721sDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createErc721TradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create offered erc721 trade preview menu", error);
        }
    }
};
const _createOfferedErc1155PreviewMenu = (tradeListPreview) => {
    offeredErc1155sDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            offeredErc1155sDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createErc1155TradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create offered erc1155 trade preview menu", error);
        }
    }
};
const _createOfferedErc20PreviewMenu = (tradeListPreview) => {
    offeredErc20sDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            offeredErc20sDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createErc20TradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create offered erc20 trade preview menu", error);
        }
    }
};
const _createOfferedEthPreviewMenu = (tradeListPreview) => {
    offeredEthDivPreview.forEach((element) => (element.innerHTML = ""));
    if ((tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.length) !== 0) {
        try {
            offeredEthDivPreview.forEach((element) => {
                element.style.display = "block";
                tradeListPreview === null || tradeListPreview === void 0 ? void 0 : tradeListPreview.forEach((token) => {
                    _createNativeTokenTradePreviewElements(token, element);
                });
            });
        }
        catch (error) {
            console.error("Failed to create offered eth trade preview menu", error);
        }
    }
};
export { _createRequestedErc721PreviewMenu, _createRequestedErc1155PreviewMenu, _createRequestedErc20PreviewMenu, _createRequestedEthPreviewMenu, _createOfferedErc721PreviewMenu, _createOfferedErc1155PreviewMenu, _createOfferedErc20PreviewMenu, _createOfferedEthPreviewMenu, };
