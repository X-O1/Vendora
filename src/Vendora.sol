// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

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

    // WHITELIST NEW SUPPORTED TOKENS
    function whitelistERC20(bytes32 symbol, address token) public onlyOwner {
        s_whitelistedERC20[symbol] = token;
    }

    /** GET */
    function getWhitelistedERC20Tokens(
        bytes32 symbol
    ) public view returns (address) {
        return s_whitelistedERC20[symbol];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
