// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockResources1 is ERC1155 {
    constructor() ERC1155("MockResources1") {
        _mint(msg.sender, 1, 10, "");
    }
}

contract MockResources2 is ERC1155 {
    constructor() ERC1155("MockResources2") {
        _mint(msg.sender, 1, 10, "");
    }
}

contract MockResources3 is ERC1155 {
    constructor() ERC1155("MockResources3") {
        _mint(msg.sender, 1, 10, "");
    }
}
