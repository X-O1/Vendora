// SPDX-License-Identifier: MIT

// CONTRACT OBJECTIVES:

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Escrow {
    /** CUSTOM ERRORS */
    error Not_Initiator();
    error Not_Finalizer();
    error Not_Owner();

    /** STATE VARIABLES */
    address private immutable i_owner;

    address private s_initiator;
    address private s_finalizer;
    address private s_initiatorDeposit;
    address private s_finalizerDeposit;
    bool private s_initiatorSet;
    bool private s_finalizerSet;
    bool private s_termsSet;
    TradeState private s_tradeState;

    mapping(bytes32 => address) public s_whitelistedERC20;
    mapping(address => mapping(bytes32 => uint256))
        public s_initiatorAccountBalances;
    mapping(address => mapping(bytes32 => uint256))
        public s_finalizerAccountBalances;
    mapping(bytes32 => address) public s_givingERC20;
    mapping(bytes32 => uint256) public s_amountGivingERC20;
    mapping(bytes32 => address) public s_wantedERC20;
    mapping(bytes32 => uint256) public s_amountWantedERC20;

    /** EVENTS */
    event Initiator_Set(bool indexed set, address indexed initiatorsAddress);
    event Finalizer_Set(bool indexed set, address indexed finalizerAddress);

    enum TradeState {
        LIVE,
        CLOSED
    }

    /** CONTRUCTOR */
    constructor() {
        s_initiatorSet = false;
        s_finalizerSet = false;
        s_termsSet = false;
        s_tradeState = TradeState.CLOSED;
        i_owner = msg.sender;
    }

    /** MODIFIERS */
    modifier onlyInitiator() {
        if (msg.sender != s_initiator) {
            revert Not_Initiator();
        }
        _;
    }
    modifier onlyFinalizer() {
        if (msg.sender != s_finalizer) {
            revert Not_Finalizer();
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
    function whiteListERC20(
        bytes32 symbol,
        address tokenAddress
    ) external onlyOwner {
        s_whitelistedERC20[symbol] = tokenAddress;
    }

    // Set the Initiator
    function setInitiator() public {
        require(s_initiatorSet == false, "Initiator already set");
        require(s_finalizerSet == false, "Deal active");

        s_initiator = msg.sender;
        s_initiatorSet = true;

        emit Initiator_Set(s_initiatorSet, s_initiator);
    }

    // Set the Finalizer
    function setFinalizer() public {
        require(s_initiatorSet == true, "Initiator and terms are not set");
        require(s_finalizerSet == false, "Finalizer already set");

        s_finalizer = msg.sender;
        s_finalizerSet = true;

        emit Initiator_Set(s_finalizerSet, s_finalizer);
    }

    // Set trade terms.
    function addERC20Wanted(
        address tokenAddress,
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_initiatorSet == true, "Intitiator is not set");

        s_wantedERC20[symbol] = tokenAddress;
        s_amountWantedERC20[symbol] = amount;
    }

    function addERC20ToGive(
        address tokenAddress,
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_initiatorSet == true, "Intitiator is not set");

        s_givingERC20[symbol] = tokenAddress;
        s_amountGivingERC20[symbol] = amount;
    }

    // Finalize the terms

    // Initiator Deposit ERC20 tokens
    function initiatorDepositERC20(
        uint256 amount,
        bytes32 symbol
    ) external onlyInitiator {
        require(
            s_givingERC20[symbol] == s_whitelistedERC20[symbol],
            "Not agreed upon asset"
        );
        require(
            amount == s_amountGivingERC20[symbol],
            "Not agreed upon amount"
        );

        // Adding deposit amout to users account balance in protocol
        s_initiatorAccountBalances[s_initiatorDeposit][symbol] += amount;

        // Transfering amount from user to the contract
        ERC20(s_givingERC20[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    // Finalizer Deposit ERC20 tokens
    function finalizerDepositERC20(
        uint256 amount,
        bytes32 symbol
    ) external onlyInitiator {
        require(
            s_wantedERC20[symbol] == s_whitelistedERC20[symbol],
            "Not agreed upon asset"
        );
        require(
            amount == s_amountWantedERC20[symbol],
            "Not agreed upon amount"
        );

        // Adding deposit amout to users account balance in protocol
        s_finalizerAccountBalances[s_finalizerDeposit][symbol] += amount;

        // Transfering amount from user to the contract
        ERC20(s_wantedERC20[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    // Withdraw
    // function withdrawERC20Tokens(uint256 amount, bytes32 symbol) external {
    //     // Check if user is trying to withdraw more than they deposited.
    //     // Will change this to check if they are only withdrawing what the other user deposited and that they are the items in the terms of trade
    //     require(
    //         s_accountBalances[s_initiatorDeposit][symbol] >= amount,
    //         "Insufficent funds"
    //     );

    //     // Decrease the amount out of their account balance in protocol since they are withdrawing
    //     s_accountBalances[msg.sender][symbol] -= amount;

    //     // Transfer the tokens out
    //     ERC20(s_whitelistedTokens[symbol]).transfer(msg.sender, amount);
    // }

    /** GET FUNCTIONS */
}
