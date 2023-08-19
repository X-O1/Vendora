// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
