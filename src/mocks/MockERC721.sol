// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNft1 is ERC721 {
    constructor() ERC721("Mock1", "Mock1") {
        _safeMint(msg.sender, 1);
    }
}

contract MockNft2 is ERC721 {
    constructor() ERC721("Mock2", "Mock2") {
        _safeMint(msg.sender, 2);
    }
}

contract MockNft3 is ERC721 {
    constructor() ERC721("Mock3", "Mock3") {
        _safeMint(msg.sender, 3);
    }
}
