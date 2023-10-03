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
const tokenOptionDiv = document.querySelector(".token-option");
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
const tokenStandardMenuOptionDiv = document.querySelector(".token-standard-options");
const requestTab = document.querySelector(".request-link");
const offerTab = document.querySelector(".offer-link");
const finalizeTermsTab = document.querySelector(".finalize-terms-link");
const finalizeTermsDiv = document.querySelector(".finalize-terms");
const requestedAssets = document.querySelector(".requested-assets");
const requestedAssetsH2 = document.querySelector(".requested-assets-title");
const offeredAssets = document.querySelector(".offered-assets");
const offeredAssetsH2 = document.querySelector(".requested-assets-title");
const requestedErc721sDiv = document.querySelector(".requested-erc721s");
const requestedErc1155sDiv = document.querySelector(".requested-erc1155s");
const requestedErc20sDiv = document.querySelector(".requested-erc20s");
const requestedEthDiv = document.querySelector(".requested-eth");
const offeredErc721sDiv = document.querySelector(".offered-erc721s");
const offeredErc1155sDiv = document.querySelector(".offered-erc1155s");
const offeredErc20sDiv = document.querySelector(".offered-erc20s");
const offeredEthDiv = document.querySelector(".offered-eth");
const offeredAssetsTitle = document.querySelector(".offered-assets-title");
const requestedAssetsTitle = document.querySelector(".requested-assets-title");
const setTermsButton = document.querySelector(".set-terms");
const connectWalletButton = document.querySelector(".connect");
const tradesDiv = document.querySelector(".trades");
const finishTradeContainer = document.querySelector(".finish-trade-container");
const finishTradeDiv = document.querySelector(".finish-trade");
const activeTradesDiv = document.querySelector(".active-trades");
const backToTrade = document.querySelector(".back-to-trades");
const buildTradeTab = document.querySelector(".build-trade-tab");
const findTradeTab = document.querySelector(".find-trade-tab");
const tradesTab = document.querySelector(".trades-tab");
const tradesBox = document.querySelector(".trades-box");
const buildBox = document.querySelector(".build-box");
const findBox = document.querySelector(".find-box");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
const foundTradesDiv = document.querySelector(".found-trades");
const findTradeContainer = document.querySelector(".find-trade-container");
const activeTradesDiv2 = document.querySelector(".active-trades2");
const tradesDiv2 = document.querySelector(".trades2");
const finishTradeContainer2 = document.querySelector(".finish-trade-container2");
const finishTradeDiv2 = document.querySelector(".finish-trade2");
const backToTrade2 = document.querySelector(".back-to-trades2");
export { assetPopUpContainer, erc721MenuToggle, erc1155MenuToggle, erc20MenuToggle, ethMenuToggle, erc721MenuPopUp, erc1155MenuPopUp, erc20MenuPopUp, ethMenuPopUp, toggleFullscreen, closeFullscreen, closeMenu, tokenOptionDiv, optionImage, optionName, optionSymbol, optionTokenId, optionAmount, termErc721s, termErc1155s, termErc20s, termEth, termAssets, selectAssets, selectAssetsH2, tokenStandardMenuOptionDiv, termAssetsH2, requestTab, offerTab, finalizeTermsTab, finalizeTermsDiv, requestedAssets, offeredAssets, requestedErc721sDiv, requestedErc1155sDiv, requestedErc20sDiv, requestedEthDiv, offeredErc721sDiv, offeredErc1155sDiv, offeredErc20sDiv, offeredEthDiv, offeredAssetsH2, requestedAssetsH2, requestedAssetsTitle, offeredAssetsTitle, setTermsButton, connectWalletButton, tradesDiv, finishTradeDiv, finishTradeContainer, activeTradesDiv, backToTrade, buildTradeTab, findTradeTab, tradesTab, tradesBox, buildBox, findBox, searchBar, searchButton, foundTradesDiv, findTradeContainer, activeTradesDiv2, tradesDiv2, finishTradeContainer2, finishTradeDiv2, backToTrade2, };
