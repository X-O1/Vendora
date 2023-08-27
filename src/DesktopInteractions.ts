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
} from "./FrontEndElements.js";

erc721MenuToggle.addEventListener("click", () => {
  erc1155MenuPopUp.style.display = "none";
  erc20MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";

  erc721MenuPopUp.style.display = "none"
    ? (erc721MenuPopUp.style.display = "block")
    : (erc721MenuPopUp.style.display = "none");
});

erc1155MenuToggle.addEventListener("click", () => {
  erc20MenuPopUp.style.display = "none";
  erc721MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";

  erc1155MenuPopUp.style.display = "none"
    ? (erc1155MenuPopUp.style.display = "block")
    : (erc1155MenuPopUp.style.display = "none");
});

erc20MenuToggle.addEventListener("click", () => {
  erc721MenuPopUp.style.display = "none";
  erc1155MenuPopUp.style.display = "none";
  assetPopUpContainer.style.height = "50%";
  toggleFullscreen.style.display = "block";

  erc20MenuPopUp.style.display = "none"
    ? (erc20MenuPopUp.style.display = "block")
    : (erc20MenuPopUp.style.display = "none");
});

toggleFullscreen.addEventListener("click", () => {
  if (assetPopUpContainer.style.height == "50%") {
    assetPopUpContainer.style.height = "100%";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "block";
  } else {
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeFullscreen.style.display = "none";
  }
});

closeFullscreen.addEventListener("click", () => {
  if (assetPopUpContainer.style.height == "100%") {
    assetPopUpContainer.style.height = "50%";
    toggleFullscreen.style.display = "block";
    closeFullscreen.style.display = "none";
  } else {
    assetPopUpContainer.style.height = "100%";
    toggleFullscreen.style.display = "none";
    closeFullscreen.style.display = "block";
  }
});
