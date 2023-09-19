import { ethers } from "ethers";
import {
  getErc1155TransferDetails,
  getErc20TransferDetails,
  getErc721TransferDetails,
  getEthTransferDetails,
} from "./TermsAssetDetails";
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

const metamaskExist = (): boolean => {
  const metamaskExist = typeof window.ethereum !== "undefined";
  return metamaskExist;
};
const addTrade = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );

      await contract.setTerms(
        offeredErc721Details,
        requestedErc721Details,
        offeredErc1155Details,
        requestedErc1155Details,
        offeredErc20Details,
        requestedErc20Details,
        offeredEthDetails,
        requestedEthDetails
      );
    } catch (error) {
      console.error("Failed to add trade", error);
    }
  }
};
setTermsButton.addEventListener("click", addTrade);

const getTradeId = async (): Promise<ethers.BytesLike> => {
  if (metamaskExist()) {
    try {
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        provider
      );
      await contract.on("Terms_Set", (tradeId: string) => {
        const id: ethers.BytesLike = tradeId;
        return id;
      });
    } catch (error) {
      console.error("Log trade id failed", error);
    }
  }
  return "";
};

const getActiveTrades = async (): Promise<ethers.BytesLike[]> => {
  if (metamaskExist()) {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );

      const getTrades: ethers.BytesLike[] = await contract.getUserActiveTerms(
        signer
      );
      return getTrades;
    } catch (error) {
      console.error("Failed to get active trades", error);
    }
  }
  return [];
};

export { getActiveTrades, getTradeId };
