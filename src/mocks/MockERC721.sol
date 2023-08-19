// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNft1 is ERC721 {
    constructor() ERC721("Mock1", "Mock1") {
        _safeMint(0x6CA6d1e2D5347Bfab1d91e883F1915560e09129D, 1);
    }
}

contract MockNft2 is ERC721 {
    constructor() ERC721("Mock2", "Mock2") {
        _safeMint(0x537C8f3d3E18dF5517a58B3fB9D9143697996802, 2);
    }
}
