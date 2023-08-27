import { defaultErc721s, defaultErc1155s, defaultErc20s } from "./TokenList.js";
import {
  erc721MenuPopUp,
  erc1155MenuPopUp,
  erc20MenuPopUp,
} from "./FrontEndElements.js";

document.addEventListener("DOMContentLoaded", async () => {
  await createErc721List();
  await createErc1155List();
  await createErc20List();
});

const createErc721List = async () => {
  try {
    defaultErc721s.forEach((option) => {
      const tokenOptionDiv = document.createElement("div") as HTMLDivElement;
      tokenOptionDiv.classList.add("token-option");
      erc721MenuPopUp.appendChild(tokenOptionDiv);

      const optionImageDiv = document.createElement("div") as HTMLDivElement;
      optionImageDiv.classList.add("option-image");
      tokenOptionDiv.appendChild(optionImageDiv);

      const optionImage = document.createElement("img") as HTMLImageElement;
      optionImage.src = option.imgSrc;
      optionImageDiv.appendChild(optionImage);

      const optionDetailsDiv = document.createElement("div") as HTMLDivElement;
      optionDetailsDiv.classList.add("token-details");
      tokenOptionDiv.appendChild(optionDetailsDiv);

      const optionName = document.createElement("div") as HTMLDivElement;
      optionName.classList.add("option-name");
      optionName.innerHTML = option.name;

      const optionSymbol = document.createElement("div") as HTMLDivElement;
      optionSymbol.classList.add("option-symbol");
      optionSymbol.innerHTML = option.symbol;

      optionDetailsDiv.appendChild(optionName);
      optionDetailsDiv.appendChild(optionSymbol);

      const optionOrderDetailsDiv = document.createElement(
        "div"
      ) as HTMLDivElement;
      optionOrderDetailsDiv.classList.add("option-order-details");
      tokenOptionDiv.appendChild(optionOrderDetailsDiv);

      const optionTokenId = document.createElement("input") as HTMLInputElement;
      optionTokenId.type = "text";
      optionTokenId.placeholder = "Token ID";
      optionTokenId.classList.add("option-token-id");

      const addAssetButton = document.createElement(
        "button"
      ) as HTMLButtonElement;
      addAssetButton.innerHTML = "Add";
      addAssetButton.classList.add("add-asset");

      optionOrderDetailsDiv.appendChild(optionTokenId);
      optionOrderDetailsDiv.appendChild(addAssetButton);
    });
  } catch (err) {
    err = "Erc721 list failed to load";
    console.log(err);
  }
};

const createErc1155List = async () => {
  try {
    defaultErc1155s.forEach((option) => {
      const tokenOptionDiv = document.createElement("div") as HTMLDivElement;
      tokenOptionDiv.classList.add("token-option");
      erc1155MenuPopUp.appendChild(tokenOptionDiv);

      const optionImageDiv = document.createElement("div") as HTMLDivElement;
      optionImageDiv.classList.add("option-image");
      tokenOptionDiv.appendChild(optionImageDiv);

      const optionImage = document.createElement("img") as HTMLImageElement;
      optionImage.src = option.imgSrc;
      optionImageDiv.appendChild(optionImage);

      const optionDetailsDiv = document.createElement("div") as HTMLDivElement;
      optionDetailsDiv.classList.add("token-details");
      tokenOptionDiv.appendChild(optionDetailsDiv);

      const optionName = document.createElement("div") as HTMLDivElement;
      optionName.classList.add("option-name");
      optionName.innerHTML = option.name;

      const optionSymbol = document.createElement("div") as HTMLDivElement;
      optionSymbol.classList.add("option-symbol");
      optionSymbol.innerHTML = option.symbol;

      optionDetailsDiv.appendChild(optionName);
      optionDetailsDiv.appendChild(optionSymbol);

      const optionOrderDetailsDiv = document.createElement(
        "div"
      ) as HTMLDivElement;
      optionOrderDetailsDiv.classList.add("option-order-details");
      tokenOptionDiv.appendChild(optionOrderDetailsDiv);

      const optionTokenId = document.createElement("input") as HTMLInputElement;
      optionTokenId.type = "text";
      optionTokenId.placeholder = "Token ID";

      optionTokenId.classList.add("option-token-id");

      const optionAmount = document.createElement("input") as HTMLInputElement;
      optionAmount.placeholder = "Amount";
      optionAmount.type = "text";
      optionAmount.classList.add("option-amount");

      const addAssetButton = document.createElement(
        "button"
      ) as HTMLButtonElement;
      addAssetButton.innerHTML = "Add";
      addAssetButton.classList.add("add-asset");

      optionOrderDetailsDiv.appendChild(optionTokenId);
      optionOrderDetailsDiv.appendChild(optionAmount);
      optionOrderDetailsDiv.appendChild(addAssetButton);
    });
  } catch (err) {
    err = "Erc1155 list failed to load";
    console.log(err);
  }
};

const createErc20List = async () => {
  try {
    defaultErc20s.forEach((option) => {
      const tokenOptionDiv = document.createElement("div") as HTMLDivElement;
      tokenOptionDiv.classList.add("token-option");
      erc20MenuPopUp.appendChild(tokenOptionDiv);

      const optionImageDiv = document.createElement("div") as HTMLDivElement;
      optionImageDiv.classList.add("option-image");
      tokenOptionDiv.appendChild(optionImageDiv);

      const optionImage = document.createElement("img") as HTMLImageElement;
      optionImage.src = option.imgSrc;
      optionImageDiv.appendChild(optionImage);

      const optionDetailsDiv = document.createElement("div") as HTMLDivElement;
      optionDetailsDiv.classList.add("token-details");
      tokenOptionDiv.appendChild(optionDetailsDiv);

      const optionName = document.createElement("div") as HTMLDivElement;
      optionName.classList.add("option-name");
      optionName.innerHTML = option.name;

      const optionSymbol = document.createElement("div") as HTMLDivElement;
      optionSymbol.classList.add("option-symbol");
      optionSymbol.innerHTML = option.symbol;

      optionDetailsDiv.appendChild(optionName);
      optionDetailsDiv.appendChild(optionSymbol);

      const optionOrderDetailsDiv = document.createElement(
        "div"
      ) as HTMLDivElement;
      optionOrderDetailsDiv.classList.add("option-order-details");
      tokenOptionDiv.appendChild(optionOrderDetailsDiv);

      const optionAmount = document.createElement("input") as HTMLInputElement;
      optionAmount.type = "text";
      optionAmount.placeholder = "Amount";
      optionAmount.classList.add("option-amount");

      const addAssetButton = document.createElement(
        "button"
      ) as HTMLButtonElement;
      addAssetButton.innerHTML = "Add";
      addAssetButton.classList.add("add-asset");

      optionOrderDetailsDiv.appendChild(optionAmount);
      optionOrderDetailsDiv.appendChild(addAssetButton);
    });
  } catch (err) {
    err = "Erc20 list failed to load";
    console.log(err);
  }
};
