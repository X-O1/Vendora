const setTokenDetailsInLocalStorage = async (key, value) => {
    try {
        const finalValue = value.map((token) => (Object.assign(Object.assign({}, token), { amount: token.amount ? token.amount.toString() : undefined })));
        localStorage.setItem(key, JSON.stringify(finalValue));
    }
    catch (error) {
        console.error("Error setting token details in local storage", error);
    }
};
const getTokenDetailsInLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    if (!value)
        return null;
    try {
        const parsedValue = JSON.parse(value);
        return parsedValue.map((token) => (Object.assign(Object.assign({}, token), { amount: token.amount ? BigInt(token.amount) : undefined })));
    }
    catch (error) {
        console.error("Error getting token details from local storage", error);
        return null;
    }
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
const setUserProfileInLocalStorage = async (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error("Failed to set user profile in local storage", error);
    }
};
const getUserProfileFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};
export { setTokenDetailsInLocalStorage, getTokenDetailsInLocalStorage, setUserProfileInLocalStorage, getUserProfileFromLocalStorage, deleteStorageItem, requestedErc721s, requestedErc1155s, requestedErc20s, requestedEth, offeredErc721s, offeredErc1155s, offeredErc20s, offeredEth, };
