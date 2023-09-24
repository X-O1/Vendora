import { requestedErc721Details, requestedErc1155Details, requestedErc20Details, requestedEthDetails, offeredErc721Details, offeredErc1155Details, offeredErc20Details, offeredEthDetails, } from "./TermsAssetDetails";
const terms = {
    offeredErc721s: offeredErc721Details,
    requestedErc721s: requestedErc721Details,
    offeredErc1155s: offeredErc1155Details,
    requestedErc1155s: requestedErc1155Details,
    offeredErc20s: offeredErc20Details,
    requestedErc20s: requestedErc20Details,
    offeredEth: offeredEthDetails,
    requested: requestedEthDetails,
};
class User {
    constructor(address) {
        this.addTrade = (tradeName, tradeId, tradeTerms) => {
            try {
                if (this.mapTradeId[tradeId]) {
                    console.log("This trade already exist");
                    return;
                }
                this.mapTradeName[tradeName] = tradeTerms;
                this.mapTradeId[tradeId] = tradeTerms;
                this.trades.push(tradeTerms);
            }
            catch (error) {
                console.error("Failed to add trade to user profile", error);
            }
        };
        this.address = address;
        this.trades = [];
        this.mapTradeId = {};
        this.mapTradeName = {};
    }
    getTradeById(id) {
        try {
            return this.mapTradeId[id] || undefined;
        }
        catch (error) {
            console.error("Failed to get user trade terms", error);
            return;
        }
    }
    getTradeByName(name) {
        try {
            return this.mapTradeName[name] || undefined;
        }
        catch (error) {
            console.error("Failed to get user's trade by trade name", error);
            return;
        }
    }
    getAllTrades() {
        try {
            return this.trades;
        }
        catch (error) {
            console.error("Failed to get all user's trades", error);
            return [];
        }
    }
}
export { User, terms };
