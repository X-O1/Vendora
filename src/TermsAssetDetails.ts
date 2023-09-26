import {
  requestedErc721s,
  requestedErc1155s,
  requestedErc20s,
  requestedEth,
  offeredErc721s,
  offeredErc1155s,
  offeredErc20s,
  offeredEth,
} from "./LocalStorage";

type Erc721TransferDetails = {
  erc721Address: string;
  tokenId?: number;
};

type Erc1155TransferDetails = {
  erc1155Address: string;
  tokenId?: number;
  amount?: bigint;
};
type Erc20TransferDetails = {
  erc20Address: string;
  amount?: bigint;
};

const getErc721TransferDetails = (): {
  requested: Erc721TransferDetails[];
  offered: Erc721TransferDetails[];
} => {
  try {
    const requestedInfo: Erc721TransferDetails[] = [];
    requestedErc721s.forEach((token) => {
      requestedInfo.push({
        erc721Address: token.address,
        tokenId: token.tokenId ? token.tokenId : undefined,
      });
    });

    const offeredInfo: Erc721TransferDetails[] = [];
    offeredErc721s.forEach((token) => {
      offeredInfo.push({
        erc721Address: token.address,
        tokenId: token.tokenId ? token.tokenId : undefined,
      });
    });

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Erc721 transfer info", error);
    return { requested: [], offered: [] };
  }
};

const getErc1155TransferDetails = (): {
  requested: Erc1155TransferDetails[];
  offered: Erc1155TransferDetails[];
} => {
  try {
    const requestedInfo: Erc1155TransferDetails[] = [];
    requestedErc1155s.forEach((token) => {
      requestedInfo.push({
        erc1155Address: token.address,
        tokenId: token.tokenId ? token.tokenId : undefined,
        amount: token.amount ? token.amount : undefined,
      });
    });

    const offeredInfo: Erc1155TransferDetails[] = [];
    offeredErc1155s.forEach((token) => {
      offeredInfo.push({
        erc1155Address: token.address,
        tokenId: token.tokenId ? token.tokenId : undefined,
        amount: token.amount ? token.amount : undefined,
      });
    });

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Erc1155 transfer info", error);
    return { requested: [], offered: [] };
  }
};

const getErc20TransferDetails = (): {
  requested: Erc20TransferDetails[];
  offered: Erc20TransferDetails[];
} => {
  try {
    const requestedInfo: Erc20TransferDetails[] = [];
    requestedErc20s.forEach((token) => {
      requestedInfo.push({
        erc20Address: token.address,
        amount: token.amount ? BigInt(token.amount) : undefined,
      });
    });

    const offeredInfo: Erc20TransferDetails[] = [];
    offeredErc20s.forEach((token) => {
      offeredInfo.push({
        erc20Address: token.address,
        amount: token.amount ? BigInt(token.amount) : undefined,
      });
    });

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Erc20 transfer info", error);
    return { requested: [], offered: [] };
  }
};

const getEthTransferDetails = (): {
  requested: bigint;
  offered: bigint;
} => {
  try {
    const requestedInfo: bigint =
      requestedEth[0] && requestedEth[0].amount
        ? requestedEth[0].amount
        : BigInt("0");

    const offeredInfo: bigint =
      offeredEth[0] && offeredEth[0].amount
        ? offeredEth[0].amount
        : BigInt("0");

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Eth transfer info", error);
    return { requested: BigInt("0"), offered: BigInt("0") };
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

export {
  getErc721TransferDetails,
  getErc1155TransferDetails,
  getErc20TransferDetails,
  getEthTransferDetails,
  Erc721TransferDetails,
  Erc1155TransferDetails,
  Erc20TransferDetails,
  requestedErc721Details,
  requestedErc1155Details,
  requestedErc20Details,
  requestedEthDetails,
  offeredErc721Details,
  offeredErc1155Details,
  offeredErc20Details,
  offeredEthDetails,
};
