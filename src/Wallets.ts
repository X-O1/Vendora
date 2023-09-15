import { connectWalletButton, setTermsButton } from "./FrontEndElements.js";
import { ethers } from "ethers";

const metamaskExist = (): boolean => {
  const metamaskExist = typeof window.ethereum !== "undefined";
  return metamaskExist;
};
const updateFrontEndConnected = (): void => {
  connectWalletButton.innerText = "Connected";
  setTermsButton.innerText = "Add Trade";
};
const updateFrontEndNotConnected = (): void => {
  connectWalletButton.innerText = "Connect";
  setTermsButton.innerText = "Connect to Add Trade";
};
const connectToNode = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectWalletButton.innerText = "Connected";
    } catch (error) {
      console.log("Please install Metamask", error);
    }
  }
};

const changeAccounts = (): void => {
  if (metamaskExist()) {
    try {
      window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
        const walletConnected: boolean = newAccounts[0] !== undefined;
        walletConnected
          ? updateFrontEndConnected()
          : updateFrontEndNotConnected();
      });
    } catch (error) {
      console.log("No wallet connected", error);
    }
  }
};
window.addEventListener("load", changeAccounts);

const connectionState = async (): Promise<void> => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const connectedAccount = await signer.getAddress();

  connectedAccount !== undefined
    ? updateFrontEndConnected()
    : updateFrontEndNotConnected();
};
window.addEventListener("load", (): void => {
  connectWalletButton.addEventListener("click", connectToNode);
  changeAccounts();
  connectionState();
});
