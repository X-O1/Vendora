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

    mapping(address => TradeAssetsERC20[]) public s_depositsERC20;
    mapping(address => TradeAssetsERC20[]) public s_wantedERC20;
    mapping(address => TradeAssetsERC20[]) public s_givingERC20;

    /** CUSTOM TYPES */
    struct TradeAssetsERC20 {
        bytes32 symbol;
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

    // CHOOSE THE TOKENS WANTED IN TRADE
    function addERC20Wanted(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(s_initiatorIsSet == true, "Intitiator is not set");

        TradeAssetsERC20 memory newAsset = TradeAssetsERC20(symbol, amount);
        s_wantedERC20[msg.sender].push(newAsset);
    }

    // CHOOSE THE TOKENS GIVING IN TRADE
    function addERC20ToGive(
        bytes32 symbol,
        uint256 amount
    ) external onlyInitiator {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(s_initiatorIsSet == true, "Intitiator is not set");

        TradeAssetsERC20 memory newAsset = TradeAssetsERC20(symbol, amount);
        s_givingERC20[msg.sender].push(newAsset);
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
        TradeAssetsERC20 memory deposit = TradeAssetsERC20(symbol, amount);
        s_depositsERC20[s_initiator].push(deposit);

        // Check if all deposites are made by initiator
        uint256 depositLength = s_depositsERC20[s_initiator].length;
        uint256 givingLength = s_givingERC20[s_initiator].length;

        if (depositLength != givingLength) return;
        for (uint256 i = 0; i < depositLength; i++) {
            if (
                s_depositsERC20[s_initiator][i].symbol ==
                s_givingERC20[s_initiator][i].symbol &&
                s_depositsERC20[s_initiator][i].amount ==
                s_givingERC20[s_initiator][i].amount
            ) {
                s_allInitiatorDepositsAreCompleted = true;
                emit All_Initiator_Deposits_Are_In(
                    s_allInitiatorDepositsAreCompleted
                );
                break;
            }
        }
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
        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Check token allowances
        uint256 allowances = token.allowance(s_finalizer, address(this));
        require(
            allowances >= amount,
            "Amount of tokens have not been approved"
        );

        // Transfering amount from user to the contract
        require(
            token.transferFrom(s_finalizer, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        TradeAssetsERC20 memory deposit = TradeAssetsERC20(symbol, amount);
        s_depositsERC20[s_finalizer].push(deposit);

        // Check if all deposites are made by finalizer
        uint256 depositLength = s_depositsERC20[s_finalizer].length;
        uint256 wantedLength = s_wantedERC20[s_initiator].length;

        if (depositLength != wantedLength) return;
        for (uint256 i = 0; i < depositLength; i++) {
            if (
                s_depositsERC20[s_finalizer][i].symbol ==
                s_wantedERC20[s_initiator][i].symbol &&
                s_depositsERC20[s_finalizer][i].amount ==
                s_wantedERC20[s_initiator][i].amount
            ) {
                s_allFinalizerDepositsAreCompleted = true;
                emit All_Finalizer_Deposits_Are_In(
                    s_allFinalizerDepositsAreCompleted
                );
                break;
            }
        }
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

        for (uint256 i = 0; i < s_depositsERC20[msg.sender].length; i++) {
            if (s_depositsERC20[msg.sender][i].symbol == symbol) {
                // Check the user has enough in balance to withdraw
                require(
                    s_depositsERC20[msg.sender][i].amount >= amount,
                    "Insufficient funds"
                );
                // Transfer tokens to user
                require(
                    token.transfer(msg.sender, amount),
                    "Token transfer failed"
                );
                // Update the user balance after withdraw
                s_depositsERC20[msg.sender][i].amount -= amount;

                if (s_depositsERC20[msg.sender][i].amount == 0) {
                    break;
                }
            }
        }
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

        for (uint256 i = 0; i < s_depositsERC20[s_finalizer].length; i++) {
            if (s_depositsERC20[s_finalizer][i].symbol == symbol) {
                // Check if user has enough tokens to withdraw
                require(
                    s_depositsERC20[s_finalizer][i].amount >= amount,
                    "Insufficient funds"
                );
                // Transfer token to user
                require(token.transfer(s_initiator, amount), "Transfer failed");
                // Update balances
                s_depositsERC20[s_finalizer][i].amount -= amount;
                break;
            }
        }
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

        for (uint256 i = 0; i < s_depositsERC20[s_initiator].length; i++) {
            if (s_depositsERC20[s_initiator][i].symbol == symbol) {
                // Check if there enough in balances to withdraw
                require(
                    s_depositsERC20[s_initiator][i].amount >= amount,
                    "Insufficient funds"
                );
                // Transfer token to user
                require(token.transfer(s_finalizer, amount), "Transfer failed");
                // Updates balances
                s_depositsERC20[s_initiator][i].amount -= amount;
                break;
            }
        }
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

    function getUserERC20Deposits(
        address user
    ) external view returns (TradeAssetsERC20[] memory) {
        return s_depositsERC20[user];
    }

    function getWantedERC20Tokens(
        address user
    ) external view returns (TradeAssetsERC20[] memory) {
        return s_wantedERC20[user];
    }

    function getGivingERC20Tokens(
        address user
    ) external view returns (TradeAssetsERC20[] memory) {
        return s_givingERC20[user];
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
