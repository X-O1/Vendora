// SPDX-License-Identifier: MIT

// CONTRACT OBJECTIVES:

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Escrow {
    /** CUSTOM ERRORS */
    error Not_Initiator();
    error Not_Owner();

    /** STATE VARIABLES */
    address private immutable i_owner;

    address private s_initiator;
    bool private s_initiatorSet;

    mapping(bytes32 => address) public s_whitelistedTokens;
    mapping(address => mapping(bytes32 => uint256)) public s_accountBalances;

    /** EVENTS */
    event Initiator_Set(bool indexed set, address indexed initiatorsAddress);

    /** CONTRUCTOR */
    constructor() {
        s_initiatorSet = false;
        i_owner = msg.sender;
    }

    /** MODIFIERS */
    modifier onlyInitiator() {
        if (msg.sender != s_initiator) {
            revert Not_Initiator();
        }
        _;
    }
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Not_Owner();
        }
        _;
    }

    /** FUNCTIONS */
    // Whitelist new tokens
    function whiteListToken(
        bytes32 symbol,
        address tokenAddress
    ) external onlyOwner {
        s_whitelistedTokens[symbol] = tokenAddress;
    }

    // Set the Initiator
    function setInitiator() public {
        require(s_initiatorSet == false, "Initiator already set");

        s_initiator = msg.sender;
        s_initiatorSet = true;

        emit Initiator_Set(s_initiatorSet, s_initiator);
    }

    // Deposit
    function depositERC20Tokens(uint256 amount, bytes32 symbol) external {
        // Adding deposit amout to users account balance in protocol
        s_accountBalances[msg.sender][symbol] += amount;
        // Transfering amount from user to the contract
        ERC20(s_whitelistedTokens[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    // Withdraw
    function withdrawERC20Tokens(uint256 amount, bytes32 symbol) external {
        // Check if user is trying to withdraw more than they deposited.
        // Will change this to check if they are only withdrawing what the other user deposited and that they are the items in the terms of trade
        require(
            s_accountBalances[msg.sender][symbol] >= amount,
            "Insufficent funds"
        );

        // Decrease the amount out of their account balance in protocol since they are withdrawing
        s_accountBalances[msg.sender][symbol] -= amount;

        // Transfer the tokens out
        ERC20(s_whitelistedTokens[symbol]).transfer(msg.sender, amount);
    }
}
