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
};
