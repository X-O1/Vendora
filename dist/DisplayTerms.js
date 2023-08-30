import { getItem, } from "./TokenMenu.js";
const wantedErc721sInTerms = getItem("wantedErc721s") || [];
for (let i = 0; i < wantedErc721sInTerms.length; i++) {
    console.log(wantedErc721sInTerms[i].symbol);
}
