import { connectWalletButton, setTermsButton } from "./FrontEndElements.js";
import { ethers } from "ethers";
const metamaskExist = () => {
    const metamaskExist = typeof window.ethereum !== "undefined";
    return metamaskExist;
};
const updateFrontEndConnected = () => {
    connectWalletButton.innerText = "Connected";
    setTermsButton.innerText = "Add Trade";
};
const updateFrontEndNotConnected = () => {
    connectWalletButton.innerText = "Connect";
    setTermsButton.innerText = "Connect to Add Trade";
};
const connectToNode = async () => {
    if (metamaskExist()) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            connectWalletButton.innerText = "Connected";
        }
        catch (error) {
            console.log("Please install Metamask", error);
        }
    }
};
const changeAccounts = () => {
    if (metamaskExist()) {
        try {
            window.ethereum.on("accountsChanged", (newAccounts) => {
                const walletConnected = newAccounts[0] !== undefined;
                walletConnected
                    ? updateFrontEndConnected()
                    : updateFrontEndNotConnected();
            });
        }
        catch (error) {
            console.log("No wallet connected", error);
        }
    }
};
window.addEventListener("load", changeAccounts);
const checkIfAccountIsConnected = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const connectedAccount = await signer.getAddress();
    connectedAccount !== undefined
        ? updateFrontEndConnected()
        : updateFrontEndNotConnected();
};
window.addEventListener("load", () => {
    connectWalletButton.addEventListener("click", connectToNode);
    changeAccounts();
    checkIfAccountIsConnected();
});
