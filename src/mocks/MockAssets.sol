// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

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

contract MockResources1 is ERC1155 {
    constructor() ERC1155("MockResources1") {
        _mint(0x6CA6d1e2D5347Bfab1d91e883F1915560e09129D, 1, 10, "");
    }
}

contract MockResources2 is ERC1155 {
    constructor() ERC1155("MockResources2") {
        _mint(0x537C8f3d3E18dF5517a58B3fB9D9143697996802, 2, 10, "");
    }
}

contract MOCKLINK is ERC20 {
    constructor() ERC20("Mock LINK", "LINK") {
        _mint(0x6CA6d1e2D5347Bfab1d91e883F1915560e09129D, 1000000e18);
    }
}

contract MOCKAAVE is ERC20 {
    constructor() ERC20("Mock AAVE", "AAVE") {
        _mint(0x537C8f3d3E18dF5517a58B3fB9D9143697996802, 1000000e18);
    }
}
