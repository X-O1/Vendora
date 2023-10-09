import { TokenOption } from "./DefaultTokens";

const setTokenDetailsInLocalStorage = (key: string, value: TokenOption[]) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error setting token details in local storage", error);
  }
};

const getTokenDetailsInLocalStorage = async (
  key: string
): Promise<TokenOption[]> => {
  try {
    const storedValue = await JSON.parse(localStorage.getItem(key) || "[]");

    return storedValue;
  } catch (error) {
    console.error("Error getting token details from local storage", error);
    return [];
  }
};

const deleteStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};

const requestedErc721s: TokenOption[] = await getTokenDetailsInLocalStorage(
  "requestedErc721s"
);
const requestedErc1155s: TokenOption[] = await getTokenDetailsInLocalStorage(
  "requestedErc1155s"
);
const requestedErc20s: TokenOption[] = await getTokenDetailsInLocalStorage(
  "requestedErc20s"
);
const requestedEth: TokenOption[] = await getTokenDetailsInLocalStorage(
  "requestedEth"
);
const offeredErc721s: TokenOption[] = await getTokenDetailsInLocalStorage(
  "offeredErc721s"
);
const offeredErc1155s: TokenOption[] = await getTokenDetailsInLocalStorage(
  "offeredErc1155s"
);
const offeredErc20s: TokenOption[] = await getTokenDetailsInLocalStorage(
  "offeredErc20s"
);
const offeredEth: TokenOption[] = await getTokenDetailsInLocalStorage(
  "offeredEth"
);

export {
  setTokenDetailsInLocalStorage,
  getTokenDetailsInLocalStorage,
  deleteStorageItem,
  requestedErc721s,
  requestedErc1155s,
  requestedErc20s,
  requestedEth,
  offeredErc721s,
  offeredErc1155s,
  offeredErc20s,
  offeredEth,
};
