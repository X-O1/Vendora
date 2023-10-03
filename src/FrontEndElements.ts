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
const ethMenuToggle = document.querySelector(".choose-eth") as HTMLDivElement;
const erc721MenuPopUp = document.querySelector(
  ".erc721-menu-popup"
) as HTMLDivElement;
const erc1155MenuPopUp = document.querySelector(
  ".erc1155-menu-popup"
) as HTMLDivElement;
const erc20MenuPopUp = document.querySelector(
  ".erc20-menu-popup"
) as HTMLDivElement;
const ethMenuPopUp = document.querySelector(
  ".eth-menu-popup"
) as HTMLDivElement;
const toggleFullscreen = document.querySelector(
  ".toggle-fullscreen img"
) as HTMLImageElement;
const closeFullscreen = document.querySelector(
  ".close-fullscreen img"
) as HTMLImageElement;
const closeMenu = document.querySelector(".close-menu") as HTMLDivElement;
const tokenOptionDiv = document.querySelector(
  ".token-option"
) as HTMLDivElement;
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
const termEth = document.querySelector(".term-asset-eth") as HTMLDivElement;
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
const finalizeTermsDiv = document.querySelector(
  ".finalize-terms"
) as HTMLDivElement;
const requestedAssets = document.querySelector(
  ".requested-assets"
) as HTMLDivElement;
const requestedAssetsH2 = document.querySelector(
  ".requested-assets-title"
) as HTMLElement;
const offeredAssets = document.querySelector(
  ".offered-assets"
) as HTMLDivElement;
const offeredAssetsH2 = document.querySelector(
  ".requested-assets-title"
) as HTMLElement;
const requestedErc721sDiv = document.querySelector(
  ".requested-erc721s"
) as HTMLDivElement;
const requestedErc1155sDiv = document.querySelector(
  ".requested-erc1155s"
) as HTMLDivElement;
const requestedErc20sDiv = document.querySelector(
  ".requested-erc20s"
) as HTMLDivElement;
const requestedEthDiv = document.querySelector(
  ".requested-eth"
) as HTMLDivElement;

const offeredErc721sDiv = document.querySelector(
  ".offered-erc721s"
) as HTMLDivElement;
const offeredErc1155sDiv = document.querySelector(
  ".offered-erc1155s"
) as HTMLDivElement;
const offeredErc20sDiv = document.querySelector(
  ".offered-erc20s"
) as HTMLDivElement;
const offeredEthDiv = document.querySelector(".offered-eth") as HTMLDivElement;
const offeredAssetsTitle = document.querySelector(
  ".offered-assets-title"
) as HTMLElement;
const requestedAssetsTitle = document.querySelector(
  ".requested-assets-title"
) as HTMLElement;
const setTermsButton = document.querySelector(
  ".set-terms"
) as HTMLButtonElement;
const connectWalletButton = document.querySelector(
  ".connect"
) as HTMLDivElement;

const tradesDiv = document.querySelector(".trades") as HTMLDivElement;
const finishTradeContainer = document.querySelector(
  ".finish-trade-container"
) as HTMLDivElement;
const finishTradeDiv = document.querySelector(
  ".finish-trade"
) as HTMLDivElement;
const activeTradesDiv = document.querySelector(
  ".active-trades"
) as HTMLDivElement;
const backToTrade = document.querySelector(".back-to-trades") as HTMLDivElement;
const buildTradeTab = document.querySelector(
  ".build-trade-tab"
) as HTMLDivElement;
const findTradeTab = document.querySelector(
  ".find-trade-tab"
) as HTMLDivElement;
const tradesTab = document.querySelector(".trades-tab") as HTMLDivElement;
const tradesBox = document.querySelector(".trades-box") as HTMLDivElement;
const buildBox = document.querySelector(".build-box") as HTMLDivElement;
const findBox = document.querySelector(".find-box") as HTMLDivElement;
const searchBar = document.querySelector(".search-bar") as HTMLInputElement;
const searchButton = document.querySelector(
  ".search-button"
) as HTMLButtonElement;
const foundTradesDiv = document.querySelector(
  ".found-trades"
) as HTMLDivElement;
const findTradeContainer = document.querySelector(
  ".find-trade-container"
) as HTMLDivElement;
const activeTradesDiv2 = document.querySelector(
  ".active-trades2"
) as HTMLDivElement;
const tradesDiv2 = document.querySelector(".trades2") as HTMLDivElement;

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
  tokenOptionDiv,
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
  requestedErc721sDiv,
  requestedErc1155sDiv,
  requestedErc20sDiv,
  requestedEthDiv,
  offeredErc721sDiv,
  offeredErc1155sDiv,
  offeredErc20sDiv,
  offeredEthDiv,
  offeredAssetsH2,
  requestedAssetsH2,
  requestedAssetsTitle,
  offeredAssetsTitle,
  setTermsButton,
  connectWalletButton,
  tradesDiv,
  finishTradeDiv,
  finishTradeContainer,
  activeTradesDiv,
  backToTrade,
  buildTradeTab,
  findTradeTab,
  tradesTab,
  tradesBox,
  buildBox,
  findBox,
  searchBar,
  searchButton,
  foundTradesDiv,
  findTradeContainer,
  activeTradesDiv2,
  tradesDiv2,
};
