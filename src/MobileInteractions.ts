import {
  assetPopUpContainer,
  toggleFullscreen,
  closeFullscreen,
} from "./FrontEndElements.js";

let startY: number;

assetPopUpContainer.addEventListener("touchstart", (e: TouchEvent) => {
  startY = e.touches[0].clientY;
});
assetPopUpContainer.addEventListener("touchmove", (e: TouchEvent) => {
  let currentY = e.touches[0].clientY;

  //   if (currentY > startY) {
  //     if (assetPopUpContainer.style.height == "50%") {
  //       assetPopUpContainer.style.height = "0";
  //       if (assetPopUpContainer.style.height == "0") {
  //         assetPopUpContainer.style.display = "none";
  //       }
  //     } else if (assetPopUpContainer.style.height == "100%") {
  //       assetPopUpContainer.style.height = "50%";
  //     }
  //   }

  if (currentY < startY) {
    if (assetPopUpContainer.style.height == "50%") {
      assetPopUpContainer.style.height = "100%";
      closeFullscreen.style.display = "block";
      toggleFullscreen.style.display = "none";
    }
  }
});
