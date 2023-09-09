const setTokenDetailsInLocalStorage = async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
const getTokenDetailsInLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};
const deleteStorageItem = (key) => {
    localStorage.removeItem(key);
};
const requestedErc721s = getTokenDetailsInLocalStorage("requestedErc721s") || [];
const requestedErc1155s = getTokenDetailsInLocalStorage("requestedErc1155s") || [];
const requestedErc20s = getTokenDetailsInLocalStorage("requestedErc20s") || [];
const requestedEth = getTokenDetailsInLocalStorage("requestedEth") || [];
const offeredErc721s = getTokenDetailsInLocalStorage("offeredErc721s") || [];
const offeredErc1155s = getTokenDetailsInLocalStorage("offeredErc1155s") || [];
const offeredErc20s = getTokenDetailsInLocalStorage("offeredErc20s") || [];
const offeredEth = getTokenDetailsInLocalStorage("offeredEth") || [];
export { setTokenDetailsInLocalStorage, getTokenDetailsInLocalStorage, deleteStorageItem, requestedErc721s, requestedErc1155s, requestedErc20s, requestedEth, offeredErc721s, offeredErc1155s, offeredErc20s, offeredEth, };
