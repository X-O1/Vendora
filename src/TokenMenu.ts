import {
  defaultErc721s,
  defaultErc1155s,
  defaultErc20s,
  Erc721Option,
  Erc1155Option,
  Erc20Option,
} from "./TokenList.js";
import {
  erc721MenuPopUp,
  erc1155MenuPopUp,
  erc20MenuPopUp,
} from "./FrontEndElements.js";
import { createWantedList } from "./DisplayTerms.js";

type Erc721Details = {
  imgSrc: string;
  symbol: string;
  tokenId: string;
};
type Erc1155Details = {
  imgSrc: string;
  symbol: string;
  tokenId: string;
  amount: string;
};
type Erc20Details = {
  imgSrc: string;
  symbol: string;
  amount: string;
};

document.addEventListener("DOMContentLoaded", async () => {
  await createTokenList(defaultErc721s);
  await createTokenList(defaultErc1155s);
  await createTokenList(defaultErc20s);
});

// LOCAL STORAGE
const setItem = async (
  key: string,
  value: Erc721Details[] | Erc1155Details[] | Erc20Details[]
) => {
  const stringifiedValue = JSON.stringify(value);
  localStorage.setItem(key, stringifiedValue);
};

const getErc721sInStorage = (key: string): Erc721Details[] | null => {
  const stringifyValue = localStorage.getItem(key);
  if (stringifyValue === null) return null;
  return JSON.parse(stringifyValue) as Erc721Details[];
};
const getErc1155sInStorage = (key: string): Erc1155Details[] | null => {
  const stringifyValue = localStorage.getItem(key);
  if (stringifyValue === null) return null;
  return JSON.parse(stringifyValue) as Erc1155Details[];
};
const getErc20sInStorage = (key: string): Erc20Details[] | null => {
  const stringifyValue = localStorage.getItem(key);
  if (stringifyValue === null) return null;
  return JSON.parse(stringifyValue) as Erc20Details[];
};

const deleteStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};

const wantedErc721s: Erc721Details[] =
  getErc721sInStorage("wantedErc721s") || [];
const wantedErc1155s: Erc1155Details[] =
  getErc1155sInStorage("wantedErc1155s") || [];
const wantedErc20s: Erc20Details[] = getErc20sInStorage("wantedErc20s") || [];

const createTokenList = async (
  tokenTypeList: Erc721Option[] | Erc1155Option[] | Erc20Option[]
) => {
  try {
    tokenTypeList.forEach((option) => {
      const tokenOptionDiv = document.createElement("div");
      const optionImageDiv = document.createElement("div");
      const optionImage = document.createElement("img");
      const optionDetailsDiv = document.createElement("div");
      const optionName = document.createElement("div");
      const optionSymbol = document.createElement("div");
      const optionOrderDetailsDiv = document.createElement(
        "div"
      ) as HTMLDivElement;
      const optionTokenId = document.createElement("input") as HTMLInputElement;
      const optionAmount = document.createElement("input") as HTMLInputElement;
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
      });

      optionTokenId.addEventListener("input", () => {
        optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
      });

      if (tokenTypeList === defaultErc721s) {
        addAssetButton.classList.add("add-erc721");
        erc721MenuPopUp.appendChild(tokenOptionDiv);
        optionOrderDetailsDiv.appendChild(optionTokenId);
        optionOrderDetailsDiv.appendChild(addAssetButton);

        addAssetButton.addEventListener("click", () => {
          let tokenExist: boolean = false;
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
          }
          createWantedList(wantedErc721s);
          console.log("Wanted Erc721s:", getErc721sInStorage("wantedErc721s"));
        });
      } else if (tokenTypeList === defaultErc1155s) {
        addAssetButton.classList.add("add-erc1155");

        erc1155MenuPopUp.appendChild(tokenOptionDiv);
        optionOrderDetailsDiv.appendChild(optionTokenId);
        optionOrderDetailsDiv.appendChild(optionAmount);
        optionOrderDetailsDiv.appendChild(addAssetButton);

        addAssetButton.addEventListener("click", () => {
          let tokenExist: boolean = false;
          for (let i = 0; i < wantedErc1155s.length; i++) {
            if (wantedErc1155s[i].symbol === optionSymbol.innerHTML) {
              if (wantedErc1155s[i].tokenId === optionTokenId.value) {
                tokenExist = true;
                break;
              }
            }
          }
          if (
            !tokenExist &&
            optionTokenId.value !== "" &&
            optionAmount.value !== ""
          ) {
            wantedErc1155s.push({
              imgSrc: optionImage.src,
              symbol: optionSymbol.innerHTML,
              tokenId: optionTokenId.value,
              amount: optionAmount.value,
            });
          }
          setItem("wantedErc1155s", wantedErc1155s);
          createWantedList(wantedErc1155s);
          console.log(
            "Wanted Erc1155s:",
            getErc1155sInStorage("wantedErc1155s")
          );
        });
      } else if (tokenTypeList === defaultErc20s) {
        addAssetButton.classList.add("add-erc20");
        erc20MenuPopUp.appendChild(tokenOptionDiv);
        optionOrderDetailsDiv.appendChild(optionAmount);
        optionOrderDetailsDiv.appendChild(addAssetButton);

        addAssetButton.addEventListener("click", () => {
          let tokenExist: boolean = false;
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
          }
          setItem("wantedErc20s", wantedErc20s);
          createWantedList(wantedErc20s);

          console.log("Wanted Erc20s:", getErc20sInStorage("wantedErc20s"));
        });
      }
    });
  } catch (error) {
    error: console.log(`${tokenTypeList} failed to load`);
  }
};

export {
  getErc721sInStorage,
  getErc1155sInStorage,
  getErc20sInStorage,
  Erc721Details,
  Erc1155Details,
  Erc20Details,
  wantedErc721s,
  wantedErc1155s,
  wantedErc20s,
  deleteStorageItem,
};
