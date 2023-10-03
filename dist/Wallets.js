import { connectWalletButton, setTermsButton } from "./FrontEndElements.js";
const metamaskExist = () => {
    const metamaskExist = typeof window.ethereum !== "undefined";
    return metamaskExist;
};
const updateFrontEndConnected = async () => {
    connectWalletButton.forEach((btn) => {
        btn.innerText = "Connected";
    });
    setTermsButton.innerText = "Add Trade";
};
const updateFrontEndNotConnected = async () => {
    connectWalletButton.forEach((btn) => {
        btn.innerText = "Connect";
    });
    setTermsButton.innerText = "Connect to Add Trade";
};
const connectToNode = async () => {
    if (metamaskExist()) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            connectWalletButton.forEach((btn) => {
                btn.innerText = "Connected";
            });
        }
        catch (error) {
            console.error("Please install Metamask", error);
        }
    }
};
const handleAccountChange = async () => {
    if (metamaskExist()) {
        try {
            await window.ethereum.on("accountsChanged", async (newAccounts) => {
                const walletConnected = newAccounts[0] !== undefined;
                walletConnected
                    ? await updateFrontEndConnected()
                    : await updateFrontEndNotConnected();
            });
        }
        catch (error) {
            console.error("No wallet connected", error);
        }
    }
};
const checkIfAccountIsConnected = async () => {
    if (metamaskExist()) {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            accounts.length > 0
                ? await updateFrontEndConnected()
                : await updateFrontEndNotConnected();
        }
        catch (error) {
            console.error("Failed to check if account is connected", error);
        }
    }
};
document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!metamaskExist()) {
            console.error("MetaMask is not installed.");
            return;
        }
        await checkIfAccountIsConnected();
        await handleAccountChange();
        connectWalletButton.forEach((btn) => {
            btn.addEventListener("click", async () => {
                try {
                    await connectToNode();
                    await checkIfAccountIsConnected();
                }
                catch (error) {
                    console.error("Error while connecting to the node or checking connection status: ", error);
                }
            });
        });
    }
    catch (error) {
        console.error("An error occurred while initializing: ", error);
    }
});
