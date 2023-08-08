// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract Vendora {
    error Not_Owner();
    /** STATE VARIABLES */
    address private immutable i_owner;

    mapping(address => bool) public s_whitelistedERC20;

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
    function whitelistERC20(address token) public onlyOwner {
        s_whitelistedERC20[token] = true;
    }

    function deleteWhitelistERC20(address token) public onlyOwner {
        s_whitelistedERC20[token] = false;
    }

    /** GET */
    function getWhitelistedERC20Tokens(
        address token
    ) public view returns (bool) {
        return s_whitelistedERC20[token];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
