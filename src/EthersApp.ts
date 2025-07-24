import { ethers } from "ethers";
import {
  Erc721TransferDetails,
  Erc20TransferDetails,
  Erc1155TransferDetails,
  getErc721TransferDetails,
  getErc1155TransferDetails,
  getErc20TransferDetails,
  getEthTransferDetails,
} from "./TermsAssetDetails";
import {
  finishTradeDiv,
  finishTradeDiv2,
  searchBar,
  searchButton,
  searchContainer,
  setTermsButton,
  tradeNameInput,
  tradesDiv,
  tradesDiv2,
  tradesTab,
} from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
import {
  createTradeElements,
  createTradeMenuElements,
  displayActiveTradesPage,
  displayFinishTradePage,
  displayFinishTradePage2,
} from "./TradeMenu";
import {
  TokenPreview,
  TradePreview,
  _createOfferedErc1155PreviewMenu,
  _createOfferedErc20PreviewMenu,
  _createOfferedErc721PreviewMenu,
  _createOfferedEthPreviewMenu,
  _createRequestedErc1155PreviewMenu,
  _createRequestedErc20PreviewMenu,
  _createRequestedErc721PreviewMenu,
  _createRequestedEthPreviewMenu,
} from "./TradePreview";
import {
  TokenOption,
  defaultErc1155s,
  defaultErc20s,
  defaultErc721s,
  defaultNativeTokens,
} from "./DefaultTokens";
// import { displayTradeList } from "./TradeListMenu";

type Terms = {
  tradeName: string;
  offeredErc721s: Erc721TransferDetails[];
  requestedErc721s: Erc721TransferDetails[];
  offeredErc1155s: Erc1155TransferDetails[];
  requestedErc1155s: Erc1155TransferDetails[];
  offeredErc20s: Erc20TransferDetails[];
  requestedErc20s: Erc20TransferDetails[];
  offeredEth: number;
  requestedEth: number;
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

      const tx = await contract.setTerms(
        tradeNameInput.value,
        (
          await getErc721TransferDetails()
        ).offered,
        (
          await getErc721TransferDetails()
        ).requested,
        (
          await getErc1155TransferDetails()
        ).offered,
        (
          await getErc1155TransferDetails()
        ).requested,
        (
          await getErc20TransferDetails()
        ).offered,
        (
          await getErc20TransferDetails()
        ).requested,
        (
          await getEthTransferDetails()
        ).offered,
        (
          await getEthTransferDetails()
        ).requested
      );
      await tx.wait();
      // displayTradeList();
      localStorage.clear();
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

      const tx = await contract.enterTrade(tradeId);
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

const deleteTrade = async (tradeId: string): Promise<void> => {
  if (metamaskExist()) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer: ethers.JsonRpcSigner = await provider.getSigner();
      const contract: ethers.Contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        signer
      );

      const tx = await contract.deleteTrade(tradeId);
      await tx.wait();
    } catch (error) {
      console.error("Error deleting trade", tradeId, error);
    }
  }
};

const _approveAssets = async (
  tokenAddress: string,
  contractAddress: string,
  tokenId?: number,
  amount?: number
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

      tradeIds?.forEach(async (id: string): Promise<void> => {
        const tradeMenuElements = createTradeMenuElements(id, tradesDiv2);
        const preview = await _tradePreview(id);
        const terms: Terms = await _getTerms(id);

        if (preview?.offeredErc721s.length !== 0) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredErc721s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedErc721s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src =
            preview?.requestedErc721s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.offeredErc1155s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredErc1155s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedErc1155s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src =
            preview?.requestedErc1155s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.offeredErc20s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredErc20s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedErc20s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.requestedErc20s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.offeredEth.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredEth[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedEth.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.requestedEth[0].logoURI || "token image";
        }

        tradeMenuElements?.tradeDiv.addEventListener("click", () => {
          searchContainer.style.display = "none";
          _createTradeButtonsAndAddListeners(id, finishTradeDiv2);
          displayFinishTradePage2();
          displayTradePreview(id);
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
      tradesDiv.innerHTML = "";

      tradeIds?.forEach(async (id: string): Promise<void> => {
        const tradeMenuElements = createTradeMenuElements(id, tradesDiv);
        const preview = await _tradePreview(id);
        const terms: Terms = await _getTerms(id);

        if (preview?.offeredErc721s.length !== 0) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredErc721s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedErc721s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src =
            preview?.requestedErc721s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.offeredErc1155s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredErc1155s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedErc1155s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src =
            preview?.requestedErc1155s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.offeredErc20s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredErc20s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedErc20s.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.requestedErc20s[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.offeredEth.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.offeredEth[0].logoURI || "token image";
        }

        if (
          (tradeMenuElements?.tokenImagesDiv?.childElementCount ?? 0) < 4 &&
          preview?.requestedEth.length !== 0
        ) {
          const tokenImage: HTMLImageElement = document.createElement("img");
          tokenImage.classList.add("token-image");
          tradeMenuElements?.tokenImagesDiv.appendChild(tokenImage);
          tradeMenuElements?.tradeNameDiv
            ? (tradeMenuElements.tradeNameDiv.innerText = terms.tradeName)
            : undefined;
          tokenImage.src = preview?.requestedEth[0].logoURI || "token image";
        }

        tradeMenuElements?.tradeDiv.addEventListener("click", () => {
          searchContainer.style.display = "none";
          _createTradeButtonsAndAddListeners(id, finishTradeDiv);
          displayFinishTradePage();
          displayTradePreview(id);
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

const _createTradeButtonsAndAddListeners = async (
  tradeId: string,
  div: HTMLDivElement
): Promise<void> => {
  try {
    finishTradeDiv.innerHTML = "";
    finishTradeDiv2.innerHTML = "";
    const tradeElements = createTradeElements(div);

    tradeElements?.enterTradeButton.addEventListener(
      "click",
      async (): Promise<void> => await enterTrade(tradeId)
    );

    tradeElements?.approveSellerAssetsButton.addEventListener(
      "click",
      async (): Promise<void> => await approveSellerAssetsInTrade(tradeId)
    );

    tradeElements?.approveBuyerAssetsButton.addEventListener(
      "click",
      async (): Promise<void> => await approveBuyerAssetsInTrade(tradeId)
    );

    tradeElements?.depositButton.addEventListener(
      "click",
      async (): Promise<void> => await depositAssets(tradeId)
    );

    tradeElements?.cancelButton.addEventListener(
      "click",
      async (): Promise<void> => await cancelAndWithdraw(tradeId)
    );

    tradeElements?.deleteTradeButton.addEventListener(
      "click",
      async (): Promise<void> => {
        await deleteTrade(tradeId);
        displayActiveTradesPage();
        await displayCurrentUserTradeList();
      }
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
      tradeName,
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
      tradeName,
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

const _tradePreview = async (
  tradeId: string
): Promise<
  | {
      offeredErc721s: TokenPreview[];
      requestedErc721s: TokenPreview[];
      offeredErc1155s: TokenPreview[];
      requestedErc1155s: TokenPreview[];
      offeredErc20s: TokenPreview[];
      requestedErc20s: TokenPreview[];
      offeredEth: TokenPreview[];
      requestedEth: TokenPreview[];
    }
  | undefined
> => {
  if (metamaskExist()) {
    try {
      const preview: TradePreview = {
        offeredErc721s: [],
        requestedErc721s: [],
        offeredErc1155s: [],
        requestedErc1155s: [],
        offeredErc20s: [],
        requestedErc20s: [],
        offeredEth: [],
        requestedEth: [],
      };

      const terms: Terms = await _getTerms(tradeId);

      if (terms?.offeredErc721s && terms.offeredErc721s.length > 0) {
        terms.offeredErc721s.forEach((asset: Erc721TransferDetails) => {
          defaultErc721s.forEach((defaultToken: TokenOption) => {
            if (defaultToken.address === asset.erc721Address) {
              preview.offeredErc721s.push({
                address: asset.erc721Address,
                tokenId: asset.tokenId,
                name: defaultToken.tradeName,
                symbol: defaultToken.symbol,
                logoURI: defaultToken.logoURI,
              });
            }
          });
        });
      }

      if (terms?.requestedErc721s && terms.requestedErc721s.length > 0) {
        terms?.requestedErc721s.forEach((asset: Erc721TransferDetails) => {
          defaultErc721s.forEach((defaultToken: TokenOption) => {
            if (defaultToken.address === asset.erc721Address) {
              preview.requestedErc721s.push({
                address: asset.erc721Address,
                tokenId: asset.tokenId,
                logoURI: defaultToken.logoURI,
                name: defaultToken.tradeName,
                symbol: defaultToken.symbol,
              });
            }
          });
        });
      }

      if (terms?.offeredErc1155s && terms.offeredErc1155s.length > 0) {
        terms.offeredErc1155s.forEach((asset: Erc1155TransferDetails) => {
          defaultErc1155s.forEach((defaultToken: TokenOption) => {
            if (defaultToken.address === asset.erc1155Address) {
              preview.offeredErc1155s.push({
                address: asset.erc1155Address,
                tokenId: asset.tokenId,
                amount: asset.amount,
                logoURI: defaultToken.logoURI,
                name: defaultToken.tradeName,
                symbol: defaultToken.symbol,
              });
            }
          });
        });
      }

      if (terms?.requestedErc1155s && terms.requestedErc1155s.length > 0) {
        terms?.requestedErc1155s.forEach((asset: Erc1155TransferDetails) => {
          defaultErc1155s.forEach((defaultToken: TokenOption) => {
            if (defaultToken.address === asset.erc1155Address) {
              preview.requestedErc1155s.push({
                address: asset.erc1155Address,
                tokenId: asset.tokenId,
                amount: asset.amount,
                logoURI: defaultToken.logoURI,
                name: defaultToken.tradeName,
                symbol: defaultToken.symbol,
              });
            }
          });
        });
      }

      // For offeredErc20s
      if (terms?.offeredErc20s && terms.offeredErc20s.length > 0) {
        terms.offeredErc20s.forEach((asset: Erc20TransferDetails) => {
          defaultErc20s.forEach((defaultToken: TokenOption) => {
            if (defaultToken.address === asset.erc20Address) {
              preview.offeredErc20s.push({
                address: asset.erc20Address,
                name: defaultToken.tradeName,
                symbol: defaultToken.symbol,
                logoURI: defaultToken.logoURI,
                amount: asset.amount,
              });
            }
          });
        });
      }

      // For requestedErc20s
      if (terms?.requestedErc20s && terms.requestedErc20s.length > 0) {
        terms?.requestedErc20s.forEach((asset: Erc20TransferDetails) => {
          defaultErc20s.forEach((defaultToken: TokenOption) => {
            if (defaultToken.address === asset.erc20Address) {
              preview.requestedErc20s.push({
                address: asset.erc20Address,
                name: defaultToken.tradeName,
                symbol: defaultToken.symbol,
                logoURI: defaultToken.logoURI,
                amount: asset.amount,
              });
            }
          });
        });
      }

      if (terms?.offeredEth) {
        defaultNativeTokens.forEach((nativeCurrency: TokenOption) => {
          preview.offeredEth.push({
            name: nativeCurrency.tradeName,
            symbol: nativeCurrency.symbol,
            logoURI: nativeCurrency.logoURI,
            amount: terms.offeredEth,
          });
        });
      }

      // For requestedEth
      if (terms?.requestedEth) {
        defaultNativeTokens.forEach((nativeCurrency: TokenOption) => {
          preview.requestedEth.push({
            name: nativeCurrency.tradeName,
            symbol: nativeCurrency.symbol,
            logoURI: nativeCurrency.logoURI,
            amount: terms.requestedEth,
          });
        });
      }

      return preview;
    } catch (error) {
      console.error("Error getting trade preview", error);
    }
  }
  return;
};

const _displayRequestedTradePreview = async (
  tradeId: string
): Promise<void> => {
  try {
    const preview = await _tradePreview(tradeId);

    _createRequestedErc721PreviewMenu(preview?.requestedErc721s);
    _createRequestedErc1155PreviewMenu(preview?.requestedErc1155s);
    _createRequestedErc20PreviewMenu(preview?.requestedErc20s);
    _createRequestedEthPreviewMenu(preview?.requestedEth);
  } catch (error) {
    console.error("Error displaying requested trade preview", error);
  }
};

const _displayOfferedTradePreview = async (tradeId: string): Promise<void> => {
  try {
    const preview = await _tradePreview(tradeId);

    _createOfferedErc721PreviewMenu(preview?.offeredErc721s);
    _createOfferedErc1155PreviewMenu(preview?.offeredErc1155s);
    _createOfferedErc20PreviewMenu(preview?.offeredErc20s);
    _createOfferedEthPreviewMenu(preview?.offeredEth);
  } catch (error) {
    console.error("Error displaying offered trade preview", error);
  }
};

const displayTradePreview = (tradeId: string): void => {
  _displayOfferedTradePreview(tradeId);
  _displayRequestedTradePreview(tradeId);
};

window.addEventListener("load", async (): Promise<void> => {
  if (metamaskExist()) {
    try {
      setTermsButton?.addEventListener("click", addTrade);
      searchButton.addEventListener(
        "click",
        async (): Promise<void> => await displaySearchedUserTradeList()
      );

      await refreshTradeList();
      await displayCurrentUserTradeList();
    } catch (error) {
      console.error("Error loading functions on window load");
    }
  }
});

tradesTab.addEventListener("click", async (): Promise<void> => {
  try {
    await displayCurrentUserTradeList();
  } catch (error) {
    console.error("Error handling trades tab event listener", error);
  }
});
