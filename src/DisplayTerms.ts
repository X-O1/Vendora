import { termErc1155s, termErc20s, termErc721s } from "./FrontEndElements.js";
import {
  ErcDetails,
  offeredErc1155s,
  offeredErc20s,
  offeredErc721s,
  setItem,
  wantedErc1155s,
  wantedErc20s,
  wantedErc721s,
  // getTokenListInStorage,
  // setItem,
} from "./TokenMenu.js";

document.addEventListener("DOMContentLoaded", () => {
  createTermsList(wantedErc721s);
  createTermsList(wantedErc1155s);
  createTermsList(wantedErc20s);
});
const createTermsList = async (termTokens: ErcDetails[] | null) => {
  try {
    termTokens?.forEach((token) => {
      const selectedTermAssetDiv: HTMLDivElement =
        document.createElement("div");
      const termAssetImageDiv: HTMLDivElement = document.createElement("div");
      const termAssetImage: HTMLImageElement = document.createElement("img");
      const termAssetSymbol: HTMLDivElement = document.createElement("div");
      const termAssetTokenId: HTMLDivElement = document.createElement("div");
      const termAssetAmount: HTMLDivElement = document.createElement("div");
      const deleteAssetButton: HTMLButtonElement =
        document.createElement("button");

      selectedTermAssetDiv.classList.add("selected-term-asset");
      termAssetImageDiv.classList.add("term-asset-image");
      termAssetSymbol.classList.add("term-asset-symbol");
      termAssetTokenId.classList.add("term-asset-tokenId");
      termAssetAmount.classList.add("term-asset-amount");
      deleteAssetButton.classList.add("delete-asset");

      selectedTermAssetDiv.appendChild(termAssetImageDiv);
      termAssetImageDiv.appendChild(termAssetImage);
      selectedTermAssetDiv.appendChild(termAssetSymbol);

      if (termTokens === wantedErc721s || termTokens === offeredErc721s) {
        termErc721s.appendChild(selectedTermAssetDiv);
        selectedTermAssetDiv.appendChild(termAssetTokenId);
        selectedTermAssetDiv.appendChild(deleteAssetButton);
      } else if (
        termTokens === wantedErc1155s ||
        termTokens === offeredErc1155s
      ) {
        termErc1155s.appendChild(selectedTermAssetDiv);
        selectedTermAssetDiv.appendChild(termAssetSymbol);
        selectedTermAssetDiv.appendChild(termAssetTokenId);
        selectedTermAssetDiv.appendChild(termAssetAmount);
        selectedTermAssetDiv.appendChild(deleteAssetButton);
      } else if (termTokens === wantedErc20s || termTokens === offeredErc20s) {
        termErc20s.appendChild(selectedTermAssetDiv);
        selectedTermAssetDiv.appendChild(termAssetAmount);
        selectedTermAssetDiv.appendChild(deleteAssetButton);
      }

      if (termTokens === wantedErc721s && termTokens.length !== 0) {
        termErc721s.style.display = "block";
      } else if (termTokens === wantedErc1155s && termTokens.length !== 0) {
        termErc1155s.style.display = "block";
      } else if (termTokens === wantedErc20s && termTokens.length !== 0) {
        termErc20s.style.display = "block";
      } else if (termTokens === offeredErc721s && termTokens.length !== 0) {
        termErc721s.style.display = "block";
      } else if (termTokens === offeredErc1155s && termTokens.length !== 0) {
        termErc1155s.style.display = "block";
      } else if (termTokens === offeredErc20s && termTokens.length !== 0) {
        termErc20s.style.display = "block";
      }

      termAssetImage.src = token.imgSrc;
      termAssetSymbol.innerHTML = token.symbol;
      "amount" in token
        ? (termAssetAmount.innerHTML = `${token.amount}`)
        : null;
      "tokenId" in token
        ? (termAssetTokenId.innerHTML = `${token.tokenId}`)
        : null;

      deleteAssetButton.innerHTML = "Delete";

      deleteAssetButton.addEventListener("click", () => {
        if (token.symbol === termAssetSymbol.innerHTML) {
          const index = termTokens.indexOf(token);
          index !== -1 ? termTokens.splice(index, 1) : null;
          setItem("wantedErc20s", wantedErc20s);
          setItem("offeredErc20s", offeredErc20s);

          if (termTokens === wantedErc20s) {
            termErc20s.innerHTML = "";
            createTermsList(wantedErc20s);
          } else if (termTokens === offeredErc20s) {
            termErc20s.innerHTML = "";
            createTermsList(offeredErc20s);
          }

          if (token.tokenId === termAssetTokenId.innerHTML) {
            const index = termTokens.indexOf(token);
            index !== -1 ? termTokens.splice(index, 1) : null;
            setItem("wantedErc721s", wantedErc721s);
            setItem("wantedErc1155s", wantedErc1155s);
            setItem("offeredErc721s", offeredErc721s);
            setItem("offeredErc1155s", offeredErc1155s);

            if (termTokens === wantedErc1155s || termTokens === wantedErc721s) {
              termErc1155s.innerHTML = "";
              createTermsList(wantedErc1155s);
              termErc721s.innerHTML = "";
              createTermsList(wantedErc721s);
            } else if (
              termTokens === offeredErc1155s ||
              termTokens === offeredErc721s
            ) {
              termErc1155s.innerHTML = "";
              createTermsList(offeredErc1155s);
              termErc721s.innerHTML = "";
              createTermsList(offeredErc721s);
            }
          }
        }
      });
    });
  } catch (error) {
    error: console.log("Wanted asset list failed to load");
  }
};

export { createTermsList };
