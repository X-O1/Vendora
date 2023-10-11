type TokenOption = {
  logoURI?: string;
  tradeName?: string;
  symbol?: string;
  address: string;
  tokenId?: number;
  amount?: number;
};

/** Default tokens listed on the front-end */
const defaultErc721s: TokenOption[] = [
  {
    logoURI: "../public/images/erc721-project-images/rareshipLogo.png",
    tradeName: "Rareships",
    symbol: "RSHPS",
    address: "0x32ec5315E50654D330202A5ae24ee9B0f5C1E441",
  },
  {
    logoURI: "../public/images/erc721-project-images/msamaLogo.png",
    tradeName: "Moonsama",
    symbol: "MSAMA",
    address: "0x0A231Df9e3c7A0D5D0f843246C45F69a629C4bE3",
  },
];
const defaultErc1155s: TokenOption[] = [
  {
    logoURI: "../public/images/erc1155-project-images/bloodcrystal.png",
    tradeName: "Blood Crytals",
    symbol: "BLOOD",
    address: "0x76ba6821A834E2d30A699312829f8204830CCF5B",
  },
];
const defaultErc20s: TokenOption[] = [
  {
    logoURI: "../public/images/erc20-project-images/linktokenimage.png",
    tradeName: "Chainlink",
    symbol: "LINK",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  {
    logoURI: "../public/images/erc20-project-images/samaToken.png",
    tradeName: "Moonsama",
    symbol: "SAMA",
    address: "0xE04F47FF45576249bc5083DFDf987e03d0550113",
  },
];
const defaultNativeTokens: TokenOption[] = [
  {
    logoURI: "../public/images/native-tokens/ether.jpeg",
    tradeName: "Ethereum",
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
