// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Vendora} from "./Vendora.sol";

contract Escrow {
    Vendora vendora;

    /** CUSTOM ERRORS */
    error Not_Initiator();
    error Not_Finalizer();
    error Not_Owner();

    /** STATE VARIABLES */
    address private immutable i_owner;

    address private s_initiator;
    address private s_finalizer;
    bool private s_initiatorSet;
    bool private s_finalizerSet;
    bool private s_initiatorDepositsCompleted;
    bool private s_finalizerDepositsCompleted;
    bool private s_allDepositsCompleted;

    TradeState private s_tradeState;
    DepositState private s_depositState;
    WithdrawState private s_withdrawState;

    mapping(address => TradeAssets[]) public s_deposits;
    mapping(address => TradeAssets[]) public s_wantedERC20;
    mapping(address => TradeAssets[]) public s_givingERC20;

    /** CUSTOM TYPES */
    struct TradeAssets {
        IERC20 token;
        uint256 amount;
    }

    /** EVENTS */
    event Initiator_Set(bool indexed set, address indexed initiatorsAddress);
    event Finalizer_Set(bool indexed set, address indexed finalizerAddress);
    event Trade_State(TradeState indexed tradeState);
    event Deposit_State(DepositState indexed depositState);
    event Withdraw_State(WithdrawState indexed withdrawState);
    event All_Initiator_Deposits_Are_In(bool indexed depositsAreIn);
    event All_Finalizer_Deposits_Are_In(bool indexed depositsAreIn);

    /** ENUMS */
    enum TradeState {
        LIVE,
        CLOSING,
        CLOSED
    }
    enum DepositState {
        OPEN,
        CLOSED
    }
    enum WithdrawState {
        OPEN,
        CLOSED
    }

    /** CONTRUCTOR */
    constructor() {
        s_initiatorSet = false;
        s_finalizerSet = false;
        s_tradeState = TradeState.CLOSED;
        s_depositState = DepositState.CLOSED;
        s_withdrawState = WithdrawState.CLOSED;

        s_finalizerDepositsCompleted = false;
        s_initiatorDepositsCompleted = false;
        s_allDepositsCompleted = false;
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

    // Set the Initiator // Starts the trade
    function setInitiator() public {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(s_initiatorSet == false, "Initiator already set");
        require(s_finalizerSet == false, "Deal active");

        s_initiator = msg.sender;
        s_initiatorSet = true;

        emit Initiator_Set(s_initiatorSet, s_initiator);
    }

    // Set the Finalizer
    function setFinalizer() public {
        require(s_tradeState == TradeState.LIVE, "Trade is Closed");
        require(s_initiatorSet == true, "Initiator and terms are not set");
        require(s_finalizerSet == false, "Finalizer already set");

        s_finalizer = msg.sender;
        s_finalizerSet = true;

        emit Initiator_Set(s_finalizerSet, s_finalizer);
    }

    // Set trade terms.
    function addERC20Wanted(
        IERC20 token,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(s_initiatorSet == true, "Intitiator is not set");

        TradeAssets memory newAsset = TradeAssets(token, amount);
        s_wantedERC20[msg.sender].push(newAsset);
    }

    function addERC20ToGive(
        IERC20 token,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(s_initiatorSet == true, "Intitiator is not set");

        TradeAssets memory newAsset = TradeAssets(token, amount);
        s_givingERC20[msg.sender].push(newAsset);
    }

    // Finalize and open the trade
    function finalizeTermsAndOpenDeposits() external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is not Live");
        require(s_depositState == DepositState.CLOSED, "Deposites are OPEN");
        require(s_initiatorSet == true, "Initiator not set");

        s_tradeState = TradeState.LIVE;
        s_depositState = DepositState.OPEN;

        emit Trade_State(s_tradeState);
        emit Deposit_State(s_depositState);
    }

    // Initiator Deposit ERC20 tokens
    function initiatorDepositERC20(
        IERC20 token,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.LIVE, "Trade is not LIVE");
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_initiatorDepositsCompleted == false,
            "All Initiators deposits have been made"
        );

        // Update deposit balances
        TradeAssets memory deposit = TradeAssets(token, amount);
        s_deposits[msg.sender].push(deposit);

        // Transfering amount from user to the contract
        token.transferFrom(msg.sender, address(this), amount);

        // Check if all deposites are made by initiator and Open the Trade
        for (uint256 i = 0; i < s_deposits[msg.sender].length; i++) {
            for (uint256 j = 0; j < s_givingERC20[msg.sender].length; j++) {
                if (
                    s_deposits[msg.sender][i].token ==
                    s_givingERC20[msg.sender][i].token &&
                    s_deposits[msg.sender][i].amount ==
                    s_givingERC20[msg.sender][i].amount
                ) {
                    s_initiatorDepositsCompleted = true;
                    emit All_Initiator_Deposits_Are_In(
                        s_initiatorDepositsCompleted
                    );
                    break;
                }
            }
            if (s_initiatorDepositsCompleted) {
                break;
            }
        }
    }

    // Finalizer Deposit ERC20 tokens
    function finalizerDepositERC20(
        IERC20 token,
        uint256 amount
    ) external onlyFinalizer {
        require(s_tradeState == TradeState.LIVE, "Trade is not LIVE");
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_finalizerDepositsCompleted == false,
            "All Finalizer deposits have been made"
        );

        // Update deposit balances
        TradeAssets memory deposit = TradeAssets(token, amount);
        s_deposits[msg.sender].push(deposit);

        // Transfering amount from user to the contract
        token.transferFrom(msg.sender, address(this), amount);

        // Check if all deposites are made by initiator and Open the Trade
        for (uint256 i = 0; i < s_deposits[msg.sender].length; i++) {
            for (uint256 j = 0; j < s_wantedERC20[msg.sender].length; j++) {
                if (
                    s_deposits[msg.sender][i].token ==
                    s_wantedERC20[msg.sender][i].token &&
                    s_deposits[msg.sender][i].amount ==
                    s_wantedERC20[msg.sender][i].amount
                ) {
                    s_finalizerDepositsCompleted = true;
                    emit All_Finalizer_Deposits_Are_In(
                        s_finalizerDepositsCompleted
                    );
                    break;
                }
            }
            if (s_finalizerDepositsCompleted) {
                break;
            }
        }
    }

    // Finalize and open the trade
    function checkIfAllDepositsAreMadeAndOpenWithdrawls()
        internal
        returns (bool)
    {
        require(s_withdrawState == WithdrawState.CLOSED, "Withdraws are OPEN");
        require(s_depositState == DepositState.OPEN, "Deposits are CLOSED");
        require(s_tradeState == TradeState.LIVE, "Trade is not Live");
        require(
            s_initiatorDepositsCompleted == true,
            "Waiting on Initiators deposits"
        );
        require(
            s_finalizerDepositsCompleted == true,
            "Waiting on Finalizers deposits"
        );

        s_depositState = DepositState.CLOSED;
        s_tradeState = TradeState.CLOSING;
        s_withdrawState = WithdrawState.OPEN;
        s_allDepositsCompleted = true;

        emit Withdraw_State(s_withdrawState);

        return s_allDepositsCompleted;
    }

    // Withdraw
    // function withdrawERC20Initiator(
    //     uint256 amount,
    //     bytes32 symbol
    // ) external onlyInitiator {
    //     // Check if user is trying to withdraw more than they deposited.
    //     // Will change this to check if they are only withdrawing what the other user deposited and that they are the items in the terms of trade
    //     require(
    //         s_finalizerAccountBalances[s_finalizerDeposit][symbol] >= amount,
    //         "Insufficent funds"
    //     );
    //     // require(s_wantedERC20[symbol] ==);

    //     // Decrease the amount out of their account balance in protocol since they are withdrawing
    //     s_finalizerAccountBalances[s_finalizerDeposit][symbol] -= amount;

    //     // check if balamces match aggreeed items
    //     for (uint256 i = 0; i < s_deposits[msg.sender].length; i++) {
    //         for (uint256 j = 0; j < s_givingERC20[msg.sender].length; j++) {
    //             if (
    //                 s_deposits[msg.sender][i].token ==
    //                 s_givingERC20[msg.sender][i].token &&
    //                 s_deposits[msg.sender][i].amount ==
    //                 s_givingERC20[msg.sender][i].amount
    //             ) {}
    //         }
    //     }
    //     // Transfer the tokens out
    //     ERC20(s_wantedERC20[symbol]).transfer(msg.sender, amount);
    // }

    /** GET FUNCTIONS */
}
