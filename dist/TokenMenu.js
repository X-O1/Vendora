import { defaultErc721s, defaultErc1155s, defaultErc20s, } from "./TokenList.js";
import { erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, termErc721s, termErc1155s, termErc20s, requestTab, offerTab, assetPopUpContainer, toggleFullscreen, closeFullscreen, closeMenu, } from "./FrontEndElements.js";
import { createTermsList } from "./DisplayTerms.js";
document.addEventListener("DOMContentLoaded", async () => {
    await createTokenList(defaultErc721s);
    await createTokenList(defaultErc1155s);
    await createTokenList(defaultErc20s);
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
const offeredErc721s = getTokenListInStorage("offeredErc721s") || [];
const offeredErc1155s = getTokenListInStorage("offeredErc1155s") || [];
const offeredErc20s = getTokenListInStorage("offeredErc20s") || [];
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
            optionName.innerHTML = option.name;
            optionSymbol.innerHTML = option.symbol;
            optionTokenId.type = "text";
            optionTokenId.placeholder = "Token ID";
            optionAmount.placeholder = "Amount";
            optionAmount.type = "text";
            addWantedAssetButton.innerHTML = "Request";
            addOfferedAssetButton.innerHTML = "Offer";
            optionAmount.addEventListener("input", () => {
                optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
                addWantedAssetButton.innerHTML = "Request";
                addOfferedAssetButton.innerHTML = "Offer";
                addWantedAssetButton.style.color = "rgb(255, 255, 255)";
                addOfferedAssetButton.style.color = "rgb(255, 255, 255)";
            });
            optionTokenId.addEventListener("input", () => {
                optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
                addWantedAssetButton.innerHTML = "Request";
                addOfferedAssetButton.innerHTML = "Offer";
                addWantedAssetButton.style.color = "rgb(255, 255, 255)";
                addOfferedAssetButton.style.color = "rgb(255, 255, 255)";
            });
            requestTab.addEventListener("click", () => {
                addWantedAssetButton.style.display = "block";
                addOfferedAssetButton.style.display = "none";
                termErc721s.innerHTML = "";
                termErc1155s.innerHTML = "";
                termErc20s.innerHTML = "";
                createTermsList(wantedErc721s);
                createTermsList(wantedErc1155s);
                createTermsList(wantedErc20s);
            });
            offerTab.addEventListener("click", () => {
                addOfferedAssetButton.style.display = "block";
                addWantedAssetButton.style.display = "none";
                termErc721s.innerHTML = "";
                termErc1155s.innerHTML = "";
                termErc20s.innerHTML = "";
                createTermsList(offeredErc721s);
                createTermsList(offeredErc1155s);
                createTermsList(offeredErc20s);
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
                        if (wantedErc721s[i].symbol === optionSymbol.innerHTML) {
                            if (wantedErc721s[i].tokenId === optionTokenId.value) {
                                tokenExist = true;
                                break;
                            }
                        }
                    }
                    if (!tokenExist && optionTokenId.value !== "") {
                        wantedErc721s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerHTML,
                            tokenId: optionTokenId.value,
                        });
                        setItem("wantedErc721s", wantedErc721s);
                        optionTokenId.value = "";
                    }
                    termErc721s.innerHTML = "";
                    createTermsList(wantedErc721s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredErc721s.length; i++) {
                        if (offeredErc721s[i].symbol === optionSymbol.innerHTML) {
                            if (offeredErc721s[i].tokenId === optionTokenId.value) {
                                tokenExist = true;
                                break;
                            }
                        }
                    }
                    if (!tokenExist && optionTokenId.value !== "") {
                        offeredErc721s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerHTML,
                            tokenId: optionTokenId.value,
                        });
                        setItem("offeredErc721s", offeredErc721s);
                        optionTokenId.value = "";
                    }
                    termErc721s.innerHTML = "";
                    createTermsList(offeredErc721s);
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
                        if (wantedErc1155s[i].symbol === optionSymbol.innerHTML) {
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
                            symbol: optionSymbol.innerHTML,
                            tokenId: optionTokenId.value,
                            amount: optionAmount.value,
                        });
                        setItem("wantedErc1155s", wantedErc1155s);
                        optionTokenId.value = "";
                        optionAmount.value = "";
                    }
                    termErc1155s.innerHTML = "";
                    createTermsList(wantedErc1155s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredErc1155s.length; i++) {
                        if (offeredErc1155s[i].symbol === optionSymbol.innerHTML) {
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
                            symbol: optionSymbol.innerHTML,
                            tokenId: optionTokenId.value,
                            amount: optionAmount.value,
                        });
                        setItem("offeredErc1155s", offeredErc1155s);
                        optionTokenId.value = "";
                        optionAmount.value = "";
                    }
                    termErc1155s.innerHTML = "";
                    createTermsList(offeredErc1155s);
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
                        if (wantedErc20s[i].symbol === optionSymbol.innerHTML) {
                            tokenExist = true;
                            break;
                        }
                    }
                    if (!tokenExist && optionAmount.value !== "") {
                        wantedErc20s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerHTML,
                            amount: optionAmount.value,
                        });
                        setItem("wantedErc20s", wantedErc20s);
                    }
                    termErc20s.innerHTML = "";
                    createTermsList(wantedErc20s);
                    assetPopUpContainer.style.height = "0";
                    toggleFullscreen.style.display = "none";
                    closeFullscreen.style.display = "none";
                    assetPopUpContainer.style.border = "none";
                    closeMenu.style.display = "none";
                });
                addOfferedAssetButton.addEventListener("click", () => {
                    let tokenExist = false;
                    for (let i = 0; i < offeredErc20s.length; i++) {
                        if (offeredErc20s[i].symbol === optionSymbol.innerHTML) {
                            tokenExist = true;
                            break;
                        }
                    }
                    if (!tokenExist && optionAmount.value !== "") {
                        offeredErc20s.push({
                            imgSrc: optionImage.src,
                            symbol: optionSymbol.innerHTML,
                            amount: optionAmount.value,
                        });
                        setItem("offeredErc20s", offeredErc20s);
                    }
                    termErc20s.innerHTML = "";
                    createTermsList(offeredErc20s);
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
export { wantedErc721s, wantedErc1155s, wantedErc20s, offeredErc721s, offeredErc1155s, offeredErc20s, deleteStorageItem, setItem, getTokenListInStorage, };
