const assetPopUpContainer = document.querySelector(".asset-popups");
const erc721MenuToggle = document.querySelector(".choose-erc721");
const erc1155MenuToggle = document.querySelector(".choose-erc1155");
const erc20MenuToggle = document.querySelector(".choose-erc20");
const ethMenuToggle = document.querySelector(".choose-eth");
const erc721MenuPopUp = document.querySelector(".erc721-menu-popup");
const erc1155MenuPopUp = document.querySelector(".erc1155-menu-popup");
const erc20MenuPopUp = document.querySelector(".erc20-menu-popup");
const ethMenuPopUp = document.querySelector(".eth-menu-popup");
const toggleFullscreen = document.querySelector(".toggle-fullscreen img");
const closeFullscreen = document.querySelector(".close-fullscreen img");
const closeMenu = document.querySelector(".close-menu");
const tokenOption = document.querySelector(".token-option");
const optionImage = document.querySelector("option-image img");
const optionName = document.querySelector(".option-name");
const optionSymbol = document.querySelector(".option-symbol");
const optionTokenId = document.querySelector(".option-token-id input");
const optionAmount = document.querySelector(".option-amount");
const termErc721s = document.querySelector(".term-asset-erc721s");
const termErc1155s = document.querySelector(".term-asset-erc1155s");
const termErc20s = document.querySelector(".term-asset-erc20s");
const termEth = document.querySelector(".term-asset-eth");
const termAssets = document.querySelector(".term-assets");
const termAssetsH2 = document.querySelector(".term-assets h2");
const selectAssets = document.querySelector(".select-assets");
const selectAssetsH2 = document.querySelector(".select-assets h2");
const tokenStandardMenuOptionDiv = document.querySelector(
  ".token-standard-options"
);
const requestTab = document.querySelector(".request-link");
const offerTab = document.querySelector(".offer-link");
const finalizeTermsTab = document.querySelector(".finalize-terms-link");
const finalizeTermsDiv = document.querySelector(".finalize-terms");
const requestedAssets = document.querySelector(".requested-assets");
const requestedAssetsH2 = document.querySelector(".requested-assets-title");
const offeredAssets = document.querySelector(".offered-assets");
const offeredAssetsH2 = document.querySelector(".requested-assets-title");
const requestedTermsErc721s = document.querySelector(".requested-erc721s");
const requestedTermsErc1155s = document.querySelector(".requested-erc1155s");
const requestedTermsErc20s = document.querySelector(".requested-erc20s");
const requestedTermsEth = document.querySelector(".requested-eth");
const offeredTermsErc721s = document.querySelector(".offered-erc721s");
const offeredTermsErc1155s = document.querySelector(".offered-erc1155s");
const offeredTermsErc20s = document.querySelector(".offered-erc20s");
const offeredTermsEth = document.querySelector(".offered-eth");
const offeredAssetsTitle = document.querySelector(".offered-assets-title");
const requestedAssetsTitle = document.querySelector(".requested-assets-title");
const setTermsButton = document.querySelector(".set-terms");
export {
  assetPopUpContainer,
  erc721MenuToggle,
  erc1155MenuToggle,
  erc20MenuToggle,
  ethMenuToggle,
  erc721MenuPopUp,
  erc1155MenuPopUp,
  erc20MenuPopUp,
  ethMenuPopUp,
  toggleFullscreen,
  closeFullscreen,
  closeMenu,
  tokenOption,
  optionImage,
  optionName,
  optionSymbol,
  optionTokenId,
  optionAmount,
  termErc721s,
  termErc1155s,
  termErc20s,
  termEth,
  termAssets,
  selectAssets,
  selectAssetsH2,
  tokenStandardMenuOptionDiv,
  termAssetsH2,
  requestTab,
  offerTab,
  finalizeTermsTab,
  finalizeTermsDiv,
  requestedAssets,
  offeredAssets,
  requestedTermsErc721s,
  requestedTermsErc1155s,
  requestedTermsErc20s,
  requestedTermsEth,
  offeredTermsErc721s,
  offeredTermsErc1155s,
  offeredTermsErc20s,
  offeredTermsEth,
  offeredAssetsH2,
  requestedAssetsH2,
  requestedAssetsTitle,
  offeredAssetsTitle,
  setTermsButton,
};