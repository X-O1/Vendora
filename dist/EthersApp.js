import { ethers } from "ethers";
import { getErc721TransferDetails, getErc1155TransferDetails, getErc20TransferDetails, getEthTransferDetails, } from "./TermsAssetDetails";
import { finishTradeDiv, finishTradeDiv2, searchBar, searchButton, searchContainer, setTermsButton, tradesDiv, tradesDiv2, tradesTab, } from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
import { createTradeElements, createTradeMenuElements, displayActiveTradesPage, displayFinishTradePage, displayFinishTradePage2, } from "./TradeMenu";
import { _createOfferedErc1155PreviewMenu, _createOfferedErc20PreviewMenu, _createOfferedErc721PreviewMenu, _createOfferedEthPreviewMenu, _createRequestedErc1155PreviewMenu, _createRequestedErc20PreviewMenu, _createRequestedErc721PreviewMenu, _createRequestedEthPreviewMenu, } from "./TradePreview";
import { defaultErc1155s, defaultErc20s, defaultErc721s, defaultNativeTokens, } from "./DefaultTokens";
const metamaskExist = () => {
    const metamaskExist = typeof window.ethereum !== "undefined";
    return metamaskExist;
};
const addTrade = async () => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const tx = await contract.setTerms((await getErc721TransferDetails()).offered, (await getErc721TransferDetails()).requested, (await getErc1155TransferDetails()).offered, (await getErc1155TransferDetails()).requested, (await getErc20TransferDetails()).offered, (await getErc20TransferDetails()).requested, (await getEthTransferDetails()).offered, (await getEthTransferDetails()).requested);
            await tx.wait();
            localStorage.clear();
        }
        catch (error) {
            console.error("Failed to add trade", error);
        }
    }
};
const enterTrade = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const tx = await contract.startTrade(tradeId);
            await tx.wait();
        }
        catch (error) {
            console.error("Error starting trade", error);
        }
    }
};
const cancelAndWithdraw = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const tx = await contract.cancelTradeAndWithdraw(tradeId);
            await tx.wait();
        }
        catch (error) {
            console.error("Error canceling trade", error);
        }
    }
};
const deleteTrade = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const tx = await contract.deleteTermsFromProfile(tradeId);
            await tx.wait();
        }
        catch (error) {
            console.error("Error deleting trade", tradeId, error);
        }
    }
};
const _approveAssets = async (tokenAddress, contractAddress, tokenId, amount) => {
    if (metamaskExist()) {
        if (amount) {
            try {
                const Erc20AbiFrag = [
                    "function approve(address spender, uint256 amount) external returns (bool)",
                ];
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(tokenAddress, Erc20AbiFrag, signer);
                const approveTx = await contract.approve(contractAddress, amount);
                await approveTx.wait();
                return;
            }
            catch (error) {
                console.error("Error approving Erc20 possible non Erc20 token or token does not exist", tokenAddress, error);
            }
        }
        try {
            const Erc721AbiFrag = [
                "function approve(address to, uint256 tokenId) external",
            ];
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(tokenAddress, Erc721AbiFrag, signer);
            const approveTx = await contract.approve(contractAddress, tokenId);
            await approveTx.wait();
            return;
        }
        catch (error) {
            console.error("Error approving Erc721 possible non Erc721 token or token does not exist", tokenAddress, error);
        }
        try {
            const Erc1155AbiFrag = [
                "function setApprovalForAll(address operator, bool approved) external",
            ];
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(tokenAddress, Erc1155AbiFrag, signer);
            const approveTx = await contract.setApprovalForAll(contractAddress, true);
            await approveTx.wait();
            return;
        }
        catch (error) {
            console.error("Error approving Erc1155 possible non Erc1155 or token does not exist", tokenAddress, error);
        }
    }
};
const approveSellerAssetsInTrade = async (tradeId) => {
    var _a, _b, _c;
    if (metamaskExist()) {
        try {
            const terms = await _getTerms(tradeId);
            if (((_a = terms === null || terms === void 0 ? void 0 : terms.offeredErc721s) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                try {
                    terms.offeredErc721s.forEach(async (asset) => {
                        await _approveAssets(asset.erc721Address, VendoraContract.address, asset.tokenId);
                    });
                }
                catch (error) {
                    console.error("Error approving offered Erc721s", error);
                }
            }
            if (((_b = terms === null || terms === void 0 ? void 0 : terms.offeredErc20s) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                try {
                    terms.offeredErc20s.forEach(async (asset) => {
                        await _approveAssets(asset.erc20Address, VendoraContract.address, undefined, asset.amount);
                    });
                }
                catch (error) {
                    console.error("Error approving offered Erc20s", error);
                }
            }
            if (((_c = terms === null || terms === void 0 ? void 0 : terms.offeredErc1155s) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                try {
                    terms.offeredErc1155s.forEach(async (asset) => {
                        await _approveAssets(asset.erc1155Address, VendoraContract.address);
                    });
                }
                catch (error) {
                    console.error("Error approving offered Erc1155s", error);
                }
            }
        }
        catch (error) {
            console.error("Error approving seller's assets", error);
        }
    }
};
const approveBuyerAssetsInTrade = async (tradeId) => {
    var _a, _b, _c;
    if (metamaskExist()) {
        try {
            const terms = await _getTerms(tradeId);
            if (((_a = terms === null || terms === void 0 ? void 0 : terms.requestedErc721s) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                try {
                    terms.requestedErc721s.forEach(async (asset) => {
                        await _approveAssets(asset.erc721Address, VendoraContract.address, asset.tokenId);
                    });
                }
                catch (error) {
                    console.error("Error approving requested Erc721s", error);
                }
            }
            if (((_b = terms === null || terms === void 0 ? void 0 : terms.requestedErc20s) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                try {
                    terms.requestedErc20s.forEach(async (asset) => {
                        await _approveAssets(asset.erc20Address, VendoraContract.address, undefined, asset.amount);
                    });
                }
                catch (error) {
                    console.error("Error approving requested Erc20s", error);
                }
            }
            if (((_c = terms === null || terms === void 0 ? void 0 : terms.requestedErc1155s) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                try {
                    terms.requestedErc1155s.forEach(async (asset) => {
                        await _approveAssets(asset.erc1155Address, VendoraContract.address);
                    });
                }
                catch (error) {
                    console.error("Error approving requested Erc1155s", error);
                }
            }
        }
        catch (error) {
            console.error("Error approving buyer's assets", error);
        }
    }
};
const depositAssets = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const depositTx = await contract.depositAssets(tradeId);
            await depositTx.wait();
        }
        catch (error) {
            console.error("Error depositing assets", error);
        }
    }
};
const _searchAllUserTradeIds = async () => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, provider);
            const trades = await contract.getUsersActiveTrades(searchBar.value);
            return trades;
        }
        catch (error) {
            console.error("Failed to search active trades, not valid address", error);
        }
    }
    return [];
};
const displaySearchedUserTradeList = async () => {
    if (metamaskExist()) {
        try {
            const tradeIds = await _searchAllUserTradeIds();
            tradesDiv2.innerHTML = "";
            tradeIds === null || tradeIds === void 0 ? void 0 : tradeIds.forEach((id) => {
                const tradeMenuElements = createTradeMenuElements(id, tradesDiv2);
                tradeMenuElements === null || tradeMenuElements === void 0 ? void 0 : tradeMenuElements.tradeDiv.addEventListener("click", () => {
                    searchContainer.style.display = "none";
                    _createTradeButtonsAndAddListeners(id, finishTradeDiv2);
                    displayFinishTradePage2();
                    displayTradePreview(id);
                });
            });
        }
        catch (error) {
            console.error("Error displaying searched trades", error);
        }
    }
};
const _getAllUserTradeIds = async () => {
    if (metamaskExist()) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const trades = await contract.getUsersActiveTrades(signer);
            return trades;
        }
        catch (error) {
            console.error("Failed to get active trades", error);
        }
    }
    return [];
};
const displayCurrentUserTradeList = async () => {
    if (metamaskExist()) {
        try {
            const tradeIds = await _getAllUserTradeIds();
            tradesDiv.innerHTML = "";
            tradeIds === null || tradeIds === void 0 ? void 0 : tradeIds.forEach((id) => {
                const tradeMenuElements = createTradeMenuElements(id, tradesDiv);
                tradeMenuElements === null || tradeMenuElements === void 0 ? void 0 : tradeMenuElements.tradeDiv.addEventListener("click", () => {
                    _createTradeButtonsAndAddListeners(id, finishTradeDiv);
                    displayFinishTradePage();
                    displayTradePreview(id);
                });
            });
        }
        catch (error) {
            console.error("Error displaying current user trades", error);
        }
    }
};
const refreshTradeList = async () => {
    if (metamaskExist()) {
        try {
            await window.ethereum.on("accountsChanged", async (newAccounts) => {
                const walletConnected = newAccounts[0] !== undefined;
                if (walletConnected) {
                    tradesDiv.innerHTML = "";
                    await displayCurrentUserTradeList();
                }
            });
        }
        catch (error) {
            console.error("No wallet connected", error);
        }
    }
};
const _createTradeButtonsAndAddListeners = (tradeId, div) => {
    try {
        finishTradeDiv.innerHTML = "";
        finishTradeDiv2.innerHTML = "";
        const tradeElements = createTradeElements(div);
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.enterTradeButton.addEventListener("click", async () => await enterTrade(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.approveSellerAssetsButton.addEventListener("click", async () => await approveSellerAssetsInTrade(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.approveBuyerAssetsButton.addEventListener("click", async () => await approveBuyerAssetsInTrade(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.depositButton.addEventListener("click", async () => await depositAssets(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.cancelButton.addEventListener("click", async () => await cancelAndWithdraw(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.deleteTradeButton.addEventListener("click", async () => {
            await deleteTrade(tradeId);
            displayActiveTradesPage();
            await displayCurrentUserTradeList();
        });
    }
    catch (error) {
        console.error("Error creating event listeners for trade buttons", error);
    }
};
const _getTerms = async (tradeId) => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, provider);
        const data = await contract.getTerms(tradeId);
        const { offeredErc721s, requestedErc721s, offeredErc1155s, requestedErc1155s, offeredErc20s, requestedErc20s, offeredEth, requestedEth, } = data;
        return {
            offeredErc721s,
            requestedErc721s,
            offeredErc1155s,
            requestedErc1155s,
            offeredErc20s,
            requestedErc20s,
            offeredEth,
            requestedEth,
        };
    }
    catch (error) {
        console.error("Error getting terms:", error);
        return;
    }
};
const _tradePreview = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const preview = {
                offeredErc721s: [],
                requestedErc721s: [],
                offeredErc1155s: [],
                requestedErc1155s: [],
                offeredErc20s: [],
                requestedErc20s: [],
                offeredEth: [],
                requestedEth: [],
            };
            const terms = await _getTerms(tradeId);
            if ((terms === null || terms === void 0 ? void 0 : terms.offeredErc721s) && terms.offeredErc721s.length > 0) {
                terms.offeredErc721s.forEach((asset) => {
                    defaultErc721s.forEach((defaultToken) => {
                        if (defaultToken.address === asset.erc721Address) {
                            preview.offeredErc721s.push({
                                address: asset.erc721Address,
                                tokenId: asset.tokenId,
                                name: defaultToken.name,
                                symbol: defaultToken.symbol,
                                logoURI: defaultToken.logoURI,
                            });
                        }
                    });
                });
            }
            if ((terms === null || terms === void 0 ? void 0 : terms.requestedErc721s) && terms.requestedErc721s.length > 0) {
                terms === null || terms === void 0 ? void 0 : terms.requestedErc721s.forEach((asset) => {
                    defaultErc721s.forEach((defaultToken) => {
                        if (defaultToken.address === asset.erc721Address) {
                            preview.requestedErc721s.push({
                                address: asset.erc721Address,
                                tokenId: asset.tokenId,
                                logoURI: defaultToken.logoURI,
                                name: defaultToken.name,
                                symbol: defaultToken.symbol,
                            });
                        }
                    });
                });
            }
            if ((terms === null || terms === void 0 ? void 0 : terms.offeredErc1155s) && terms.offeredErc1155s.length > 0) {
                terms.offeredErc1155s.forEach((asset) => {
                    defaultErc1155s.forEach((defaultToken) => {
                        if (defaultToken.address === asset.erc1155Address) {
                            preview.offeredErc1155s.push({
                                address: asset.erc1155Address,
                                tokenId: asset.tokenId,
                                amount: asset.amount,
                                logoURI: defaultToken.logoURI,
                                name: defaultToken.name,
                                symbol: defaultToken.symbol,
                            });
                        }
                    });
                });
            }
            if ((terms === null || terms === void 0 ? void 0 : terms.requestedErc1155s) && terms.requestedErc1155s.length > 0) {
                terms === null || terms === void 0 ? void 0 : terms.requestedErc1155s.forEach((asset) => {
                    defaultErc1155s.forEach((defaultToken) => {
                        if (defaultToken.address === asset.erc1155Address) {
                            preview.requestedErc1155s.push({
                                address: asset.erc1155Address,
                                tokenId: asset.tokenId,
                                amount: asset.amount,
                                logoURI: defaultToken.logoURI,
                                name: defaultToken.name,
                                symbol: defaultToken.symbol,
                            });
                        }
                    });
                });
            }
            if ((terms === null || terms === void 0 ? void 0 : terms.offeredErc20s) && terms.offeredErc20s.length > 0) {
                terms.offeredErc20s.forEach((asset) => {
                    defaultErc20s.forEach((defaultToken) => {
                        if (defaultToken.address === asset.erc20Address) {
                            preview.offeredErc20s.push({
                                address: asset.erc20Address,
                                name: defaultToken.name,
                                symbol: defaultToken.symbol,
                                logoURI: defaultToken.logoURI,
                                amount: asset.amount,
                            });
                        }
                    });
                });
            }
            if ((terms === null || terms === void 0 ? void 0 : terms.requestedErc20s) && terms.requestedErc20s.length > 0) {
                terms === null || terms === void 0 ? void 0 : terms.requestedErc20s.forEach((asset) => {
                    defaultErc20s.forEach((defaultToken) => {
                        if (defaultToken.address === asset.erc20Address) {
                            preview.requestedErc20s.push({
                                address: asset.erc20Address,
                                name: defaultToken.name,
                                symbol: defaultToken.symbol,
                                logoURI: defaultToken.logoURI,
                                amount: asset.amount,
                            });
                        }
                    });
                });
            }
            if (terms === null || terms === void 0 ? void 0 : terms.offeredEth) {
                defaultNativeTokens.forEach((nativeCurrency) => {
                    preview.offeredEth.push({
                        name: nativeCurrency.name,
                        symbol: nativeCurrency.symbol,
                        logoURI: nativeCurrency.logoURI,
                        amount: terms.offeredEth,
                    });
                });
            }
            if (terms === null || terms === void 0 ? void 0 : terms.requestedEth) {
                defaultNativeTokens.forEach((nativeCurrency) => {
                    preview.requestedEth.push({
                        name: nativeCurrency.name,
                        symbol: nativeCurrency.symbol,
                        logoURI: nativeCurrency.logoURI,
                        amount: terms.requestedEth,
                    });
                });
            }
            return preview;
        }
        catch (error) {
            console.error("Error getting trade preview", error);
        }
    }
    return;
};
const _displayRequestedTradePreview = async (tradeId) => {
    try {
        const preview = await _tradePreview(tradeId);
        _createRequestedErc721PreviewMenu(preview === null || preview === void 0 ? void 0 : preview.requestedErc721s);
        _createRequestedErc1155PreviewMenu(preview === null || preview === void 0 ? void 0 : preview.requestedErc1155s);
        _createRequestedErc20PreviewMenu(preview === null || preview === void 0 ? void 0 : preview.requestedErc20s);
        _createRequestedEthPreviewMenu(preview === null || preview === void 0 ? void 0 : preview.requestedEth);
    }
    catch (error) {
        console.error("Error displaying requested trade preview", error);
    }
};
const _displayOfferedTradePreview = async (tradeId) => {
    try {
        const preview = await _tradePreview(tradeId);
        _createOfferedErc721PreviewMenu(preview === null || preview === void 0 ? void 0 : preview.offeredErc721s);
        _createOfferedErc1155PreviewMenu(preview === null || preview === void 0 ? void 0 : preview.offeredErc1155s);
        _createOfferedErc20PreviewMenu(preview === null || preview === void 0 ? void 0 : preview.offeredErc20s);
        _createOfferedEthPreviewMenu(preview === null || preview === void 0 ? void 0 : preview.offeredEth);
    }
    catch (error) {
        console.error("Error displaying offered trade preview", error);
    }
};
const displayTradePreview = (tradeId) => {
    _displayOfferedTradePreview(tradeId);
    _displayRequestedTradePreview(tradeId);
};
window.addEventListener("load", async () => {
    if (metamaskExist()) {
        try {
            setTermsButton === null || setTermsButton === void 0 ? void 0 : setTermsButton.addEventListener("click", addTrade);
            searchButton.addEventListener("click", async () => await displaySearchedUserTradeList());
            await refreshTradeList();
            await displayCurrentUserTradeList();
        }
        catch (error) {
            console.error("Error loading functions on window load");
        }
    }
});
tradesTab.addEventListener("click", async () => {
    try {
        await displayCurrentUserTradeList();
    }
    catch (error) {
        console.error("Error handling trades tab event listener", error);
    }
});
