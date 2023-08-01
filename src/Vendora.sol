// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Escrow} from "./Escrow.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Vendora {
    error Not_Owner();
    /** STATE VARIABLES */
    address private immutable i_owner;

    mapping(bytes32 => IERC20) public s_whitelistedERC20;

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
    function whitelistERC20(bytes32 symbol, IERC20 token) external onlyOwner {
        s_whitelistedERC20[symbol] = token;
    }

    /** GET */
    function getWhitelistedERC20Tokens(
        bytes32 symbol
    ) external view returns (IERC20) {
        return s_whitelistedERC20[symbol];
    }
}
