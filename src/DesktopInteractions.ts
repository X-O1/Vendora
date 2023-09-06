import {
  createOfferedAssetList,
  createWantedAssetList,
} from "./DisplayTerms.js";
import {
  erc721MenuToggle,
  erc1155MenuToggle,
  erc20MenuToggle,
  assetPopUpContainer,
  erc721MenuPopUp,
  erc1155MenuPopUp,
  erc20MenuPopUp,
  toggleFullscreen,
  closeFullscreen,
  closeMenu,
  offerTab,
  requestTab,
  finalizeTermsTab,
  selectAssetsH2,
  ethMenuToggle,
  ethMenuPopUp,
  selectAssets,
  finalizeTermsDiv,
  requestedTermsErc721s,
  requestedTermsErc1155s,
  requestedTermsErc20s,
  requestedTermsEth,
  offeredTermsErc721s,
  offeredTermsErc1155s,
  offeredTermsErc20s,
  offeredTermsEth,
  requestedAssets,
  offeredAssets,
} from "./FrontEndElements.js";
import {
  offeredErc1155s,
  offeredErc20s,
  offeredErc721s,
  offeredEth,
  wantedErc1155s,
  wantedErc20s,
  wantedErc721s,
  wantedEth,
} from "./TokenMenu.js";

erc721MenuToggle.addEventListener("click", () => {
  ethMenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  erc721MenuPopUp.style.display = "block";
});

erc1155MenuToggle.addEventListener("click", () => {
  ethMenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";
  erc721MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  erc1155MenuPopUp.style.display = "block";
});

erc20MenuToggle.addEventListener("click", () => {
  ethMenuPopUp.style.display = "none";
  erc721MenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  erc20MenuPopUp.style.display = "block";
});
ethMenuToggle.addEventListener("click", () => {
  erc721MenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";

  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";
  closeMenu.style.display = "block";
  ethMenuPopUp.style.display = "block";
});

toggleFullscreen.addEventListener("click", () => {
  if (assetPopUpContainer.style.height == "50%") {
    assetPopUpContainer.style.height = "100%";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "block";
    closeMenu.style.display = "none";
  } else {
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeFullscreen.style.display = "none";
  }
});

closeFullscreen.addEventListener("click", () => {
  if (assetPopUpContainer.style.height == "100%") {
    assetPopUpContainer.style.height = "0";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "none";
    assetPopUpContainer.style.border = "none";
    closeMenu.style.display = "none";
  } else {
    assetPopUpContainer.style.height = "100%";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "block";
    assetPopUpContainer.style.border = "1px solid rgba(152, 161, 192, 0.24)";
  }
});

closeMenu.addEventListener("click", () => {
  closeMenuPopUp();
});

const closeMenuPopUp = (): void => {
  assetPopUpContainer.style.height = "0";
  toggleFullscreen.style.display = "none";
  closeFullscreen.style.display = "none";
  assetPopUpContainer.style.border = "none";
  closeMenu.style.display = "none";
};

requestTab.addEventListener("click", () => {
  requestTab.style.color = "#FFF";
  offerTab.style.color = "#7F87A2";
  finalizeTermsTab.style.color = "#7F87A2";
  selectAssets.style.display = "flex";
  requestedAssets.style.display = "flex";
  offeredAssets.style.display = "none";
  finalizeTermsDiv.style.height = "50%";
  requestedAssets.style.height = "100%";

  selectAssetsH2.innerText = "Select Assets You Want";
});
offerTab.addEventListener("click", () => {
  offerTab.style.color = "#FFF";
  requestTab.style.color = "#7F87A2";
  finalizeTermsTab.style.color = "#7F87A2";
  selectAssets.style.display = "flex";
  requestedAssets.style.display = "none";
  offeredAssets.style.display = "flex";
  finalizeTermsDiv.style.height = "50%";
  offeredAssets.style.height = "100%";

  selectAssetsH2.innerText = "Select Assets You'll Give";
});
finalizeTermsTab.addEventListener("click", () => {
  finalizeTermsTab.style.color = "#FFF";
  offerTab.style.color = "#7F87A2";
  requestTab.style.color = "#7F87A2";
  selectAssets.style.display = "none";
  requestedAssets.style.display = "flex";
  offeredAssets.style.display = "flex";
  finalizeTermsDiv.style.height = "100%";
  requestedAssets.style.height = "47%";
  offeredAssets.style.height = "47%";

  requestedTermsErc721s.innerText = "";
  requestedTermsErc1155s.innerText = "";
  requestedTermsErc20s.innerText = "";
  requestedTermsEth.innerText = "";

  closeMenuPopUp();

  createWantedAssetList(wantedErc721s);
  createWantedAssetList(wantedErc1155s);
  createWantedAssetList(wantedErc20s);
  createWantedAssetList(wantedEth);

  offeredTermsErc721s.innerText = "";
  offeredTermsErc1155s.innerText = "";
  offeredTermsErc20s.innerText = "";
  offeredTermsEth.innerText = "";

  createOfferedAssetList(offeredErc721s);
  createOfferedAssetList(offeredErc1155s);
  createOfferedAssetList(offeredErc20s);
  createOfferedAssetList(offeredEth);
});
