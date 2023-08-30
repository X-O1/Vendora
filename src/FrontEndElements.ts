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
};
