const setLocalStorageItem = async (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getLocalStorageItem = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
const deleteStorageItem = (key) => {
  localStorage.removeItem(key);
};
const requestedErc721s = getLocalStorageItem("requestedErc721s") || [];
const requestedErc1155s = getLocalStorageItem("requestedErc1155s") || [];
const requestedErc20s = getLocalStorageItem("requestedErc20s") || [];
const requestedEth = getLocalStorageItem("requestedEth") || [];
const offeredErc721s = getLocalStorageItem("offeredErc721s") || [];
const offeredErc1155s = getLocalStorageItem("offeredErc1155s") || [];
const offeredErc20s = getLocalStorageItem("offeredErc20s") || [];
const offeredEth = getLocalStorageItem("offeredEth") || [];

export {
  setLocalStorageItem,
  getLocalStorageItem,
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
