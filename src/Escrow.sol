// SPDX-License-Identifier: MIT

// CONTRACT OBJECTIVES:

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Escrow {
    /** CUSTOM ERRORS */
    error Not_Initiator();
    error Not_Terminator();
    error Not_Owner();

    struct Trade {
        bytes32 assetTicker;
        uint256 assetAmount;
    }
    /** STATE VARIABLES */
    address private immutable i_owner;

    address public s_initiator;
    address public s_terminator;

    Trade[] public s_assetsWanted;
    Trade[] public s_assetsGiving;

    bool private s_initiatorSet;
    bool private s_terminatorSet;

    mapping(bytes32 => address) public s_whitelistedTokens;
    mapping(address => mapping(bytes32 => uint256)) public s_accountBalances;

    /** EVENTS */
    event Initiator_Set(bool indexed set, address indexed initiatorsAddress);
    event s_TerminatorSet_Set(
        bool indexed set,
        address indexed terminatorsAddress
    );

    /** CONTRUCTOR */
    constructor(address payable intiator, address payable terminator) {
        s_initiatorSet = false;
        s_terminatorSet = false;
        i_owner = msg.sender;
        s_initiator = intiator;
        s_terminator = terminator;
    }

    /** MODIFIERS */
    modifier onlyInitiator() {
        if (msg.sender != s_initiator) {
            revert Not_Initiator();
        }
        _;
    }
    modifier onlyTerminator() {
        if (msg.sender != s_terminator) {
            revert Not_Terminator();
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

    // Set the Terminator
    function setTerminator() public {
        require(s_terminatorSet == false, "Terminator already set");

        s_terminator = msg.sender;
        s_terminatorSet = true;

        emit Initiator_Set(s_terminatorSet, s_terminator);
    }

    // Deposit ERC20 tokens

    function initiatorDepositERC20(
        uint256 amount,
        bytes32 symbol
    ) external onlyInitiator {
        for (uint256 i = 0; i < s_assetsGiving.length; i++) {}

        // Adding deposit amout to users account balance in protocol
        // Transfering amount from user to the contract
        s_accountBalances[msg.sender][symbol] += amount;
        ERC20(s_whitelistedTokens[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    function terminatorDepositERC20(
        uint256 amount,
        bytes32 symbol
    ) external onlyTerminator {
        // Adding deposit amout to users account balance in protocol
        // Transfering amount from user to the contract
        s_accountBalances[msg.sender][symbol] += amount;
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

    // Set trade terms of front end.
    function wantedAsset(
        bytes32 ticker,
        uint256 amount
    ) external onlyInitiator {
        s_assetsWanted.push(Trade(ticker, amount));
    }

    function givingAsset(
        bytes32 ticker,
        uint256 amount
    ) external onlyInitiator {
        s_assetsGiving.push(Trade(ticker, amount));
    }

    /** GET FUNCTIONS */
    function getWantedAssets() external view returns (Trade[] memory) {
        Trade[] memory assets;
        for (uint256 i = 0; i < s_assetsWanted.length; i++) {
            assets[i] = s_assetsWanted[i];
        }
        return assets;
    }
}
