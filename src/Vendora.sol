// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Escrow} from "./Escrow.sol";

contract Vendora {
    error Not_Owner();
    /** STATE VARIABLES */
    address private immutable i_owner;

    mapping(bytes32 => address) public s_whitelistedERC20;

    constructor() {
        i_owner = msg.sender;
    }

    /** MODIFIERS */
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Not_Owner();
        }
        _;
    }

    /** FUNCTIONS */

    // Whitelist new tokens
    function whitelistERC20(
        bytes32 symbol,
        address tokenAddress
    ) external onlyOwner {
        s_whitelistedERC20[symbol] = tokenAddress;
    }

    /** GET */
    function getWhitelistedERC20Tokens(
        bytes32 symbol
    ) external view returns (address) {
        return s_whitelistedERC20[symbol];
    }
}
