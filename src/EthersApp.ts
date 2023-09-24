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
} from "./TermsAssetDetails";

import { setTermsButton } from "./FrontEndElements";
import { VendoraContract } from "./Contracts";
import { User, terms } from "./Profiles";
import { setUserProfileInLocalStorage } from "./LocalStorage";

const provider = new ethers.BrowserProvider(window.ethereum);

// type Erc721Details = {
//   erc721Address: string;
//   tokenId: number;
// };

// type Erc1155Details = {
//   address: string;
//   id: number;
//   amount: number;
// };

// type Erc20Details = {
//   address: string;
//   amount: number;
// };

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

      const setTerms = await contract.setTerms(
        offeredErc721Details,
        requestedErc721Details,
        offeredErc1155Details,
        requestedErc1155Details,
        offeredErc20Details,
        requestedErc20Details,
        offeredEthDetails,
        requestedEthDetails
      );

      await setTerms.wait();

      const userProfile: User = new User(
        (await signer.getAddress()).toString()
      );

      userProfile.addTrade("trade1", (await getTradeId()).toString(), terms);
      setUserProfileInLocalStorage("profile", userProfile);

      console.log(
        `Terms: ${userProfile.getTradeById((await getTradeId()).toString()[0])}`
      );
    } catch (error) {
      console.error("Failed to add trade", error);
    }
  }
};

setTermsButton.addEventListener("click", addTrade);

// Get all trades built by user that are active
// const getUserTrades = async (): Promise<string[]> => {
//   if (metamaskExist()) {
//     try {
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(
//         VendoraContract.address,
//         VendoraContract.abi,
//         signer
//       );
//       const trades: string[] = await contract.getUsersActiveTrades(signer);

//       return trades;
//     } catch (error) {
//       console.error("Failed to get active trades", error);
//     }
//   }
//   return [];
// };

// const getAssetsInTradeTerms = async (tradeId: string): Promise<any> => {
//   if (metamaskExist()) {
//     try {
//       const contract = new ethers.Contract(
//         VendoraContract.address,
//         VendoraContract.abi,
//         provider
//       );
//       const result = await contract.getOfferedErc721s(tradeId);

//       result.forEach((item: Erc721Details) => {
//         const offered721s: Erc721Details[] = [
//           {
//             erc721Address: item.erc721Address,
//             tokenId: item.tokenId,
//           },
//         ];

//         console.log(
//           `Token Address: ${offered721s[0].erc721Address} Token Id: ${offered721s[0].tokenId}`
//         );
//       });
//     } catch (error) {
//       console.error("Failed to get assets in terms", error);
//     }
//   }
// };
// getAssetsInTradeTerms(
//   "0xe0e7c5faabf2fba21dd6b7b5f8d5c8464af5e90be8b8ae6ca78edd28f881d869"
// );

const getTradeId = async (): Promise<string> => {
  if (metamaskExist()) {
    try {
      const contract = new ethers.Contract(
        VendoraContract.address,
        VendoraContract.abi,
        provider
      );

      await contract.on("Terms_Set", (tradeId: ethers.BytesLike) => {
        const id: ethers.BytesLike = tradeId;
        return id;
        // console.log(id);
      });
    } catch (error) {
      console.error("Log trade id failed", error);
    }
  }
  return "";
};
