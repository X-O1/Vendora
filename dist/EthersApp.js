import { ethers } from "ethers";
import { requestedErc721Details, requestedErc1155Details, requestedErc20Details, requestedEthDetails, offeredErc721Details, offeredErc1155Details, offeredErc20Details, offeredEthDetails, } from "./TermsAssetDetails";
import { finishTradeDiv, searchBar, searchButton, setTermsButton, tradesDiv, tradesDiv2, } from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
import { createTradeElements, createTradeMenuElements, displayFinishTradePage, } from "./TradeMenu";
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
            await contract.setTerms(offeredErc721Details, requestedErc721Details, offeredErc1155Details, requestedErc1155Details, offeredErc20Details, requestedErc20Details, offeredEthDetails, requestedEthDetails);
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
                    _createTradeButtonsAndAddListeners(id);
                    displayFinishTradePage();
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
            tradeIds === null || tradeIds === void 0 ? void 0 : tradeIds.forEach((id) => {
                const tradeMenuElements = createTradeMenuElements(id, tradesDiv);
                tradeMenuElements === null || tradeMenuElements === void 0 ? void 0 : tradeMenuElements.tradeDiv.addEventListener("click", () => {
                    _createTradeButtonsAndAddListeners(id);
                    displayFinishTradePage();
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
const _createTradeButtonsAndAddListeners = (tradeId) => {
    try {
        finishTradeDiv.innerHTML = "";
        const tradeElements = createTradeElements();
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.enterTradeButton.addEventListener("click", () => enterTrade(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.approveSellerAssetsButton.addEventListener("click", () => approveSellerAssetsInTrade(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.approveBuyerAssetsButton.addEventListener("click", () => approveBuyerAssetsInTrade(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.depositButton.addEventListener("click", () => depositAssets(tradeId));
        tradeElements === null || tradeElements === void 0 ? void 0 : tradeElements.cancelButton.addEventListener("click", () => cancelAndWithdraw(tradeId));
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
window.addEventListener("load", async () => {
    if (metamaskExist()) {
        try {
            setTermsButton === null || setTermsButton === void 0 ? void 0 : setTermsButton.addEventListener("click", addTrade);
            await refreshTradeList();
            await displayCurrentUserTradeList();
        }
        catch (error) {
            console.error("Error loading functions on content loaded");
        }
    }
});
searchButton.addEventListener("click", async () => await displaySearchedUserTradeList());
