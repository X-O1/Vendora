import { connectWalletButton, setTermsButton } from "./FrontEndElements.js";

const metamaskExist = (): boolean => {
  const metamaskExist = typeof window.ethereum !== "undefined";
  return metamaskExist;
};
const updateFrontEndConnected = async (): Promise<void> => {
  connectWalletButton.forEach((btn) => {
    btn.innerText = "Connected";
  });
  setTermsButton.innerText = "Add Trade";
};
const updateFrontEndNotConnected = async (): Promise<void> => {
  connectWalletButton.forEach((btn) => {
    btn.innerText = "Connect";
  });
  setTermsButton.innerText = "Connect to Add Trade";
};
const connectToNode = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectWalletButton.forEach((btn) => {
        btn.innerText = "Connected";
      });
    } catch (error) {
      console.error("Please install Metamask", error);
    }
  }
};

const handleAccountChange = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      await window.ethereum.on(
        "accountsChanged",
        async (newAccounts: string[]): Promise<void> => {
          const walletConnected: boolean = newAccounts[0] !== undefined;
          walletConnected
            ? await updateFrontEndConnected()
            : await updateFrontEndNotConnected();
        }
      );
    } catch (error) {
      console.error("No wallet connected", error);
    }
  }
};

const checkIfAccountIsConnected = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      accounts.length > 0
        ? await updateFrontEndConnected()
        : await updateFrontEndNotConnected();
    } catch (error) {
      console.error("Failed to check if account is connected", error);
    }
  }
};

document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
  try {
    if (!metamaskExist()) {
      console.error("MetaMask is not installed.");
      return;
    }
    await checkIfAccountIsConnected();
    await handleAccountChange();

    connectWalletButton.forEach((btn) => {
      btn.addEventListener("click", async (): Promise<void> => {
        try {
          await connectToNode();
          await checkIfAccountIsConnected();
        } catch (error) {
          console.error(
            "Error while connecting to the node or checking connection status: ",
            error
          );
        }
      });
    });
  } catch (error) {
    console.error("An error occurred while initializing: ", error);
  }
});
