import { TokenOption } from "./DefaultTokens";
import { User } from "./Profiles";

const setTokenDetailsInLocalStorage = async (
  key: string,
  value: TokenOption[]
) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getTokenDetailsInLocalStorage = (key: string): TokenOption[] | null => {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as TokenOption[]) : null;
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

const setUserProfileInLocalStorage = (key: string, value: User) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to set user profile in local storage", error);
  }
};
const getUserProfileFromLocalStorage = (key: string): User[] | null => {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as User[]) : null;
};

const accounts: User[] = getUserProfileFromLocalStorage("profile") || [];

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
  accounts,
};
