import { TokenOption } from "./DefaultTokens";
import { getTokenDetailsInLocalStorage } from "./LocalStorage";

type Erc721TransferDetails = {
  erc721Address: string;
  tokenId?: number;
};

type Erc1155TransferDetails = {
  erc1155Address: string;
  tokenId?: number;
  amount?: number;
};
type Erc20TransferDetails = {
  erc20Address: string;
  amount?: number;
};

const getErc721TransferDetails = async (): Promise<{
  requested: Erc721TransferDetails[];
  offered: Erc721TransferDetails[];
}> => {
  try {
    const requestedErc721s: TokenOption[] = await getTokenDetailsInLocalStorage(
      "requestedErc721s"
    );
    const requestedInfo: Erc721TransferDetails[] = [];
    requestedErc721s.forEach((token) => {
      requestedInfo.push({
        erc721Address: token.address,
        tokenId: token.tokenId,
      });
    });

    const offeredErc721s: TokenOption[] = await getTokenDetailsInLocalStorage(
      "offeredErc721s"
    );
    const offeredInfo: Erc721TransferDetails[] = [];
    offeredErc721s.forEach((token) => {
      offeredInfo.push({
        erc721Address: token.address,
        tokenId: token.tokenId,
      });
    });

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Erc721 transfer info", error);
    return { requested: [], offered: [] };
  }
};

const getErc1155TransferDetails = async (): Promise<{
  requested: Erc1155TransferDetails[];
  offered: Erc1155TransferDetails[];
}> => {
  try {
    const requestedErc1155s: TokenOption[] =
      await getTokenDetailsInLocalStorage("requestedErc1155s");

    const requestedInfo: Erc1155TransferDetails[] = [];
    requestedErc1155s.forEach((token) => {
      requestedInfo.push({
        erc1155Address: token.address,
        tokenId: token.tokenId,
        amount: token.amount,
      });
    });

    const offeredErc1155s: TokenOption[] = await getTokenDetailsInLocalStorage(
      "offeredErc1155s"
    );

    const offeredInfo: Erc1155TransferDetails[] = [];
    offeredErc1155s.forEach((token) => {
      offeredInfo.push({
        erc1155Address: token.address,
        tokenId: token.tokenId,
        amount: token.amount,
      });
    });

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Erc1155 transfer info", error);
    return { requested: [], offered: [] };
  }
};

const getErc20TransferDetails = async (): Promise<{
  requested: Erc20TransferDetails[];
  offered: Erc20TransferDetails[];
}> => {
  try {
    const requestedErc20s: TokenOption[] = await getTokenDetailsInLocalStorage(
      "requestedErc20s"
    );
    const requestedInfo: Erc20TransferDetails[] = [];
    requestedErc20s.forEach((token) => {
      requestedInfo.push({
        erc20Address: token.address,
        amount: token.amount,
      });
    });

    const offeredErc20s: TokenOption[] = await getTokenDetailsInLocalStorage(
      "offeredErc20s"
    );
    const offeredInfo: Erc20TransferDetails[] = [];
    offeredErc20s.forEach((token) => {
      offeredInfo.push({
        erc20Address: token.address,
        amount: token.amount,
      });
    });

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Erc20 transfer info", error);
    return { requested: [], offered: [] };
  }
};

const getEthTransferDetails = async (): Promise<{
  requested: number;
  offered: number;
}> => {
  try {
    const requestedEth: TokenOption[] = await getTokenDetailsInLocalStorage(
      "requestedEth"
    );
    const requestedInfo: number =
      requestedEth[0] && requestedEth[0].amount ? requestedEth[0].amount : 0;

    const offeredEth: TokenOption[] = await getTokenDetailsInLocalStorage(
      "offeredEth"
    );
    const offeredInfo: number =
      offeredEth[0] && offeredEth[0].amount ? offeredEth[0].amount : 0;

    return { requested: requestedInfo, offered: offeredInfo };
  } catch (error) {
    console.error("Failed to get Eth transfer info", error);
    return { requested: 0, offered: 0 };
  }
};

export {
  getErc721TransferDetails,
  getErc1155TransferDetails,
  getErc20TransferDetails,
  getEthTransferDetails,
  Erc721TransferDetails,
  Erc1155TransferDetails,
  Erc20TransferDetails,
};
