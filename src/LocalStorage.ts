import { TokenOption } from "./DefaultTokens";
import { Profile } from "./Profiles";

const setTokenDetailsInLocalStorage = async (
  key: string,
  value: TokenOption[]
) => {
  try {
    const finalValue = value.map((token) => ({
      ...token,
      amount: token.amount ? token.amount.toString() : undefined,
    }));
    localStorage.setItem(key, JSON.stringify(finalValue));
  } catch (error) {
    console.error("Error setting token details in local storage", error);
  }
};

const getTokenDetailsInLocalStorage = (key: string): TokenOption[] | null => {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    const parsedValue: TokenOption[] = JSON.parse(value);

    return parsedValue.map((token) => ({
      ...token,
      amount: token.amount ? BigInt(token.amount) : undefined,
    }));
  } catch (error) {
    console.error("Error getting token details from local storage", error);
    return null;
  }
};

const deleteStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};

const requestedErc721s: TokenOption[] =
  getTokenDetailsInLocalStorage("requestedErc721s") || [];
const requestedErc1155s: TokenOption[] =
  getTokenDetailsInLocalStorage("requestedErc1155s") || [];
const requestedErc20s: TokenOption[] =
  getTokenDetailsInLocalStorage("requestedErc20s") || [];
const requestedEth: TokenOption[] =
  getTokenDetailsInLocalStorage("requestedEth") || [];
const offeredErc721s: TokenOption[] =
  getTokenDetailsInLocalStorage("offeredErc721s") || [];
const offeredErc1155s: TokenOption[] =
  getTokenDetailsInLocalStorage("offeredErc1155s") || [];
const offeredErc20s: TokenOption[] =
  getTokenDetailsInLocalStorage("offeredErc20s") || [];
const offeredEth: TokenOption[] =
  getTokenDetailsInLocalStorage("offeredEth") || [];

const setUserProfileInLocalStorage = async (key: string, value: Profile) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to set user profile in local storage", error);
  }
};
const getUserProfileFromLocalStorage = (key: string): Profile | null => {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as Profile) : null;
};

export {
  setTokenDetailsInLocalStorage,
  getTokenDetailsInLocalStorage,
  setUserProfileInLocalStorage,
  getUserProfileFromLocalStorage,
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
