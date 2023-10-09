import { getTokenDetailsInLocalStorage } from "./LocalStorage";
const getErc721TransferDetails = async () => {
    try {
        const requestedErc721s = await getTokenDetailsInLocalStorage("requestedErc721s");
        const requestedInfo = [];
        requestedErc721s.forEach((token) => {
            requestedInfo.push({
                erc721Address: token.address,
                tokenId: token.tokenId,
            });
        });
        const offeredErc721s = await getTokenDetailsInLocalStorage("offeredErc721s");
        const offeredInfo = [];
        offeredErc721s.forEach((token) => {
            offeredInfo.push({
                erc721Address: token.address,
                tokenId: token.tokenId,
            });
        });
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Erc721 transfer info", error);
        return { requested: [], offered: [] };
    }
};
const getErc1155TransferDetails = async () => {
    try {
        const requestedErc1155s = await getTokenDetailsInLocalStorage("requestedErc1155s");
        const requestedInfo = [];
        requestedErc1155s.forEach((token) => {
            requestedInfo.push({
                erc1155Address: token.address,
                tokenId: token.tokenId,
                amount: token.amount,
            });
        });
        const offeredErc1155s = await getTokenDetailsInLocalStorage("offeredErc1155s");
        const offeredInfo = [];
        offeredErc1155s.forEach((token) => {
            offeredInfo.push({
                erc1155Address: token.address,
                tokenId: token.tokenId,
                amount: token.amount,
            });
        });
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Erc1155 transfer info", error);
        return { requested: [], offered: [] };
    }
};
const getErc20TransferDetails = async () => {
    try {
        const requestedErc20s = await getTokenDetailsInLocalStorage("requestedErc20s");
        const requestedInfo = [];
        requestedErc20s.forEach((token) => {
            requestedInfo.push({
                erc20Address: token.address,
                amount: token.amount,
            });
        });
        const offeredErc20s = await getTokenDetailsInLocalStorage("offeredErc20s");
        const offeredInfo = [];
        offeredErc20s.forEach((token) => {
            offeredInfo.push({
                erc20Address: token.address,
                amount: token.amount,
            });
        });
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Erc20 transfer info", error);
        return { requested: [], offered: [] };
    }
};
const getEthTransferDetails = async () => {
    try {
        const requestedEth = await getTokenDetailsInLocalStorage("requestedEth");
        const requestedInfo = requestedEth[0] && requestedEth[0].amount ? requestedEth[0].amount : 0;
        const offeredEth = await getTokenDetailsInLocalStorage("offeredEth");
        const offeredInfo = offeredEth[0] && offeredEth[0].amount ? offeredEth[0].amount : 0;
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Eth transfer info", error);
        return { requested: 0, offered: 0 };
    }
};
export { getErc721TransferDetails, getErc1155TransferDetails, getErc20TransferDetails, getEthTransferDetails, };
