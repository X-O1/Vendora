import { defaultErc721s, defaultErc1155s, defaultErc20s, } from "./TokenList.js";
import { erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, termErc721s, termErc1155s, termErc20s, } from "./FrontEndElements.js";
import { createWantedList } from "./DisplayTerms.js";
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
            const addAssetButton = document.createElement("button");
            optionTokenId.classList.add("option-token-id");
            tokenOptionDiv.classList.add("token-option");
            optionImageDiv.classList.add("option-image");
            optionName.classList.add("option-name");
            optionSymbol.classList.add("option-symbol");
            optionOrderDetailsDiv.classList.add("option-order-details");
            optionDetailsDiv.classList.add("token-details");
            optionAmount.classList.add("option-amount");
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
            addAssetButton.innerHTML = "Add";
            optionAmount.addEventListener("input", () => {
                optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
                addAssetButton.innerHTML = "Add";
                addAssetButton.style.color = "rgb(255, 255, 255)";
            });
            optionTokenId.addEventListener("input", () => {
                optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
                addAssetButton.innerHTML = "Add";
                addAssetButton.style.color = "rgb(255, 255, 255)";
            });
            if (tokenList === defaultErc721s) {
                addAssetButton.classList.add("add-erc721");
                erc721MenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionTokenId);
                optionOrderDetailsDiv.appendChild(addAssetButton);
                addAssetButton.addEventListener("click", () => {
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
                        addAssetButton.innerHTML = "Added";
                        addAssetButton.style.color = "green";
                        optionTokenId.value = "";
                    }
                    termErc721s.innerHTML = "";
                    createWantedList(wantedErc721s);
                });
            }
            else if (tokenList === defaultErc1155s) {
                addAssetButton.classList.add("add-erc1155");
                erc1155MenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionTokenId);
                optionOrderDetailsDiv.appendChild(optionAmount);
                optionOrderDetailsDiv.appendChild(addAssetButton);
                addAssetButton.addEventListener("click", () => {
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
                        addAssetButton.innerHTML = "Added";
                        addAssetButton.style.color = "green";
                    }
                    termErc1155s.innerHTML = "";
                    createWantedList(wantedErc1155s);
                });
            }
            else if (tokenList === defaultErc20s) {
                addAssetButton.classList.add("add-erc20");
                erc20MenuPopUp.appendChild(tokenOptionDiv);
                optionOrderDetailsDiv.appendChild(optionAmount);
                optionOrderDetailsDiv.appendChild(addAssetButton);
                addAssetButton.addEventListener("click", () => {
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
                        addAssetButton.innerHTML = "Added";
                        addAssetButton.style.color = "green";
                    }
                    termErc20s.innerHTML = "";
                    createWantedList(wantedErc20s);
                });
            }
        });
    }
    catch (error) {
        error: console.log(`${tokenList} failed to load`);
    }
};
export { wantedErc721s, wantedErc1155s, wantedErc20s, deleteStorageItem, setItem, getTokenListInStorage, };
