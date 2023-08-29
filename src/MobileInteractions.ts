import {
  assetPopUpContainer,
  erc721MenuPopUp,
  erc1155MenuPopUp,
  erc20MenuPopUp,
  toggleFullscreen,
  closeFullscreen,
  closeMenu,
} from "./FrontEndElements.js";

let startY: number;

assetPopUpContainer.addEventListener("touchstart", (e: TouchEvent) => {
  startY = e.touches[0].clientY;
});
assetPopUpContainer.addEventListener("touchmove", (e: TouchEvent) => {
  let currentY = e.touches[0].clientY;

  if (currentY < startY) {
    openAssetList();
  }
});

erc721MenuPopUp.addEventListener("touchend", (e: TouchEvent) => {
  let endY = e.changedTouches[0].clientY;

  if (erc721MenuPopUp.scrollTop === 0) {
    if (endY > startY) {
      closeAssetList();
    }
  }
});
erc1155MenuPopUp.addEventListener("touchend", (e: TouchEvent) => {
  let endY = e.changedTouches[0].clientY;

  if (erc1155MenuPopUp.scrollTop === 0) {
    if (endY > startY) {
      closeAssetList();
    }
  }
});
erc20MenuPopUp.addEventListener("touchend", (e: TouchEvent) => {
  let endY = e.changedTouches[0].clientY;

  if (erc20MenuPopUp.scrollTop === 0) {
    if (endY > startY) {
      closeAssetList();
    }
  }
});

const openAssetList = (): void => {
  assetPopUpContainer.style.height = "100%";
  closeFullscreen.style.display = "block";
  toggleFullscreen.style.display = "none";
  closeMenu.style.display = "none";
};

const closeAssetList = (): void => {
  assetPopUpContainer.style.height = "0";
  closeFullscreen.style.display = "none";
  toggleFullscreen.style.display = "none";
  closeMenu.style.display = "none";
};
