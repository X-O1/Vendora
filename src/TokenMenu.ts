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

const wantedErc721s: Erc721Details[] = [];
const wantedErc1155s: Erc1155Details[] = [];
const wantedErc20s: Erc20Details[] = [];

document.addEventListener("DOMContentLoaded", async () => {
  await createTokenList(defaultErc721s);
  await createTokenList(defaultErc1155s);
  await createTokenList(defaultErc20s);
});

// LOCAL STORAGE
const setItem = (
  key: string,
  value: Erc721Details[] | Erc1155Details[] | Erc20Details[]
): void => {
  const stringifiedValue = JSON.stringify(value);
  localStorage.setItem(key, stringifiedValue);
};

const getItem = (
  key: string
): Erc721Details[] | Erc1155Details[] | Erc20Details[] | null => {
  const stringifyValue = localStorage.getItem(key);
  if (stringifyValue === null) return null;
  return JSON.parse(stringifyValue) as
    | Erc721Details[]
    | Erc1155Details[]
    | Erc20Details[];
};

const createTokenList = async (
  tokenTypeList: Erc721Option[] | Erc1155Option[] | Erc20Option[]
) => {
  try {
    tokenTypeList.forEach((option) => {
      const tokenOptionDiv = document.createElement("div");
      tokenOptionDiv.classList.add("token-option");

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

      const optionOrderDetailsDiv = document.createElement(
        "div"
      ) as HTMLDivElement;
      optionOrderDetailsDiv.classList.add("option-order-details");
      tokenOptionDiv.appendChild(optionOrderDetailsDiv);

      if (tokenTypeList === defaultErc721s) {
        erc721MenuPopUp.appendChild(tokenOptionDiv);

        const optionTokenId = document.createElement(
          "input"
        ) as HTMLInputElement;
        optionTokenId.type = "text";
        optionTokenId.placeholder = "Token ID";
        optionTokenId.classList.add("option-token-id");

        optionTokenId.addEventListener("input", () => {
          optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
        });

        const addAssetButton = document.createElement("button");
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-erc721");

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
          }
          setItem("wantedErc721s", wantedErc721s);
          console.log("Wanted Erc721s:", getItem("wantedErc721s"));
        });
      } else if (tokenTypeList === defaultErc1155s) {
        erc1155MenuPopUp.appendChild(tokenOptionDiv);

        const optionTokenId = document.createElement(
          "input"
        ) as HTMLInputElement;
        optionTokenId.type = "text";
        optionTokenId.placeholder = "Token ID";
        optionTokenId.classList.add("option-token-id");

        optionTokenId.addEventListener("input", () => {
          optionTokenId.value = optionTokenId.value.replace(/[^\d]/g, "");
        });

        const optionAmount = document.createElement(
          "input"
        ) as HTMLInputElement;
        optionAmount.placeholder = "Amount";
        optionAmount.type = "text";
        optionAmount.classList.add("option-amount");

        optionAmount.addEventListener("input", () => {
          optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
        });

        const addAssetButton = document.createElement("button");
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-erc1155");

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
          console.log("Wanted Erc1155s:", getItem("wantedErc1155s"));
        });
      } else if (tokenTypeList === defaultErc20s) {
        erc20MenuPopUp.appendChild(tokenOptionDiv);

        const optionAmount = document.createElement(
          "input"
        ) as HTMLInputElement;
        optionAmount.type = "text";
        optionAmount.placeholder = "Amount";
        optionAmount.classList.add("option-amount");

        optionAmount.addEventListener("input", () => {
          optionAmount.value = optionAmount.value.replace(/[^\d]/g, "");
        });

        const addAssetButton = document.createElement("button");
        addAssetButton.innerHTML = "Add";
        addAssetButton.classList.add("add-erc20");

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
          console.log("Wanted Erc20s:", getItem("wantedErc20s"));
        });
      }
    });
  } catch (error) {
    error: console.log(`${tokenTypeList} failed to load`);
  }
};

export { getItem, Erc721Details, Erc1155Details, Erc20Details };
