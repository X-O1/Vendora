// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Vendora} from "./Vendora.sol";

contract VendoraEscrow {
    Vendora vendora;

    /** CUSTOM ERRORS */
    error Not_Initiator();
    error Not_Finalizer();
    error Not_A_Party_Member();
    error Not_Owner();

    /** STATE VARIABLES */
    address private immutable i_owner;

    address private s_initiator;
    address private s_finalizer;
    bool private s_initiatorIsSet;
    bool private s_finalizerIsSet;
    bool private s_allInitiatorDepositsAreCompleted;
    bool private s_allFinalizerDepositsAreCompleted;
    bool private s_allDepositsAreCompleted;

    TradeState private s_tradeState;
    DepositState private s_depositState;
    WithdrawState private s_withdrawState;

    mapping(address => mapping(bytes32 => uint256)) public s_userERC20Balances;
    mapping(address => mapping(bytes32 => uint256)) public s_givingERC20Tokens;
    mapping(address => mapping(bytes32 => uint256)) public s_wantedERC20Tokens;

    /** CUSTOM TYPES */

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
        s_initiatorIsSet = false;
        s_finalizerIsSet = false;
        s_tradeState = TradeState.CLOSED;
        s_depositState = DepositState.CLOSED;
        s_withdrawState = WithdrawState.CLOSED;

        s_allFinalizerDepositsAreCompleted = false;
        s_allInitiatorDepositsAreCompleted = false;
        s_allDepositsAreCompleted = false;
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
    modifier onlyPartyMembers() {
        require(
            msg.sender == s_initiator || msg.sender == s_finalizer,
            "Function is only for members in the trade"
        );
        _;
    }

    /** FUNCTIONS */

    // SET THE INITIATOR
    function setInitiator() public {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(s_initiatorIsSet == false, "Initiator already set");
        require(s_finalizerIsSet == false, "Deal active");

        s_initiator = msg.sender;
        s_initiatorIsSet = true;

        emit Initiator_Set(s_initiatorIsSet, s_initiator);
    }

    // SET THE FINALIZER
    function setFinalizer() public {
        require(s_tradeState == TradeState.LIVE, "Trade is Closed");
        require(s_initiatorIsSet == true, "Initiator and terms are not set");
        require(s_finalizerIsSet == false, "Finalizer already set");

        s_finalizer = msg.sender;
        s_finalizerIsSet = true;

        emit Initiator_Set(s_finalizerIsSet, s_finalizer);
    }

    //  FINALIZER BACK OUT OF DEAL
    function resetFinalizer() public {}

    // FINALIZE TERMS AND OPEN DEPOSITS
    function finalizeTermsAndOpenDeposits() external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is not Live");
        require(s_depositState == DepositState.CLOSED, "Deposites are OPEN");
        require(s_initiatorIsSet == true, "Initiator not set");
        require(s_finalizerIsSet == false, "Finalizer not set");

        s_tradeState = TradeState.LIVE;
        s_depositState = DepositState.OPEN;

        emit Trade_State(s_tradeState);
        emit Deposit_State(s_depositState);
    }

    // ADD THE TOKENS WANTED IN TRADE
    function addWantedERC20Token(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_initiatorIsSet == true, "Intitiator is not set");

        s_wantedERC20Tokens[s_initiator][symbol] += amount;
    }

    // ADD THE TOKENS GIVING IN TRADE
    function addGivingERC20Token(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_initiatorIsSet == true, "Intitiator is not set");

        s_givingERC20Tokens[s_initiator][symbol] += amount;
    }

    // DELETE THE TOKENS WANTED IN TRADE
    function deleteWantedERC20Token(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_initiatorIsSet == true, "Intitiator is not set");
        require(
            s_wantedERC20Tokens[s_initiator][symbol] != 0,
            "Nothing to delete"
        );

        s_wantedERC20Tokens[s_initiator][symbol] -= amount;
    }

    // DELETE THE TOKENS GIVING IN TRADE
    function deleteGivingERC20Token(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_initiatorIsSet == true, "Intitiator is not set");
        require(
            s_givingERC20Tokens[s_initiator][symbol] != 0,
            "Nothing to delete"
        );

        s_givingERC20Tokens[s_initiator][symbol] -= amount;
    }

    // DEPOSIT ERC20 TOKENS (INITIATOR)
    function initiatorDepositERC20(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.LIVE, "Trade is not LIVE");
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_allInitiatorDepositsAreCompleted == false,
            "All Initiators deposits have been made"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant deposit while withdraws are open"
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Check allowances
        uint256 allowance = token.allowance(s_initiator, address(this));
        require(allowance >= amount, "Amount of tokens have not been approved");

        // Transfer tokens from user to contract
        require(
            token.transferFrom(s_initiator, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        s_userERC20Balances[s_initiator][symbol] += amount;

        // Check if all deposites are made by initiator
    }

    // DEPOSIT ERC20 TOKENS (FINALIZER)
    function finalizerDepositERC20(
        bytes32 symbol,
        uint256 amount
    ) external onlyFinalizer {
        require(s_tradeState == TradeState.LIVE, "Trade is not LIVE");
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_allFinalizerDepositsAreCompleted == false,
            "All Finalizer deposits have been made"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant deposit while withdraws are open"
        );
        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));
        // Check token allowances
        uint256 allowance = token.allowance(s_finalizer, address(this));
        require(allowance >= amount, "Amount of tokens have not been approved");

        // Transfering amount from user to the contract
        require(
            token.transferFrom(s_finalizer, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        s_userERC20Balances[s_finalizer][symbol] += amount;

        // Check if all deposites are made by finalizer
    }

    // OPEN WITHDRAWS
    function checkIfAllDepositsAreMadeAndOpenWithdrawls()
        internal
        returns (bool)
    {
        require(s_initiatorIsSet == true, "Initiator not set");
        require(s_finalizerIsSet == true, "Finalizer not set");
        require(s_withdrawState == WithdrawState.CLOSED, "Withdraws are OPEN");
        require(s_depositState == DepositState.OPEN, "Deposits are CLOSED");
        require(s_tradeState == TradeState.LIVE, "Trade is not Live");
        require(
            s_allInitiatorDepositsAreCompleted == true,
            "Waiting on Initiators deposits"
        );
        require(
            s_allFinalizerDepositsAreCompleted == true,
            "Waiting on Finalizers deposits"
        );

        s_depositState = DepositState.CLOSED;
        s_tradeState = TradeState.CLOSING;
        s_withdrawState = WithdrawState.OPEN;
        s_allDepositsAreCompleted = true;

        emit Withdraw_State(s_withdrawState);

        return s_allDepositsAreCompleted;
    }

    // CANCEL DEAL AND WITHDRAW BACK YOUR ASSETS
    function cancelDealAndWithdraw(
        bytes32 symbol,
        uint256 amount
    ) public onlyPartyMembers {
        require(s_depositState == DepositState.OPEN, "Deposits are CLOSED");
        require(s_withdrawState == WithdrawState.CLOSED, "Withdraws are OPEN");

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Check the user has enough in balance to withdraw
        require(
            s_userERC20Balances[msg.sender][symbol] >= amount,
            "Insufficient funds"
        );

        // Transfer tokens to user
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        // Update the user balance after withdraw
        s_userERC20Balances[msg.sender][symbol] -= amount;
    }

    // WITHDRAW
    function withdrawERC20Initiator(
        uint256 amount,
        bytes32 symbol
    ) external onlyInitiator {
        require(
            checkIfAllDepositsAreMadeAndOpenWithdrawls(),
            "All deposites have not been made"
        );
        require(
            s_withdrawState == WithdrawState.OPEN,
            "Withdraws are not OPEN"
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Check if user has enough tokens to withdraw
        require(
            s_userERC20Balances[s_finalizer][symbol] >= amount,
            "Insufficient funds"
        );

        // Transfer tokens to user
        require(token.transfer(s_initiator, amount), "Token transfer failed");

        // Update balances
        s_userERC20Balances[s_finalizer][symbol] -= amount;
    }

    function withdrawERC20Finalizer(
        bytes32 symbol,
        uint256 amount
    ) external onlyFinalizer {
        require(
            checkIfAllDepositsAreMadeAndOpenWithdrawls(),
            "All deposits have not been made"
        );
        require(s_withdrawState == WithdrawState.OPEN, "Withdraw are CLOSED");

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Check if user deposit balance is enough to cover withdraw
        require(
            s_userERC20Balances[s_initiator][symbol] >= amount,
            "Insufficient funds"
        );

        // Transfer tokens to user
        require(token.transfer(s_finalizer, amount), "Token transfer failed");

        // Updates balances
        s_userERC20Balances[s_initiator][symbol] -= amount;
    }

    /** GET FUNCTIONS*/
    function getInitiatorAddress() external view returns (address) {
        return s_initiator;
    }

    function getFinalizerAddress() external view returns (address) {
        return s_finalizer;
    }

    function getInitiatorIsSet() external view returns (bool) {
        return s_initiatorIsSet;
    }

    function getFinalizerIsSet() external view returns (bool) {
        return s_finalizerIsSet;
    }

    function getTradeState() external view returns (TradeState) {
        return s_tradeState;
    }

    function getDepositState() external view returns (DepositState) {
        return s_depositState;
    }

    function getWithdrawState() external view returns (WithdrawState) {
        return s_withdrawState;
    }

    function getAllDepositsAreCompleted() external view returns (bool) {
        return s_allDepositsAreCompleted;
    }

    function getAllInitiatorDepositsAreCompleted()
        external
        view
        returns (bool)
    {
        return s_allInitiatorDepositsAreCompleted;
    }

    function getAllFinalizerDepositsAreCompleted()
        external
        view
        returns (bool)
    {
        return s_allFinalizerDepositsAreCompleted;
    }
}
