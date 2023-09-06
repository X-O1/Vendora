import { defaultErc721s, defaultErc1155s, defaultErc20s, defaultNativeTokens, } from "./TokenList.js";
import { erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, requestTab, offerTab, assetPopUpContainer, toggleFullscreen, closeFullscreen, closeMenu, ethMenuPopUp, requestedTermsErc721s, offeredTermsErc721s, requestedTermsErc1155s, offeredTermsErc1155s, requestedTermsErc20s, offeredTermsErc20s, requestedTermsEth, offeredTermsEth, } from "./FrontEndElements.js";
import { createOfferedAssetList, createWantedAssetList, } from "./DisplayTerms.js";
document.addEventListener("DOMContentLoaded", async () => {
    await createTokenList(defaultErc721s);
    await createTokenList(defaultErc1155s);
    await createTokenList(defaultErc20s);
    await createTokenList(defaultNativeTokens);
});
const setItem = async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
const getTokenListInStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};
const deleteStorageItem = (key) => {
    localStorage.removeItem(key);
};
const wantedErc721s = getTokenListInStorage("wantedErc721s") || [];
const wantedErc1155s = getTokenListInStorage("wantedErc1155s") || [];
const wantedErc20s = getTokenListInStorage("wantedErc20s") || [];
const wantedEth = getTokenListInStorage("wantedEth") || [];
const offeredErc721s = getTokenListInStorage("offeredErc721s") || [];
const offeredErc1155s = getTokenListInStorage("offeredErc1155s") || [];
const offeredErc20s = getTokenListInStorage("offeredErc20s") || [];
const offeredEth = getTokenListInStorage("offeredEth") || [];
const createTokenList = async (tokenList) => {
    try {
        tokenList.forEach((option) => {
            const tokenOptionDiv = document.createElement("div");
            const optionImageDiv = document.createElement("div");
            const optionImage = document.createElement("img");
            const optionDetailsDiv = document.createElement("div");
            const optionName = document.createElement("div");
            const optionSymbol = document.createElement("div");
            const optionOrderDetailsDiv = document.createElement("div");
            const optionTokenId = document.createElement("input");
            const optionAmount = document.createElement("input");
            const addWantedAssetButton = document.createElement("button");
            const addOfferedAssetButton = document.createElement("button");
            optionTokenId.classList.add("option-token-id");
            tokenOptionDiv.classList.add("token-option");
            optionImageDiv.classList.add("option-image");
            optionName.classList.add("option-name");
            optionSymbol.classList.add("option-symbol");
            optionOrderDetailsDiv.classList.add("option-order-details");
            optionDetailsDiv.classList.add("token-details");
            optionAmount.classList.add("option-amount");
            addWantedAssetButton.classList.add("add-wanted-asset-button");
            tokenOptionDiv.appendChild(optionImageDiv);
            optionImageDiv.appendChild(optionImage);
            tokenOptionDiv.appendChild(optionDetailsDiv);
            optionDetailsDiv.appendChild(optionName);
            optionDetailsDiv.appendChild(optionSymbol);
            tokenOptionDiv.appendChild(optionOrderDetailsDiv);
            optionImage.src = option.imgSrc;
            optionName.innerText = option.name;
            optionSymbol.innerText = option.symbol;
            optionTokenId.type = "text";
            optionTokenId.placeholder = "Token ID";
            optionAmount.placeholder = "Amount";
            optionAmount.type = "text";
            addWantedAssetButton.innerText = "Request";
            addOfferedAssetButton.innerText = "Offer";
            optionAmount.addEventListener("input", () => {
                optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
                addWantedAssetButton.innerText = "Request";
                addOfferedAssetButton.innerText = "Offer";
                addWantedAssetButton.style.color = "rgb(255, 255, 255)";
                addOfferedAssetButton.style.color = "rgb(255, 255, 255)";
            });
            optionTokenId.addEventListener("input", () => {
                optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
                addWantedAssetButton.innerText = "Request";
                addOfferedAssetButton.innerText = "Offer";
                addWantedAssetButton.style.color = "rgb(255, 255, 255)";
                addOfferedAssetButton.style.color = "rgb(255, 255, 255)";
            });
            requestTab.addEventListener("click", () => {
                addWantedAssetButton.style.display = "block";
                addOfferedAssetButton.style.display = "none";
                requestedTermsErc721s.innerText = "";
                requestedTermsErc1155s.innerText = "";
                requestedTermsErc20s.innerText = "";
                requestedTermsEth.innerText = "";
                createWantedAssetList(wantedErc721s);
                createWantedAssetList(wantedErc1155s);
                createWantedAssetList(wantedErc20s);
                createWantedAssetList(wantedEth);
            });
            offerTab.addEventListener("click", () => {
                addOfferedAssetButton.style.display = "block";
                addWantedAssetButton.style.display = "none";
                offeredTermsErc721s.innerText = "";
                offeredTermsErc1155s.innerText = "";
                offeredTermsErc20s.innerText = "";
                offeredTermsEth.innerText = "";
                createOfferedAssetList(offeredErc721s);
                createOfferedAssetList(offeredErc1155s);
                createOfferedAssetList(offeredErc20s);
                createOfferedAssetList(offeredEth);
            });
            if (tokenList === defaultErc721s) {
                addWantedAssetButton.classList.add("add-wanted-erc721");
                addOfferedAssetButton.classList.add("add-offered-erc721");
                erc721MenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionTokenId);
                optionOrderDetailsDiv.appendChild(addWantedAssetButton);
                optionOrderDetailsDiv.appendChild(addOfferedAssetButton);
                addWantedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < wantedErc721s.length; i++) {
                        if (wantedErc721s[i].symbol === optionSymbol.innerText) {
                            if (wantedErc721s[i].tokenId === optionTokenId.value) {
                                tokenExist = true;
                                break;
                            }
                        }
                    }
                    if (!tokenExist && optionTokenId.value !== "") {
                        wantedErc721s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            tokenId: optionTokenId.value,
                        });
                        setItem("wantedErc721s", wantedErc721s);
                        optionTokenId.value = "";
                    }
                    requestedTermsErc721s.innerText = "";
                    createWantedAssetList(wantedErc721s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredErc721s.length; i++) {
                        if (offeredErc721s[i].symbol === optionSymbol.innerText) {
                            if (offeredErc721s[i].tokenId === optionTokenId.value) {
                                tokenExist = true;
                                break;
                            }
                        }
                    }
                    if (!tokenExist && optionTokenId.value !== "") {
                        offeredErc721s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            tokenId: optionTokenId.value,
                        });
                        setItem("offeredErc721s", offeredErc721s);
                        optionTokenId.value = "";
                    }
                    offeredTermsErc721s.innerText = "";
                    createOfferedAssetList(offeredErc721s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
            }
            else if (tokenList === defaultErc1155s) {
                addWantedAssetButton.classList.add("add-wanted-erc1155");
                addOfferedAssetButton.classList.add("add-offered-erc1155");
                erc1155MenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionTokenId);
                optionOrderDetailsDiv.appendChild(optionAmount);
                optionOrderDetailsDiv.appendChild(addWantedAssetButton);
                optionOrderDetailsDiv.appendChild(addOfferedAssetButton);
                addWantedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < wantedErc1155s.length; i++) {
                        if (wantedErc1155s[i].symbol === optionSymbol.innerText) {
                            if (wantedErc1155s[i].tokenId === optionTokenId.value) {
                                tokenExist = true;
                                break;
                            }
                        }
                    }
                    if (!tokenExist &&
                        optionTokenId.value !== "" &&
                        optionAmount.value !== "") {
                        wantedErc1155s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            tokenId: optionTokenId.value,
                            amount: optionAmount.value,
                        });
                        setItem("wantedErc1155s", wantedErc1155s);
                        optionTokenId.value = "";
                        optionAmount.value = "";
                    }
                    requestedTermsErc1155s.innerText = "";
                    createWantedAssetList(wantedErc1155s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredErc1155s.length; i++) {
                        if (offeredErc1155s[i].symbol === optionSymbol.innerText) {
                            if (offeredErc1155s[i].tokenId === optionTokenId.value) {
                                tokenExist = true;
                                break;
                            }
                        }
                    }
                    if (!tokenExist &&
                        optionTokenId.value !== "" &&
                        optionAmount.value !== "") {
                        offeredErc1155s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            tokenId: optionTokenId.value,
                            amount: optionAmount.value,
                        });
                        setItem("offeredErc1155s", offeredErc1155s);
                        optionTokenId.value = "";
                        optionAmount.value = "";
                    }
                    offeredTermsErc1155s.innerText = "";
                    createOfferedAssetList(offeredErc1155s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
            }
            else if (tokenList === defaultErc20s) {
                addWantedAssetButton.classList.add("add-wanted-erc20");
                addOfferedAssetButton.classList.add("add-offered-erc20");
                erc20MenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionAmount);
                optionOrderDetailsDiv.appendChild(addWantedAssetButton);
                optionOrderDetailsDiv.appendChild(addOfferedAssetButton);
                addWantedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < wantedErc20s.length; i++) {
                        if (wantedErc20s[i].symbol === optionSymbol.innerText) {
                            tokenExist = true;
                            break;
                        }
                    }
                    if (!tokenExist && optionAmount.value !== "") {
                        wantedErc20s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            amount: optionAmount.value,
                        });
                        setItem("wantedErc20s", wantedErc20s);
                    }
                    requestedTermsErc20s.innerText = "";
                    createWantedAssetList(wantedErc20s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredErc20s.length; i++) {
                        if (offeredErc20s[i].symbol === optionSymbol.innerText) {
                            tokenExist = true;
                            break;
                        }
                    }
                    if (!tokenExist && optionAmount.value !== "") {
                        offeredErc20s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            amount: optionAmount.value,
                        });
                        setItem("offeredErc20s", offeredErc20s);
                    }
                    offeredTermsErc20s.innerText = "";
                    createOfferedAssetList(offeredErc20s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
            }
            else if (tokenList === defaultNativeTokens) {
                addWantedAssetButton.classList.add("add-wanted-eth");
                addOfferedAssetButton.classList.add("add-offered-eth");
                ethMenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionAmount);
                optionOrderDetailsDiv.appendChild(addWantedAssetButton);
                optionOrderDetailsDiv.appendChild(addOfferedAssetButton);
                addWantedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < wantedEth.length; i++) {
                        if (wantedEth[i].symbol === optionSymbol.innerText) {
                            tokenExist = true;
                            break;
                        }
                    }
                    if (!tokenExist && optionAmount.value !== "") {
                        wantedEth.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            amount: optionAmount.value,
                        });
                        setItem("wantedEth", wantedEth);
                    }
                    requestedTermsEth.innerText = "";
                    createWantedAssetList(wantedEth);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredEth.length; i++) {
                        if (offeredEth[i].symbol === optionSymbol.innerText) {
                            tokenExist = true;
                            break;
                        }
                    }
                    if (!tokenExist && optionAmount.value !== "") {
                        offeredEth.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerText,
                            amount: optionAmount.value,
                        });
                        setItem("offeredEth", offeredEth);
                    }
                    offeredTermsEth.innerText = "";
                    createOfferedAssetList(offeredEth);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
            }
        });
    }
    catch (error) {
        error: console.log(`${tokenList} failed to load`);
    }
};
export { wantedErc721s, wantedErc1155s, wantedErc20s, wantedEth, offeredErc721s, offeredErc1155s, offeredErc20s, offeredEth, deleteStorageItem, setItem, getTokenListInStorage, };
