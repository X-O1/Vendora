type Erc721Option = {
    imgSrc: string;
    name: string;
    symbol: string;
    address: string;
}
type Erc1155Option = {
    imgSrc: string;
    name: string;
    symbol: string;
    address: string;
}
type Erc20Option = {
    imgSrc: string;
    name: string;
    symbol: string;
    address: string;
}

const defaultErc721s: Erc721Option[] = [
    {
        imgSrc: "public/images/erc721-project-images/rareships.jpg",
        name: "Rareships",
        symbol: "RSHPS",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
    
];
const defaultErc1155s: Erc1155Option[] = [
    {
        imgSrc: "public/images/erc1155-project-images/bloodcrystal.png",
        name: "Blood Crytals",
        symbol: "BLOOD",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
const defaultErc20s: Erc20Option[] = [
    {
        imgSrc: "public/images/erc20-project-images/linktokenimage.png",
        name: "Chainlink",
        symbol: "LINK",
        address: "0xe170b5b0d507b3e0ce3d51c043175e0a39f78b9f"
    }
];
