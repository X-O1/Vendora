type TokenOption = {
  logoURI?: string;
  name?: string;
  symbol: string;
  address?: string;
  tokenId?: string;
  amount?: string;
};
/** Default tokens listed on the front-end */
const defaultErc721s: TokenOption[] = [
  {
    logoURI: "./images/erc721-project-images/rareshipLogo.png",
    name: "Rareships",
    symbol: "RSHPS",
    address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f",
  },
  {
    logoURI: "./images/erc721-project-images/msamaLogo.png",
    name: "Moonsama",
    symbol: "MSAMA",
    address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f",
  },
];
const defaultErc1155s: TokenOption[] = [
  {
    logoURI: "./images/erc1155-project-images/bloodcrystal.png",
    name: "Blood Crytals",
    symbol: "BLOOD",
    address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f",
  },
];
const defaultErc20s: TokenOption[] = [
  {
    logoURI: "./images/erc20-project-images/linktokenimage.png",
    name: "Chainlink",
    symbol: "LINK",
    address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f",
  },
  {
    logoURI: "./images/erc20-project-images/samaToken.png",
    name: "Moonsama",
    symbol: "SAMA",
    address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f",
  },
];
const defaultNativeTokens: TokenOption[] = [
  {
    logoURI: "./images/native-tokens/ether.jpeg",
    name: "Ethereum",
    symbol: "ETH",
    address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f",
  },
];
export {
  defaultErc721s,
  defaultErc1155s,
  defaultErc20s,
  defaultNativeTokens,
  TokenOption,
};
