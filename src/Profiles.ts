import {
  Erc1155TransferDetails,
  Erc20TransferDetails,
  Erc721TransferDetails,
} from "./TermsAssetDetails";

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

const terms: Terms = {
  offeredErc721s: offeredErc721Details,
  requestedErc721s: requestedErc721Details,
  offeredErc1155s: offeredErc1155Details,
  requestedErc1155s: requestedErc1155Details,
  offeredErc20s: offeredErc20Details,
  requestedErc20s: requestedErc20Details,
  offeredEth: offeredEthDetails,
  requestedEth: requestedEthDetails,
};
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

class Profile {
  address: string;
  trades: Terms[];

  constructor(address: string) {
    this.address = address;
    this.trades = [];
  }

  getTrades(): Terms[] {
    try {
      return this.trades;
    } catch (error) {
      console.error("Failed to get user's trades", error);
      return [];
    }
  }

  addTrade(trade: Terms) {
    try {
      this.trades.push(trade);
    } catch (error) {
      console.error("Failed to add trade to user's trades", error);
    }
  }
}

export { terms, Profile, Terms };
