// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

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
