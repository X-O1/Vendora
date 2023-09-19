import { ethers } from "ethers";
import { getErc1155TransferDetails, getErc20TransferDetails, getErc721TransferDetails, getEthTransferDetails, } from "./TermsAssetDetails";
import { setTermsButton } from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
const requestedErc721Details = getErc721TransferDetails().requested;
const requestedErc1155Details = getErc1155TransferDetails().requested;
const requestedErc20Details = getErc20TransferDetails().requested;
const requestedEthDetails = getEthTransferDetails().requested;
const offeredErc721Details = getErc721TransferDetails().offered;
const offeredErc1155Details = getErc1155TransferDetails().offered;
const offeredErc20Details = getErc20TransferDetails().offered;
const offeredEthDetails = getEthTransferDetails().offered;
const provider = new ethers.BrowserProvider(window.ethereum);
const metamaskExist = () => {
    const metamaskExist = typeof window.ethereum !== "undefined";
    return metamaskExist;
};
const addTrade = async () => {
    if (metamaskExist()) {
        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            await contract.setTerms(offeredErc721Details, requestedErc721Details, offeredErc1155Details, requestedErc1155Details, offeredErc20Details, requestedErc20Details, offeredEthDetails, requestedEthDetails);
        }
        catch (error) {
            console.error("Failed to add trade", error);
        }
    }
};
setTermsButton.addEventListener("click", addTrade);
const getTradeId = () => {
    if (metamaskExist()) {
        try {
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, provider);
            contract.on("Terms_Set", (tradeId) => {
                console.log(`Trade Id: ${tradeId}`);
            });
        }
        catch (error) {
            console.error("Log trade id failed", error);
        }
    }
};
getTradeId();
const getActiveTrades = async () => {
    if (metamaskExist()) {
        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, signer);
            const getTrades = await contract.getUserActiveTerms(signer);
            console.log(getTrades);
        }
        catch (error) { }
    }
};
getActiveTrades();
