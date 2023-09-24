import { ethers } from "ethers";
import { requestedErc721Details, requestedErc1155Details, requestedErc20Details, requestedEthDetails, offeredErc721Details, offeredErc1155Details, offeredErc20Details, offeredEthDetails, } from "./TermsAssetDetails";
import { setTermsButton } from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
import { User, terms } from "./Profiles";
import { setUserProfileInLocalStorage } from "./LocalStorage";
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
            const setTerms = await contract.setTerms(offeredErc721Details, requestedErc721Details, offeredErc1155Details, requestedErc1155Details, offeredErc20Details, requestedErc20Details, offeredEthDetails, requestedEthDetails);
            await setTerms.wait();
            const userProfile = new User((await signer.getAddress()).toString());
            userProfile.addTrade("trade1", (await getTradeId()).toString(), terms);
            setUserProfileInLocalStorage("profile", userProfile);
        }
        catch (error) {
            console.error("Failed to add trade", error);
        }
    }
};
setTermsButton.addEventListener("click", addTrade);
const getTradeId = async () => {
    if (metamaskExist()) {
        try {
            const contract = new ethers.Contract(VendoraContract.address, VendoraContract.abi, provider);
            await contract.on("Terms_Set", (tradeId) => {
                const id = tradeId;
                console.log(id);
            });
        }
        catch (error) {
            console.error("Log trade id failed", error);
        }
    }
    return "";
};
