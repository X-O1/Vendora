import {
  Erc1155Details,
  Erc20Details,
  Erc721Details,
  getItem,
} from "./TokenMenu.js";

const wantedErc721sInTerms:
  | Erc721Details[]
  | Erc1155Details[]
  | Erc20Details[]
  | null = getItem("wantedErc721s") || [];

const wantedErc1155sInTerms:
  | Erc721Details[]
  | Erc1155Details[]
  | Erc20Details[]
  | null = getItem("wantedErc1155s") || [];

const wantedErc20sInTerms:
  | Erc721Details[]
  | Erc1155Details[]
  | Erc20Details[]
  | null = getItem("wantedErc20s") || [];
