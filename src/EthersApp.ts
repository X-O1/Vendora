import { ethers } from "ethers";
import {
  requestedErc721Details,
  requestedErc1155Details,
  requestedErc20Details,
  requestedEthDetails,
  offeredErc721Details,
  offeredErc1155Details,
  offeredErc20Details,
  offeredEthDetails,
  Erc721TransferDetails,
  Erc20TransferDetails,
  Erc1155TransferDetails,
} from "./TermsAssetDetails";
import {
  finishTradeDiv,
  searchBar,
  searchButton,
  setTermsButton,
  tradesDiv,
  tradesDiv2,
  // tradesDiv,
} from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
import {
  createTradeElements,
  createTradeMenuElements,
  displayFinishTradePage,
} from "./TradeMenu";

type Terms = {
  offeredErc721s: Erc721TransferDetails[];
  requestedErc721s: Erc721TransferDetails[];
  offeredErc1155s: Erc1155TransferDetails[];
  requestedErc1155s: Erc1155TransferDetails[];
  offeredErc20s: Erc20TransferDetails[];
  requestedErc20s: Erc20TransferDetails[];
  offeredEth: BigInt;
  requestedEth: BigInt;
};

const metamaskExist = (): boolean => {
  const metamaskExist = typeof window.ethereum !== "undefined";
  return metamaskExist;
};

const addTrade = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
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

const enterTrade = async (tradeId: string): Promise<void> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();

      const contract: ethers.Contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );

      const tx = await contract.startTrade(tradeId);
      await tx.wait();
    } catch (error) {
      console.error("Error starting trade", error);
    }
  }
};

const cancelAndWithdraw = async (tradeId: string): Promise<void> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
      const contract: ethers.Contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );

      const tx = await contract.cancelTradeAndWithdraw(tradeId);
      await tx.wait();
    } catch (error) {
      console.error("Error canceling trade", error);
    }
  }
};

const _approveAssets = async (
  tokenAddress: string,
  contractAddress: string,
  tokenId?: bigint,
  amount?: bigint
): Promise<void> => {
  if (metamaskExist()) {
    // Approve ERC20
    if (amount) {
      try {
        const Erc20AbiFrag: string[] = [
          "function approve(address spender, uint256 amount) external returns (bool)",
        ];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer: ethers.JsonRpcSigner = await provider.getSigner();
        const contract: ethers.Contract = new ethers.Contract(
          tokenAddress,
          Erc20AbiFrag,
          signer
        );

        const approveTx = await contract.approve(contractAddress, amount);
        await approveTx.wait();
        return;
      } catch (error) {
        console.error(
          "Error approving Erc20 possible non Erc20 token or token does not exist",
          tokenAddress,
          error
        );
      }
    }
    // Approve ERC721
    try {
      const Erc721AbiFrag: string[] = [
        "function approve(address to, uint256 tokenId) external",
      ];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
      const contract: ethers.Contract = new ethers.Contract(
        tokenAddress,
        Erc721AbiFrag,
        signer
      );

      const approveTx = await contract.approve(contractAddress, tokenId);
      await approveTx.wait();
      return;
    } catch (error) {
      console.error(
        "Error approving Erc721 possible non Erc721 token or token does not exist",
        tokenAddress,
        error
      );
    }
    // Approve Erc1155
    try {
      const Erc1155AbiFrag: string[] = [
        "function setApprovalForAll(address operator, bool approved) external",
      ];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
      const contract: ethers.Contract = new ethers.Contract(
        tokenAddress,
        Erc1155AbiFrag,
        signer
      );

      const approveTx = await contract.setApprovalForAll(contractAddress, true);
      await approveTx.wait();
      return;
    } catch (error) {
      console.error(
        "Error approving Erc1155 possible non Erc1155 or token does not exist",
        tokenAddress,
        error
      );
    }
  }
};

const approveSellerAssetsInTrade = async (tradeId: string): Promise<void> => {
  if (metamaskExist()) {
    try {
      const terms: Terms = await _getTerms(tradeId);

      if (terms?.offeredErc721s?.length > 0) {
        try {
          terms.offeredErc721s.forEach(
            async (asset: Erc721TransferDetails): Promise<void> => {
              await _approveAssets(
                asset.erc721Address,
                VendoraContract.address,
                asset.tokenId
              );
            }
          );
        } catch (error) {
          console.error("Error approving offered Erc721s", error);
        }
      }

      if (terms?.offeredErc20s?.length > 0) {
        try {
          terms.offeredErc20s.forEach(
            async (asset: Erc20TransferDetails): Promise<void> => {
              await _approveAssets(
                asset.erc20Address,
                VendoraContract.address,
                undefined,
                asset.amount
              );
            }
          );
        } catch (error) {
          console.error("Error approving offered Erc20s", error);
        }
      }

      if (terms?.offeredErc1155s?.length > 0) {
        try {
          terms.offeredErc1155s.forEach(
            async (asset: Erc1155TransferDetails): Promise<void> => {
              await _approveAssets(
                asset.erc1155Address,
                VendoraContract.address
              );
            }
          );
        } catch (error) {
          console.error("Error approving offered Erc1155s", error);
        }
      }
    } catch (error) {
      console.error("Error approving seller's assets", error);
    }

    // check if tokens have been approved
  }
};

const approveBuyerAssetsInTrade = async (tradeId: string): Promise<void> => {
  if (metamaskExist()) {
    try {
      const terms: Terms = await _getTerms(tradeId);

      if (terms?.requestedErc721s?.length > 0) {
        try {
          terms.requestedErc721s.forEach(
            async (asset: Erc721TransferDetails): Promise<void> => {
              await _approveAssets(
                asset.erc721Address,
                VendoraContract.address,
                asset.tokenId
              );
            }
          );
        } catch (error) {
          console.error("Error approving requested Erc721s", error);
        }
      }

      if (terms?.requestedErc20s?.length > 0) {
        try {
          terms.requestedErc20s.forEach(
            async (asset: Erc20TransferDetails): Promise<void> => {
              await _approveAssets(
                asset.erc20Address,
                VendoraContract.address,
                undefined,
                asset.amount
              );
            }
          );
        } catch (error) {
          console.error("Error approving requested Erc20s", error);
        }
      }

      if (terms?.requestedErc1155s?.length > 0) {
        try {
          terms.requestedErc1155s.forEach(
            async (asset: Erc1155TransferDetails): Promise<void> => {
              await _approveAssets(
                asset.erc1155Address,
                VendoraContract.address
              );
            }
          );
        } catch (error) {
          console.error("Error approving requested Erc1155s", error);
        }
      }
    } catch (error) {
      console.error("Error approving buyer's assets", error);
    }
  }
};

const depositAssets = async (tradeId: string): Promise<void> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );

      const depositTx = await contract.depositAssets(tradeId);
      await depositTx.wait();
    } catch (error) {
      console.error("Error depositing assets", error);
    }
  }
};

const _searchAllUserTradeIds = async (): Promise<string[]> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        provider
      );

      const trades: string[] = await contract.getUsersActiveTrades(
        searchBar.value
      );
      return trades;
    } catch (error) {
      console.error("Failed to search active trades, not valid address", error);
    }
  }
  return [];
};

const displaySearchedUserTradeList = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      const tradeIds: string[] = await _searchAllUserTradeIds();
      tradesDiv2.innerHTML = "";

      tradeIds?.forEach((id: string): void => {
        const tradeMenuElements = createTradeMenuElements(id, tradesDiv2);

        tradeMenuElements?.tradeDiv.addEventListener("click", () => {
          _createTradeButtonsAndAddListeners(id);
          displayFinishTradePage();
        });
      });
    } catch (error) {
      console.error("Error displaying searched trades", error);
    }
  }
};

const _getAllUserTradeIds = async (): Promise<string[]> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );
      const trades: string[] = await contract.getUsersActiveTrades(signer);
      return trades;
    } catch (error) {
      console.error("Failed to get active trades", error);
    }
  }
  return [];
};

const displayCurrentUserTradeList = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      const tradeIds: string[] = await _getAllUserTradeIds();

      tradeIds?.forEach((id: string): void => {
        const tradeMenuElements = createTradeMenuElements(id, tradesDiv);

        tradeMenuElements?.tradeDiv.addEventListener("click", () => {
          _createTradeButtonsAndAddListeners(id);
          displayFinishTradePage();
        });
      });
    } catch (error) {
      console.error("Error displaying current user trades", error);
    }
  }
};

const refreshTradeList = async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      await window.ethereum.on(
        "accountsChanged",
        async (newAccounts: string[]): Promise<void> => {
          const walletConnected: boolean = newAccounts[0] !== undefined;
          if (walletConnected) {
            tradesDiv.innerHTML = "";
            await displayCurrentUserTradeList();
          }
        }
      );
    } catch (error) {
      console.error("No wallet connected", error);
    }
  }
};

const _createTradeButtonsAndAddListeners = (tradeId: string): void => {
  try {
    finishTradeDiv.innerHTML = "";
    const tradeElements = createTradeElements();

    tradeElements?.enterTradeButton.addEventListener(
      "click",
      (): Promise<void> => enterTrade(tradeId)
    );

    tradeElements?.approveSellerAssetsButton.addEventListener(
      "click",
      (): Promise<void> => approveSellerAssetsInTrade(tradeId)
    );

    tradeElements?.approveBuyerAssetsButton.addEventListener(
      "click",
      (): Promise<void> => approveBuyerAssetsInTrade(tradeId)
    );

    tradeElements?.depositButton.addEventListener(
      "click",
      (): Promise<void> => depositAssets(tradeId)
    );

    tradeElements?.cancelButton.addEventListener(
      "click",
      (): Promise<void> => cancelAndWithdraw(tradeId)
    );
  } catch (error) {
    console.error("Error creating event listeners for trade buttons", error);
  }
};

const _getTerms = async (tradeId: string): Promise<any> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const contract = new ethers.Contract(
      VendoraContract.address,
      VendoraContract.abi,
      provider
    );
    const data = await contract.getTerms(tradeId);

    const {
      offeredErc721s,
      requestedErc721s,
      offeredErc1155s,
      requestedErc1155s,
      offeredErc20s,
      requestedErc20s,
      offeredEth,
      requestedEth,
    } = data;

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
  } catch (error) {
    console.error("Error getting terms:", error);
    return;
  }
};

window.addEventListener("load", async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      setTermsButton?.addEventListener("click", addTrade);

      await refreshTradeList();
      await displayCurrentUserTradeList();
    } catch (error) {
      console.error("Error loading functions on content loaded");
    }
  }
});

searchButton.addEventListener(
  "click",
  async (): Promise<void> => await displaySearchedUserTradeList()
);
