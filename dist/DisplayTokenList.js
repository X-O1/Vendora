import { defaultErc721s, defaultErc1155s, defaultErc20s } from "./TokenList.js";
import { erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, } from "./FrontEndElements.js";
const wantedErc721s = [];
const wantedErc1155s = [];
const wantedErc20s = [];
document.addEventListener("DOMContentLoaded", async () => {
    await createErc721List();
    await createErc1155List();
    await createErc20List();
});
const setItem = (key, value) => {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
};
const getItem = (key) => {
    const stringifyValue = localStorage.getItem(key);
    if (stringifyValue === null)
        return null;
    return JSON.parse(stringifyValue);
};
const createErc721List = async () => {
    try {
        defaultErc721s.forEach((option) => {
            const tokenOptionDiv = document.createElement("div");
            tokenOptionDiv.classList.add("token-option");
            erc721MenuPopUp.appendChild(tokenOptionDiv);
            const optionImageDiv = document.createElement("div");
            optionImageDiv.classList.add("option-image");
            tokenOptionDiv.appendChild(optionImageDiv);
            const optionImage = document.createElement("img");
            optionImage.src = option.imgSrc;
            optionImageDiv.appendChild(optionImage);
            const optionDetailsDiv = document.createElement("div");
            optionDetailsDiv.classList.add("token-details");
            tokenOptionDiv.appendChild(optionDetailsDiv);
            const optionName = document.createElement("div");
            optionName.classList.add("option-name");
            optionName.innerHTML = option.name;
            const optionSymbol = document.createElement("div");
            optionSymbol.classList.add("option-symbol");
            optionSymbol.innerHTML = option.symbol;
            optionDetailsDiv.appendChild(optionName);
            optionDetailsDiv.appendChild(optionSymbol);
            const optionOrderDetailsDiv = document.createElement("div");
            optionOrderDetailsDiv.classList.add("option-order-details");
            tokenOptionDiv.appendChild(optionOrderDetailsDiv);
            const optionTokenId = document.createElement("input");
            optionTokenId.type = "text";
            optionTokenId.placeholder = "Token ID";
            optionTokenId.classList.add("option-token-id");
            optionTokenId.addEventListener("input", () => {
                optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
            });
            const addAssetButton = document.createElement("button");
            addAssetButton.innerHTML = "Add";
            addAssetButton.classList.add("add-asset");
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
                }
                setItem("wantedErc721s", wantedErc721s);
                console.log("Wanted Erc721s:", getItem("wantedErc721s"));
            });
            optionOrderDetailsDiv.appendChild(optionTokenId);
            optionOrderDetailsDiv.appendChild(addAssetButton);
        });
    }
    catch (err) {
        err = "Erc721 list failed to load";
        console.log(err);
    }
};
const createErc1155List = async () => {
    try {
        defaultErc1155s.forEach((option) => {
            const tokenOptionDiv = document.createElement("div");
            tokenOptionDiv.classList.add("token-option");
            erc1155MenuPopUp.appendChild(tokenOptionDiv);
            const optionImageDiv = document.createElement("div");
            optionImageDiv.classList.add("option-image");
            tokenOptionDiv.appendChild(optionImageDiv);
            const optionImage = document.createElement("img");
            optionImage.src = option.imgSrc;
            optionImageDiv.appendChild(optionImage);
            const optionDetailsDiv = document.createElement("div");
            optionDetailsDiv.classList.add("token-details");
            tokenOptionDiv.appendChild(optionDetailsDiv);
            const optionName = document.createElement("div");
            optionName.classList.add("option-name");
            optionName.innerHTML = option.name;
            const optionSymbol = document.createElement("div");
            optionSymbol.classList.add("option-symbol");
            optionSymbol.innerHTML = option.symbol;
            optionDetailsDiv.appendChild(optionName);
            optionDetailsDiv.appendChild(optionSymbol);
            const optionOrderDetailsDiv = document.createElement("div");
            optionOrderDetailsDiv.classList.add("option-order-details");
            tokenOptionDiv.appendChild(optionOrderDetailsDiv);
            const optionTokenId = document.createElement("input");
            optionTokenId.type = "text";
            optionTokenId.placeholder = "Token ID";
            optionTokenId.classList.add("option-token-id");
            optionTokenId.addEventListener("input", () => {
                optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
            });
            const optionAmount = document.createElement("input");
            optionAmount.placeholder = "Amount";
            optionAmount.type = "text";
            optionAmount.classList.add("option-amount");
            optionAmount.addEventListener("input", () => {
                optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
            });
            const addAssetButton = document.createElement("button");
            addAssetButton.innerHTML = "Add";
            addAssetButton.classList.add("add-asset");
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
                }
                setItem("wantedErc1155s", wantedErc1155s);
                console.log("Wanted Erc1155s:", getItem("wantedErc1155s"));
            });
            optionOrderDetailsDiv.appendChild(optionTokenId);
            optionOrderDetailsDiv.appendChild(optionAmount);
            optionOrderDetailsDiv.appendChild(addAssetButton);
        });
    }
    catch (err) {
        err = "Erc1155 list failed to load";
        console.log(err);
    }
};
const createErc20List = async () => {
    try {
        defaultErc20s.forEach((option) => {
            const tokenOptionDiv = document.createElement("div");
            tokenOptionDiv.classList.add("token-option");
            erc20MenuPopUp.appendChild(tokenOptionDiv);
            const optionImageDiv = document.createElement("div");
            optionImageDiv.classList.add("option-image");
            tokenOptionDiv.appendChild(optionImageDiv);
            const optionImage = document.createElement("img");
            optionImage.src = option.imgSrc;
            optionImageDiv.appendChild(optionImage);
            const optionDetailsDiv = document.createElement("div");
            optionDetailsDiv.classList.add("token-details");
            tokenOptionDiv.appendChild(optionDetailsDiv);
            const optionName = document.createElement("div");
            optionName.classList.add("option-name");
            optionName.innerHTML = option.name;
            const optionSymbol = document.createElement("div");
            optionSymbol.classList.add("option-symbol");
            optionSymbol.innerHTML = option.symbol;
            optionDetailsDiv.appendChild(optionName);
            optionDetailsDiv.appendChild(optionSymbol);
            const optionOrderDetailsDiv = document.createElement("div");
            optionOrderDetailsDiv.classList.add("option-order-details");
            tokenOptionDiv.appendChild(optionOrderDetailsDiv);
            const optionAmount = document.createElement("input");
            optionAmount.type = "text";
            optionAmount.placeholder = "Amount";
            optionAmount.classList.add("option-amount");
            optionAmount.addEventListener("input", () => {
                optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
            });
            const addAssetButton = document.createElement("button");
            addAssetButton.innerHTML = "Add";
            addAssetButton.classList.add("add-asset");
            addAssetButton.addEventListener("click", () => {
                let tokenExist = false;
                for (let i = 0; i < wantedErc20s.length; i++) {
                    if (wantedErc20s[i].symbol === optionSymbol.innerHTML) {
                        if (wantedErc20s[i].symbol === optionSymbol.innerHTML) {
                            tokenExist = true;
                            break;
                        }
                    }
                }
                if (!tokenExist && optionAmount.value !== "") {
                    wantedErc20s.push({
                        imgSrc: optionImage.src,
                        symbol: optionSymbol.innerHTML,
                        amount: optionAmount.value,
                    });
                }
                setItem("wantedErc20s", wantedErc20s);
                console.log("Wanted Erc20s:", getItem("wantedErc20s"));
            });
            optionOrderDetailsDiv.appendChild(optionAmount);
            optionOrderDetailsDiv.appendChild(addAssetButton);
        });
    }
    catch (err) {
        err = "Erc20 list failed to load";
        console.log(err);
    }
};
export { wantedErc721s, wantedErc1155s, wantedErc20s };
