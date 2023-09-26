import { ethers } from "ethers";
import { requestedErc721Details, requestedErc1155Details, requestedErc20Details, requestedEthDetails, offeredErc721Details, offeredErc1155Details, offeredErc20Details, offeredEthDetails, } from "./TermsAssetDetails";
import { approveBuyerAssetsButton, approveSellerAssetsButton, depositButton, setTermsButton, } from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const metamaskExist = () => {
    const metamaskExist = typeof window.ethereum !== "undefined";
    return metamaskExist;
};
const addTrade = async () => {
    if (metamaskExist()) {
        try {
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            await contract.setTerms(offeredErc721Details, requestedErc721Details, offeredErc1155Details, requestedErc1155Details, offeredErc20Details, requestedErc20Details, offeredEthDetails, requestedEthDetails);
        }
        catch (error) {
            console.error("Failed to add trade", error);
        }
    }
};
setTermsButton.addEventListener("click", addTrade);
const _approveAssets = async (tokenAddress, contractAddress, tokenId, amount) => {
    if (metamaskExist()) {
        if (amount) {
            try {
                const Erc20AbiFrag = [
                    "function approve(address spender, uint256 amount) external returns (bool)",
                ];
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
    if (metamaskExist()) {
        try {
            const terms = await getTerms(tradeId);
            if (terms.offeredErc721s.length > 0) {
                try {
                    terms.offeredErc721s.forEach(async (asset) => {
                        await _approveAssets(asset.erc721Address, VendoraContract.address, asset.tokenId);
                    });
                }
                catch (error) {
                    console.error("Error approving offered Erc721s", error);
                }
            }
            if (terms.offeredErc20s.length > 0) {
                try {
                    terms.offeredErc20s.forEach(async (asset) => {
                        await _approveAssets(asset.erc20Address, VendoraContract.address, undefined, asset.amount);
                    });
                }
                catch (error) {
                    console.error("Error approving offered Erc20s", error);
                }
            }
            if (terms.offeredErc1155s.length > 0) {
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
approveSellerAssetsButton.addEventListener("click", () => approveSellerAssetsInTrade(""));
const approveBuyerAssetsInTrade = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const terms = await getTerms(tradeId);
            if (terms.requestedErc721s.length > 0) {
                try {
                    terms.requestedErc721s.forEach(async (asset) => {
                        await _approveAssets(asset.erc721Address, VendoraContract.address, asset.tokenId);
                    });
                }
                catch (error) {
                    console.error("Error approving requested Erc721s", error);
                }
            }
            if (terms.requestedErc20s.length > 0) {
                try {
                    terms.requestedErc20s.forEach(async (asset) => {
                        await _approveAssets(asset.erc20Address, VendoraContract.address, undefined, asset.amount);
                    });
                }
                catch (error) {
                    console.error("Error approving requested Erc20s", error);
                }
            }
            if (terms.requestedErc1155s.length > 0) {
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
approveBuyerAssetsButton.addEventListener("click", () => approveBuyerAssetsInTrade(""));
const depositAssets = async (tradeId) => {
    if (metamaskExist()) {
        try {
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const depositTx = await contract.depositAssests(tradeId);
            await depositTx.wait();
        }
        catch (error) {
            console.error("Error depositing seller's assets", error);
        }
    }
};
depositButton.addEventListener("click", () => depositAssets("7897987"));
const getTerms = async (tradeId) => {
    try {
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
