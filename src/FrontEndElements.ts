const assetPopUpContainer = document.querySelector(
  ".asset-popups"
) as HTMLDivElement;
const erc721MenuToggle = document.querySelector(
  ".choose-erc721"
) as HTMLDivElement;
const erc1155MenuToggle = document.querySelector(
  ".choose-erc1155"
) as HTMLDivElement;
const erc20MenuToggle = document.querySelector(
  ".choose-erc20"
) as HTMLDivElement;
const erc721MenuPopUp = document.querySelector(
  ".erc721-menu-popup"
) as HTMLDivElement;
const erc1155MenuPopUp = document.querySelector(
  ".erc1155-menu-popup"
) as HTMLDivElement;
const erc20MenuPopUp = document.querySelector(
  ".erc20-menu-popup"
) as HTMLDivElement;
const toggleFullscreen = document.querySelector(
  ".toggle-fullscreen img"
) as HTMLImageElement;
const closeFullscreen = document.querySelector(
  ".close-fullscreen img"
) as HTMLImageElement;
const closeMenu = document.querySelector(".close-menu") as HTMLDivElement;
const tokenOption = document.querySelector(".token-option") as HTMLDivElement;
const optionImage = document.querySelector(
  "option-image img"
) as HTMLImageElement;
const optionName = document.querySelector(".option-name") as HTMLDivElement;
const optionSymbol = document.querySelector(".option-symbol") as HTMLDivElement;
const optionTokenId = document.querySelector(
  ".option-token-id input"
) as HTMLInputElement;
const optionAmount = document.querySelector(
  ".option-amount"
) as HTMLInputElement;

const termErc721s = document.querySelector(
  ".term-asset-erc721s"
) as HTMLDivElement;
const termErc1155s = document.querySelector(
  ".term-asset-erc1155s"
) as HTMLDivElement;
const termErc20s = document.querySelector(
  ".term-asset-erc20s"
) as HTMLDivElement;
const termAssets = document.querySelector(".term-assets") as HTMLDivElement;
const termAssetsH2 = document.querySelector(".term-assets h2") as HTMLElement;
const selectAssets = document.querySelector(".select-assets") as HTMLDivElement;
const selectAssetsH2 = document.querySelector(
  ".select-assets h2"
) as HTMLElement;
const tokenStandardMenuOptionDiv = document.querySelector(
  ".token-standard-options"
) as HTMLDivElement;
const requestTab = document.querySelector(".request-link") as HTMLDivElement;
const offerTab = document.querySelector(".offer-link") as HTMLDivElement;
const finalizeTermsTab = document.querySelector(
  ".finalize-terms-link"
) as HTMLDivElement;
const addWantedErc721Button = document.querySelector(
  ".add-wanted-erc721"
) as HTMLDivElement;

export {
  assetPopUpContainer,
  erc721MenuToggle,
  erc1155MenuToggle,
  erc20MenuToggle,
  erc721MenuPopUp,
  erc1155MenuPopUp,
  erc20MenuPopUp,
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
  termAssets,
  selectAssets,
  selectAssetsH2,
  tokenStandardMenuOptionDiv,
  termAssetsH2,
  requestTab,
  offerTab,
  finalizeTermsTab,
  addWantedErc721Button,
};
