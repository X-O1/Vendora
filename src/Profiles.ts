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
  offeredEth: string;
  requestedEth: string;
};

class User {
  address: string;
  trades: Terms[];
  mapTradeId: Record<string, Terms>;
  mapTradeName: Record<string, Terms>;

  constructor(address: string) {
    this.address = address;
    this.trades = [];
    this.mapTradeId = {};
    this.mapTradeName = {};
  }

  addTrade = (tradeName: string, tradeId: string, tradeTerms: Terms): void => {
    try {
      if (this.mapTradeId[tradeId]) {
        console.log("This trade already exist");
        return;
      }
      this.mapTradeName[tradeName] = tradeTerms;
      this.mapTradeId[tradeId] = tradeTerms;
      this.trades.push(tradeTerms);
    } catch (error) {
      console.error("Failed to add trade to user profile", error);
    }
  };

  getTradeById(id: string): string | undefined {
    try {
      return this.mapTradeId[id].toString() || undefined;
    } catch (error) {
      console.error("Failed to get user trade terms", error);
      return;
    }
  }

  getTradeByName(name: string): string | undefined {
    try {
      return this.mapTradeName[name].toString() || undefined;
    } catch (error) {
      console.error("Failed to get user's trade by trade name", error);
      return;
    }
  }

  getAllTrades(): Terms[] | [] {
    try {
      return this.trades;
    } catch (error) {
      console.error("Failed to get all user's trades", error);
      return [];
    }
  }
}

// const user = new User("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

// user.addTrade(
//   "Trade 1",
//   "0xe0e7c5faabf2fba21dd6b7b5f8d5c8464af5e90be8b8ae6ca78edd28f881d869",
//   terms
// );
// console.log(user.getAllTrades()[0]);

// console.log(user.getAllTrades()[0]?.offeredErc721s[0]?.erc721Address);

export { User, terms };
