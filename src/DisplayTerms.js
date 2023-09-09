import {
  finalizeTermsDiv,
  offeredTermsErc1155s,
  offeredTermsErc20s,
  offeredTermsErc721s,
  offeredTermsEth,
  requestedTermsErc1155s,
  requestedTermsErc20s,
  requestedTermsErc721s,
  requestedTermsEth,
} from "./FrontEndElements.js";
import {
  offeredErc1155s,
  offeredErc20s,
  offeredErc721s,
  offeredEth,
  setItem,
  wantedErc1155s,
  wantedErc20s,
  wantedErc721s,
  wantedEth,
} from "./TokenMenu.js";
document.addEventListener("DOMContentLoaded", async () => {
  finalizeTermsDiv.style.height = "50%";
  await createWantedAssetList(wantedErc721s);
  await createWantedAssetList(wantedErc1155s);
  await createWantedAssetList(wantedErc20s);
  await createWantedAssetList(wantedEth);
});
const createTermELements = () => {
  const selectedTermAssetDiv = document.createElement("div");
  selectedTermAssetDiv.classList.add("selected-term-asset");
  const termAssetImageDiv = document.createElement("div");
  termAssetImageDiv.classList.add("term-asset-image");
  const termAssetImage = document.createElement("img");
  const termAssetSymbol = document.createElement("div");
  termAssetSymbol.classList.add("term-asset-symbol");
  const termAssetTokenIdTitle = document.createElement("div");
  termAssetTokenIdTitle.classList.add("term-asset-tokenId-title");
  const termAssetTokenId = document.createElement("div");
  termAssetTokenId.classList.add("term-asset-tokenId");
  const termAssetAmountTitle = document.createElement("div");
  termAssetAmountTitle.classList.add("term-asset-amount-title");
  const termAssetAmount = document.createElement("div");
  termAssetAmount.classList.add("term-asset-amount");
  const deleteAssetButton = document.createElement("button");
  deleteAssetButton.classList.add("delete-asset");
  selectedTermAssetDiv.appendChild(termAssetImageDiv);
  termAssetImageDiv.appendChild(termAssetImage);
  selectedTermAssetDiv.appendChild(termAssetSymbol);
  return {
    selectedTermAssetDiv,
    termAssetImageDiv,
    termAssetImage,
    termAssetSymbol,
    termAssetTokenIdTitle,
    termAssetTokenId,
    termAssetAmountTitle,
    termAssetAmount,
    deleteAssetButton,
    displayRequestedAssets,
    displayOfferedAssets,
  };
};

const displayRequestedAssets = async () => {
  await createWantedAssetList(wantedErc721s);
  await createWantedAssetList(wantedErc1155s);
  await createWantedAssetList(wantedErc20s);
  await createWantedAssetList(wantedEth);
};
const displayOfferedAssets = async () => {
  createOfferedAssetList(offeredErc721s);
  createOfferedAssetList(offeredErc1155s);
  createOfferedAssetList(offeredErc20s);
  createOfferedAssetList(offeredEth);
};
const createWantedAssetList = async (wantedAssets) => {
  try {
    wantedAssets === null || wantedAssets === void 0
      ? void 0
      : wantedAssets.forEach((token) => {
          const requestedTermsDiv = createTermELements();
          if (wantedAssets === wantedErc721s) {
            requestedTermsErc721s.appendChild(
              requestedTermsDiv.selectedTermAssetDiv
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetTokenIdTitle
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetTokenId
            );
            if (finalizeTermsDiv.style.height === "50%") {
              requestedTermsDiv.selectedTermAssetDiv.appendChild(
                requestedTermsDiv.deleteAssetButton
              );
            }
          } else if (wantedAssets === wantedErc1155s) {
            requestedTermsErc1155s.appendChild(
              requestedTermsDiv.selectedTermAssetDiv
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetSymbol
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetTokenIdTitle
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetTokenId
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetAmountTitle
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetAmount
            );
            if (finalizeTermsDiv.style.height === "50%") {
              requestedTermsDiv.selectedTermAssetDiv.appendChild(
                requestedTermsDiv.deleteAssetButton
              );
            }
          } else if (wantedAssets === wantedErc20s) {
            requestedTermsErc20s.appendChild(
              requestedTermsDiv.selectedTermAssetDiv
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetAmountTitle
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetAmount
            );
            if (finalizeTermsDiv.style.height === "50%") {
              requestedTermsDiv.selectedTermAssetDiv.appendChild(
                requestedTermsDiv.deleteAssetButton
              );
            }
          } else if (wantedAssets === wantedEth) {
            requestedTermsEth.appendChild(
              requestedTermsDiv.selectedTermAssetDiv
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetAmountTitle
            );
            requestedTermsDiv.selectedTermAssetDiv.appendChild(
              requestedTermsDiv.termAssetAmount
            );
            if (finalizeTermsDiv.style.height === "50%") {
              requestedTermsDiv.selectedTermAssetDiv.appendChild(
                requestedTermsDiv.deleteAssetButton
              );
            }
          }
          requestedTermsDiv.termAssetImage.src = token.imgSrc;
          requestedTermsDiv.termAssetSymbol.innerText = token.symbol;
          requestedTermsDiv.termAssetTokenIdTitle.innerText = "#";
          requestedTermsDiv.termAssetAmountTitle.innerText = "Amt:";
          "amount" in token
            ? (requestedTermsDiv.termAssetAmount.innerText = `${token.amount}`)
            : null;
          "tokenId" in token
            ? (requestedTermsDiv.termAssetTokenId.innerText = `${token.tokenId}`)
            : null;
          requestedTermsDiv.deleteAssetButton.innerText = "Delete";
          if (wantedAssets === wantedErc721s && wantedAssets.length !== 0) {
            requestedTermsErc721s.style.display = "block";
          } else if (
            wantedAssets === wantedErc1155s &&
            wantedAssets.length !== 0
          ) {
            requestedTermsErc1155s.style.display = "block";
          } else if (
            wantedAssets === wantedErc20s &&
            wantedAssets.length !== 0
          ) {
            requestedTermsErc20s.style.display = "block";
          } else if (wantedAssets === wantedEth && wantedAssets.length !== 0) {
            requestedTermsEth.style.display = "block";
          }
          requestedTermsDiv.deleteAssetButton.addEventListener("click", () => {
            if (token.symbol === requestedTermsDiv.termAssetSymbol.innerText) {
              const index = wantedAssets.indexOf(token);
              index !== -1 ? wantedAssets.splice(index, 1) : null;
              setItem("wantedErc20s", wantedErc20s);
              setItem("wantedEth", wantedEth);
              if (wantedAssets === wantedErc20s || wantedAssets === wantedEth) {
                requestedTermsErc20s.innerText = "";
                createWantedAssetList(wantedErc20s);
                requestedTermsEth.innerText = "";
                createWantedAssetList(wantedEth);
              }
              if (
                token.tokenId === requestedTermsDiv.termAssetTokenId.innerText
              ) {
                const index = wantedAssets.indexOf(token);
                index !== -1 ? wantedAssets.splice(index, 1) : null;
                setItem("wantedErc721s", wantedErc721s);
                setItem("wantedErc1155s", wantedErc1155s);
                if (
                  wantedAssets === wantedErc1155s ||
                  wantedAssets === wantedErc721s
                ) {
                  requestedTermsErc1155s.innerText = "";
                  createWantedAssetList(wantedErc1155s);
                  requestedTermsErc721s.innerText = "";
                  createWantedAssetList(wantedErc721s);
                }
              }
            }
          });
        });
  } catch (error) {
    error: console.log("Wanted asset list failed to load");
  }
};
const createOfferedAssetList = async (offeredAssets) => {
  try {
    offeredAssets === null || offeredAssets === void 0
      ? void 0
      : offeredAssets.forEach((token) => {
          const offeredTermsDiv = createTermELements();
          if (offeredAssets === offeredErc721s) {
            offeredTermsErc721s.appendChild(
              offeredTermsDiv.selectedTermAssetDiv
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetTokenIdTitle
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetTokenId
            );
            if (finalizeTermsDiv.style.height === "50%") {
              offeredTermsDiv.selectedTermAssetDiv.appendChild(
                offeredTermsDiv.deleteAssetButton
              );
            }
          } else if (offeredAssets === offeredErc1155s) {
            offeredTermsErc1155s.appendChild(
              offeredTermsDiv.selectedTermAssetDiv
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetSymbol
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetTokenIdTitle
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetTokenId
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetAmountTitle
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetAmount
            );
            if (finalizeTermsDiv.style.height === "50%") {
              offeredTermsDiv.selectedTermAssetDiv.appendChild(
                offeredTermsDiv.deleteAssetButton
              );
            }
          } else if (offeredAssets === offeredErc20s) {
            offeredTermsErc20s.appendChild(
              offeredTermsDiv.selectedTermAssetDiv
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetAmountTitle
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetAmount
            );
            if (finalizeTermsDiv.style.height === "50%") {
              offeredTermsDiv.selectedTermAssetDiv.appendChild(
                offeredTermsDiv.deleteAssetButton
              );
            }
          } else if (offeredAssets === offeredEth) {
            offeredTermsEth.appendChild(offeredTermsDiv.selectedTermAssetDiv);
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetAmountTitle
            );
            offeredTermsDiv.selectedTermAssetDiv.appendChild(
              offeredTermsDiv.termAssetAmount
            );
            if (finalizeTermsDiv.style.height === "50%") {
              offeredTermsDiv.selectedTermAssetDiv.appendChild(
                offeredTermsDiv.deleteAssetButton
              );
            }
          }
          offeredTermsDiv.termAssetImage.src = token.imgSrc;
          offeredTermsDiv.termAssetSymbol.innerText = token.symbol;
          offeredTermsDiv.termAssetTokenIdTitle.innerText = "#";
          offeredTermsDiv.termAssetAmountTitle.innerText = "Amt:";
          "amount" in token
            ? (offeredTermsDiv.termAssetAmount.innerText = `${token.amount}`)
            : null;
          "tokenId" in token
            ? (offeredTermsDiv.termAssetTokenId.innerText = `${token.tokenId}`)
            : null;
          offeredTermsDiv.deleteAssetButton.innerText = "Delete";
          if (offeredAssets === offeredErc721s && offeredAssets.length !== 0) {
            offeredTermsErc721s.style.display = "block";
          } else if (
            offeredAssets === offeredErc1155s &&
            offeredAssets.length !== 0
          ) {
            offeredTermsErc1155s.style.display = "block";
          } else if (
            offeredAssets === offeredErc20s &&
            offeredAssets.length !== 0
          ) {
            offeredTermsErc20s.style.display = "block";
          } else if (
            offeredAssets === offeredEth &&
            offeredAssets.length !== 0
          ) {
            offeredTermsEth.style.display = "block";
          }
          offeredTermsDiv.deleteAssetButton.addEventListener("click", () => {
            if (token.symbol === offeredTermsDiv.termAssetSymbol.innerText) {
              const index = offeredAssets.indexOf(token);
              index !== -1 ? offeredAssets.splice(index, 1) : null;
              setItem("offeredErc20s", offeredErc20s);
              setItem("offeredEth", offeredEth);
              if (
                offeredAssets === offeredErc20s ||
                offeredAssets === offeredEth
              ) {
                offeredTermsErc20s.innerText = "";
                createOfferedAssetList(offeredErc20s);
                offeredTermsEth.innerText = "";
                createOfferedAssetList(offeredEth);
              }
              if (
                token.tokenId === offeredTermsDiv.termAssetTokenId.innerText
              ) {
                const index = offeredAssets.indexOf(token);
                index !== -1 ? offeredAssets.splice(index, 1) : null;
                setItem("offeredErc721s", offeredErc721s);
                setItem("offeredErc1155s", offeredErc1155s);
                if (
                  offeredAssets === offeredErc1155s ||
                  offeredAssets === offeredErc721s
                ) {
                  offeredTermsErc1155s.innerText = "";
                  createOfferedAssetList(offeredErc1155s);
                  offeredTermsErc721s.innerText = "";
                  createOfferedAssetList(offeredErc721s);
                }
              }
            }
          });
        });
  } catch (error) {
    error: console.log("Offered asset list failed to load");
  }
};
export { createWantedAssetList, createOfferedAssetList };
