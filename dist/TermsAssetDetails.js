import { requestedErc721s, requestedErc1155s, requestedErc20s, requestedEth, offeredErc721s, offeredErc1155s, offeredErc20s, offeredEth, } from "./LocalStorage";
const getErc721TransferDetails = () => {
    try {
        const requestedInfo = [];
        requestedErc721s.forEach((token) => {
            requestedInfo.push({
                erc721Address: token.address,
                tokenId: token.tokenId ? token.tokenId : undefined,
            });
        });
        const offeredInfo = [];
        offeredErc721s.forEach((token) => {
            offeredInfo.push({
                erc721Address: token.address,
                tokenId: token.tokenId ? token.tokenId : undefined,
            });
        });
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Erc721 transfer info", error);
        return { requested: [], offered: [] };
    }
};
const getErc1155TransferDetails = () => {
    try {
        const requestedInfo = [];
        requestedErc1155s.forEach((token) => {
            requestedInfo.push({
                erc1155Address: token.address,
                tokenId: token.tokenId ? token.tokenId : undefined,
                amount: token.amount ? token.amount : undefined,
            });
        });
        const offeredInfo = [];
        offeredErc1155s.forEach((token) => {
            offeredInfo.push({
                erc1155Address: token.address,
                tokenId: token.tokenId ? token.tokenId : undefined,
                amount: token.amount ? token.amount : undefined,
            });
        });
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Erc1155 transfer info", error);
        return { requested: [], offered: [] };
    }
};
const getErc20TransferDetails = () => {
    try {
        const requestedInfo = [];
        requestedErc20s.forEach((token) => {
            requestedInfo.push({
                erc20Address: token.address,
                amount: token.amount ? token.amount : undefined,
            });
        });
        const offeredInfo = [];
        offeredErc20s.forEach((token) => {
            offeredInfo.push({
                erc20Address: token.address,
                amount: token.amount ? token.amount : undefined,
            });
        });
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Erc20 transfer info", error);
        return { requested: [], offered: [] };
    }
};
const getEthTransferDetails = () => {
    try {
        const requestedInfo = requestedEth[0] && requestedEth[0].amount ? requestedEth[0].amount : "0";
        const offeredInfo = offeredEth[0] && offeredEth[0].amount ? offeredEth[0].amount : "0";
        return { requested: requestedInfo, offered: offeredInfo };
    }
    catch (error) {
        console.error("Failed to get Eth transfer info", error);
        return { requested: "0", offered: "0" };
    }
};
const requestedErc721Details = getErc721TransferDetails().requested;
const requestedErc1155Details = getErc1155TransferDetails().requested;
const requestedErc20Details = getErc20TransferDetails().requested;
const requestedEthDetails = getEthTransferDetails().requested;
const offeredErc721Details = getErc721TransferDetails().offered;
const offeredErc1155Details = getErc1155TransferDetails().offered;
const offeredErc20Details = getErc20TransferDetails().offered;
const offeredEthDetails = getEthTransferDetails().offered;
export { getErc721TransferDetails, getErc1155TransferDetails, getErc20TransferDetails, getEthTransferDetails, requestedErc721Details, requestedErc1155Details, requestedErc20Details, requestedEthDetails, offeredErc721Details, offeredErc1155Details, offeredErc20Details, offeredEthDetails, };
