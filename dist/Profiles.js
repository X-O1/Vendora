import { requestedErc721Details, requestedErc1155Details, requestedErc20Details, requestedEthDetails, offeredErc721Details, offeredErc1155Details, offeredErc20Details, offeredEthDetails, } from "./TermsAssetDetails";
const terms = {
    offeredErc721s: offeredErc721Details,
    requestedErc721s: requestedErc721Details,
    offeredErc1155s: offeredErc1155Details,
    requestedErc1155s: requestedErc1155Details,
    offeredErc20s: offeredErc20Details,
    requestedErc20s: requestedErc20Details,
    offeredEth: offeredEthDetails,
    requestedEth: requestedEthDetails,
};
class Profile {
    constructor(address) {
        this.address = address;
        this.trades = [];
    }
    getTrades() {
        try {
            return this.trades;
        }
        catch (error) {
            console.error("Failed to get user's trades", error);
            return [];
        }
    }
    addTrade(trade) {
        try {
            this.trades.push(trade);
        }
        catch (error) {
            console.error("Failed to add trade to user's trades", error);
        }
    }
}
export { terms, Profile };
