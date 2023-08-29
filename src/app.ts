// import { createErc1155List, createErc20List, createErc721List } from "./DisplayTokenList.js";
// import { defaultErc1155s, defaultErc20s, defaultErc721s } from "./TokenList.js";

// type Erc721Details = {
//     imgSrc: string;
//     symbol: string;
//     tokenId: string;
//   };
//   type Erc1155Details = {
//     imgSrc: string;
//     symbol: string;
//     tokenId: string;
//     amount: string;
//   };
//   type Erc20Details = {
//     imgSrc: string;
//     symbol: string;
//     amount: string;
//   };

//   const wantedErc721s: Erc721Details[] = [];
//   const wantedErc1155s: Erc1155Details[] = [];
//   const wantedErc20s: Erc20Details[] = [];

//   document.addEventListener("DOMContentLoaded", async () => {
//     await createErc721List();
//     await createErc1155List();
//     await createErc20List();
//   });

//   // LOCAL STORAGE
//   const setItem = (
//     key: string,
//     value: Erc721Details[] | Erc1155Details[] | Erc20Details[]
//   ): void => {
//     const stringifiedValue = JSON.stringify(value);
//     localStorage.setItem(key, stringifiedValue);
//   };

//   const getItem = (
//     key: string
//   ): Erc721Details[] | Erc1155Details[] | Erc20Details[] | null => {
//     const stringifyValue = localStorage.getItem(key);
//     if (stringifyValue === null) return null;
//     return JSON.parse(stringifyValue) as
//       | Erc721Details[]
//       | Erc1155Details[]
//       | Erc20Details[];
//   };
