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
    error Not_Seller();
    error Not_Buyer();
    error Not_A_Party_Member();
    error Not_Owner();

    /** STATE VARIABLES */
    address private immutable i_owner;
    address private immutable i_buyerPlaceHolder;

    address private s_seller;
    address private s_buyer;
    bool private s_sellerIsSet;
    bool private s_buyerIsSet;
    uint256 private s_numOfAssetsRequested;
    uint256 private s_numOfAssetsOffered;
    uint256 private s_numOfAssetsInTradeTerms;
    bool private s_allDepositsAreCompleted;
    uint256 private s_numOfAssetsDeposited;
    uint256 private s_numOfBuyerDeposits;

    TradeState private s_tradeState;
    DepositState private s_depositState;
    WithdrawState private s_withdrawState;

    /** MAPPINGS */
    mapping(address => mapping(bytes32 => uint256)) public s_userBalanceERC20;
    mapping(address => mapping(bytes32 => uint256)) public s_offeredERC20;
    mapping(address => mapping(bytes32 => uint256)) public s_requestedERC20;

    /** EVENTS */
    event Seller_Set(bool indexed set, address indexed sellerAddress);
    event Buyer_Set(bool indexed set, address indexed buyerAddress);
    event Trade_State(TradeState indexed tradeState);
    event Deposit_State(DepositState indexed depositState);
    event Withdraw_State(WithdrawState indexed withdrawState);
    event Deposit_Terms_Met(bool indexed depositTermsMet);
    event Buyer_Changed(address indexed buyerAddress);

    /** ENUMS */
    enum TradeState {
        CLOSED,
        OPEN,
        CLOSING,
        COMPLETED
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
        s_sellerIsSet = false;
        s_buyerIsSet = false;
        s_tradeState = TradeState.CLOSED;
        s_depositState = DepositState.CLOSED;
        s_withdrawState = WithdrawState.CLOSED;
        s_numOfAssetsRequested = 0;
        s_numOfAssetsOffered = 0;
        s_numOfAssetsInTradeTerms =
            s_numOfAssetsRequested +
            s_numOfAssetsOffered;
        s_numOfAssetsDeposited = 0;
        s_numOfBuyerDeposits = 0;
        s_allDepositsAreCompleted = false;

        i_owner = msg.sender;
        i_buyerPlaceHolder = address(0);
    }

    /** MODIFIERS */
    modifier onlySeller() {
        if (msg.sender != s_seller) {
            revert Not_Seller();
        }
        _;
    }
    modifier onlyBuyer() {
        if (msg.sender != s_buyer) {
            revert Not_Buyer();
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
            msg.sender == s_seller || msg.sender == s_buyer,
            "Function is only for members in the trade"
        );
        _;
    }

    /** ESCROW */

    // SET SELLER
    function setSeller() public {
        require(
            s_tradeState == TradeState.CLOSED,
            "Can't set Seller while trade is live"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Can't set Seller while deposits are open"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Can't set Seller while withdrawls are open"
        );
        require(s_sellerIsSet == false, "Seller already set");
        require(s_buyerIsSet == false, "Seller already set");

        s_seller = msg.sender;
        s_sellerIsSet = true;

        emit Seller_Set(s_sellerIsSet, s_seller);
    }

    // ADD ERC20 REQUEST TO TRADE TERMS
    function requestERC20(bytes32 symbol, uint256 amount) external onlySeller {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_sellerIsSet == true, "Seller is not set");
        require(
            s_buyerIsSet == false,
            "Can not add assets to terms after buyer is set"
        );

        s_requestedERC20[s_buyer][symbol] += amount;

        s_numOfAssetsRequested++;
    }

    // DELETE ERC20 REQUEST IN TRADE TERMS
    function deleteRequestedERC20(
        bytes32 symbol,
        uint256 amount
    ) public onlySeller {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_sellerIsSet == true, "Seller is not set");
        require(
            s_buyerIsSet == false,
            "Can not add assets to terms after buyer is set"
        );
        require(s_requestedERC20[s_seller][symbol] != 0, "Nothing to delete");

        s_requestedERC20[s_seller][symbol] -= amount;

        s_numOfAssetsRequested--;
    }

    // ADD ERC20 OFFER TO TRADE TERMS
    function offerERC20(bytes32 symbol, uint256 amount) external onlySeller {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_sellerIsSet == true, "Seller is not set");
        require(
            s_buyerIsSet == false,
            "Can not add assets to terms after buyer is set"
        );

        s_offeredERC20[s_seller][symbol] += amount;

        s_numOfAssetsRequested++;
    }

    // DELETE ERC20 OFFER IN TRADE TERMS
    function deleteOfferedERC20(
        bytes32 symbol,
        uint256 amount
    ) public onlySeller {
        require(s_tradeState == TradeState.CLOSED, "Trade is Live");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant add token to trade terms afer withdraws are open"
        );
        require(
            s_depositState == DepositState.CLOSED,
            "Cant add token to trade terms afer deposits are open"
        );
        require(s_sellerIsSet == true, "Seller is not set");
        require(
            s_buyerIsSet == false,
            "Can not add assets to terms after buyer is set"
        );

        require(s_offeredERC20[s_seller][symbol] != 0, "Nothing to delete");

        s_offeredERC20[s_seller][symbol] -= amount;

        s_numOfAssetsRequested--;
    }

    // FINALIZE TERMS AND OPEN DEPOSITS
    function finalizeTermsAndOpenDeposits() external onlySeller {
        require(s_tradeState == TradeState.CLOSED, "Trade is not Live");
        require(s_depositState == DepositState.CLOSED, "Deposites are OPEN");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Can't finalized terms while withdrawls are open"
        );
        require(s_sellerIsSet == true, "Seller not set");
        require(
            s_buyerIsSet == false,
            "Cant finalized terms and open deposits if there's already a buyer set"
        );

        s_tradeState = TradeState.OPEN;
        s_depositState = DepositState.OPEN;

        emit Trade_State(s_tradeState);
        emit Deposit_State(s_depositState);
    }

    // CLOSE DEPOSITS AND CHANGE TERMS OF TRADE AFTER THEY'VE BEEN FINALIZED
    function changeTermsAndCloseDeposits() public onlySeller {
        require(
            s_buyerIsSet == false,
            "Can only change terms after they have been set if there is no buyer set"
        );
        require(
            s_numOfAssetsDeposited == 0,
            "Can not change terms after assets have been deposited. Withdraw all assets to change terms."
        );
        require(
            s_tradeState == TradeState.OPEN,
            "This function is for changing terms after terms are set and trade is open. The trade is not currently open"
        );
        require(
            s_depositState == DepositState.OPEN,
            "This function is for changing terms after terms are set and deposits are open. Deposits are not currently open"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Can not change terms after withdrawls are open"
        );

        s_tradeState = TradeState.CLOSED;
        s_depositState = DepositState.CLOSED;
    }

    // SET BUYER
    function setBuyer() public {
        require(s_tradeState == TradeState.OPEN, "Trade is Closed");
        require(s_depositState == DepositState.OPEN, "Deposites are OPEN");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Can't finalized terms while withdrawls are open"
        );
        require(s_sellerIsSet == true, "Seller and terms are not set");
        require(s_buyerIsSet == false, "Buyer already set");
        require(
            s_numOfBuyerDeposits == 0,
            "Buyer has deposits still in trade that need to be withdrawn before role transfer"
        );

        s_buyer = msg.sender;
        s_buyerIsSet = true;

        emit Seller_Set(s_buyerIsSet, s_buyer);
    }

    // BUYER LEAVES TRADE
    function leaveTradeBuyer() public onlyBuyer {
        require(s_tradeState == TradeState.OPEN, "Trade is Closed");
        require(s_depositState == DepositState.OPEN, "Deposites are OPEN");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Can't reset buyer while withdrawls are open"
        );
        require(s_sellerIsSet == true, "Seller and terms are not set");
        require(s_buyerIsSet == true, "Buyer is not set");
        require(
            s_numOfBuyerDeposits == 0,
            "Buyer has deposits still in trade that need to be withdrawn before role transfer"
        );

        // Reset Buyer's address and state
        s_buyer = i_buyerPlaceHolder;
        s_buyerIsSet = false;

        emit Buyer_Changed(s_buyer);
    }

    // DEPOSIT ERC20 TOKENS (SELLER)
    function depositERC20Seller(
        bytes32 symbol,
        uint256 amount
    ) public onlySeller {
        require(s_tradeState == TradeState.OPEN, "Trade is not LIVE");
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_allDepositsAreCompleted == false,
            "All agreed upon deposits have been made"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant deposit while withdraws are open"
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Check allowances
        uint256 allowance = token.allowance(s_seller, address(this));
        require(allowance >= amount, "Amount of tokens have not been approved");

        // Transfer tokens from seller to escrow contract
        require(
            token.transferFrom(s_seller, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        s_userBalanceERC20[s_seller][symbol] += amount;

        // Check if seller made all deposits offered in trade terms
        if (
            s_userBalanceERC20[s_seller][symbol] ==
            s_offeredERC20[s_seller][symbol]
        ) {
            s_numOfAssetsDeposited++;
        }
        if (s_numOfAssetsInTradeTerms == s_numOfAssetsDeposited) {
            s_allDepositsAreCompleted = true;
            emit Deposit_Terms_Met(s_allDepositsAreCompleted);
        } else {
            s_allDepositsAreCompleted = false;
        }
    }

    // DEPOSIT ERC20 TOKENS (BUYER)
    function depositERC20Buyer(
        bytes32 symbol,
        uint256 amount
    ) public onlyBuyer {
        require(s_tradeState == TradeState.OPEN, "Trade is not LIVE");
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_allDepositsAreCompleted == false,
            "All agreed upon deposits have been made"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant deposit while withdraws are open"
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));
        // Check token allowances
        uint256 allowance = token.allowance(s_buyer, address(this));
        require(allowance >= amount, "Amount of tokens have not been approved");

        // Transfer amount from buyer to the escrow contract
        require(
            token.transferFrom(s_buyer, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        s_userBalanceERC20[s_buyer][symbol] += amount;

        // Check if buyer made all deposits requested in trade terms
        if (
            s_userBalanceERC20[s_buyer][symbol] ==
            s_requestedERC20[s_seller][symbol]
        ) {
            s_numOfAssetsDeposited++;
            s_numOfBuyerDeposits++;
        }
        if (s_numOfAssetsInTradeTerms == s_numOfAssetsDeposited) {
            s_allDepositsAreCompleted = true;
            emit Deposit_Terms_Met(s_allDepositsAreCompleted);
        } else {
            s_allDepositsAreCompleted = false;
        }
    }

    // WITHDRAW YOUR OWN ASSETS BEFORE TERMS ARE MET (SELLER)
    function withdrawBeforeTermsAreMetSeller(
        bytes32 symbol,
        uint256 amount
    ) public onlySeller {
        require(
            s_tradeState == TradeState.OPEN,
            "Can not cancel and withdraw at this stage of deal"
        );
        require(
            s_depositState == DepositState.OPEN,
            "Deposits are CLOSED. Can not cancel and withdraw at this stage of deal"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Withdraws are OPEN, Can not cancel and withdraw at this stage of deal"
        );
        // Check the user has enough in balance to withdraw
        require(
            s_userBalanceERC20[s_seller][symbol] >= amount,
            "Insufficient funds"
        );
        require(
            s_allDepositsAreCompleted == false,
            "Terms have been met and can no longer withdraw these assets"
        );

        // Make sure user withdraws thier own asset
        bool s_otherUserOwnsThisAsset;
        if (s_userBalanceERC20[s_buyer][symbol] > 0) {
            s_otherUserOwnsThisAsset = true;
        } else {
            s_otherUserOwnsThisAsset = false;
        }
        require(
            s_otherUserOwnsThisAsset == false,
            "Can not withdraw other party's assets"
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Transfer tokens to user
        require(token.transfer(s_seller, amount), "Token transfer failed");

        // Update the user balance after withdraw
        s_userBalanceERC20[s_seller][symbol] -= amount;

        // Check if all Deposits completed
        if (s_numOfAssetsDeposited != 0) {
            if (
                s_userBalanceERC20[s_seller][symbol] !=
                s_offeredERC20[s_seller][symbol]
            ) {
                s_numOfAssetsDeposited--;
            }
            if (s_numOfAssetsDeposited == s_numOfAssetsInTradeTerms) {
                s_allDepositsAreCompleted = true;
            } else {
                s_allDepositsAreCompleted = false;
            }
        }
    }

    // WITHDRAW YOUR OWN ASSETS BEFORE TERMS ARE MET (BUYER)
    function withdrawBeforeTermsAreMetBuyer(
        bytes32 symbol,
        uint256 amount
    ) public onlyBuyer {
        require(
            s_tradeState == TradeState.OPEN,
            "Can not cancel and withdraw at this stage of deal"
        );
        require(
            s_depositState == DepositState.OPEN,
            "Deposits are CLOSED. Can not cancel and withdraw at this stage of deal"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Withdraws are OPEN, Can not cancel and withdraw at this stage of deal"
        );
        require(
            s_allDepositsAreCompleted == false,
            "Terms have been met and can no longer withdraw these assets"
        );

        // Make sure user withdraws thier own assets
        bool s_userOwnsThisAsset;
        if (s_userBalanceERC20[s_seller][symbol] > 0) {
            s_userOwnsThisAsset = true;
        } else {
            s_userOwnsThisAsset = false;
        }
        require(
            s_userOwnsThisAsset == false,
            "Can not withdraw other party's assets"
        );

        // Check the user has enough in balance to withdraw
        require(
            s_userBalanceERC20[s_buyer][symbol] >= amount,
            "Insufficient funds"
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Transfer tokens to user
        require(token.transfer(s_buyer, amount), "Token transfer failed");

        // Update the user balance after withdraw
        s_userBalanceERC20[s_buyer][symbol] -= amount;

        // Check if all Deposits completed
        if (s_numOfAssetsDeposited != 0) {
            if (
                s_userBalanceERC20[s_buyer][symbol] !=
                s_requestedERC20[s_buyer][symbol]
            ) {
                s_numOfAssetsDeposited--;
                s_numOfBuyerDeposits--;
            }
            if (s_numOfAssetsDeposited == s_numOfAssetsInTradeTerms) {
                s_allDepositsAreCompleted = true;
            } else {
                s_allDepositsAreCompleted = false;
            }
        }
    }

    // OPEN WITHDRAWS
    function checkIfAllDepositsAreMadeAndOpenWithdrawls()
        public
        returns (bool)
    {
        require(s_sellerIsSet == true, "Seller not set");
        require(s_buyerIsSet == true, "Buyer not set");
        require(s_withdrawState == WithdrawState.CLOSED, "Withdraws are OPEN");
        require(s_depositState == DepositState.OPEN, "Deposits are CLOSED");
        require(s_tradeState == TradeState.OPEN, "Trade is not Live");
        require(
            s_allDepositsAreCompleted == true,
            "All agreed upon assets have not been deposited"
        );

        s_depositState = DepositState.CLOSED;
        s_tradeState = TradeState.CLOSING;
        s_withdrawState = WithdrawState.OPEN;

        emit Withdraw_State(s_withdrawState);

        return s_allDepositsAreCompleted;
    }

    // WITHDRAW ASSETS SET IN TERMS OF DEAL (SELLER)
    function withdrawERC20Seller(
        uint256 amount,
        bytes32 symbol
    ) public onlySeller {
        require(
            checkIfAllDepositsAreMadeAndOpenWithdrawls(),
            "All deposites have not been made"
        );
        require(
            s_withdrawState == WithdrawState.OPEN,
            "Withdraws are not OPEN"
        );

        // Check if buyer deposited enough for the seller to withdraw
        require(
            s_userBalanceERC20[s_buyer][symbol] >= amount,
            "Insufficient funds"
        );

        // Make sure user doesn't withdraw their deposited items after the terms are set
        bool s_userOwnsThisAsset;
        if (s_userBalanceERC20[s_seller][symbol] > 0) {
            s_userOwnsThisAsset = true;
        } else {
            s_userOwnsThisAsset = false;
        }
        require(
            s_userOwnsThisAsset == false,
            "Can not withdraw your own deposited item after the terms have been met."
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Transfer tokens to user
        require(token.transfer(s_seller, amount), "Token transfer failed");

        // Update balances
        s_userBalanceERC20[s_buyer][symbol] -= amount;

        // Update State of Trade
        s_numOfAssetsDeposited--;
        if (s_numOfAssetsDeposited == 0) {
            s_tradeState = TradeState.COMPLETED;
            s_depositState = DepositState.CLOSED;
            s_withdrawState = WithdrawState.CLOSED;
        }
    }

    // WITHDRAW ASSETS SET IN TERMS OF DEAL (BUYER)
    function withdrawERC20Buyer(
        bytes32 symbol,
        uint256 amount
    ) public onlyBuyer {
        require(
            checkIfAllDepositsAreMadeAndOpenWithdrawls(),
            "All deposits have not been made"
        );
        require(s_withdrawState == WithdrawState.OPEN, "Withdraw are CLOSED");

        // Check if seller deposited enough for the buyer to withdraw
        require(
            s_userBalanceERC20[s_seller][symbol] >= amount,
            "Insufficient funds"
        );

        // Make sure user doesn't withdraw thier deposited items after the terms are set
        bool s_userOwnsThisAsset;
        if (s_userBalanceERC20[s_buyer][symbol] > 0) {
            s_userOwnsThisAsset = true;
        } else {
            s_userOwnsThisAsset = false;
        }
        require(
            s_userOwnsThisAsset == false,
            "Can not withdraw your own deposited item after the terms have been met."
        );

        // Get whitelisted token address
        IERC20 token = IERC20(vendora.getWhitelistedERC20Tokens(symbol));

        // Transfer tokens to user
        require(token.transfer(s_buyer, amount), "Token transfer failed");

        // Updates balances
        s_userBalanceERC20[s_seller][symbol] -= amount;

        // Update State of Trade
        s_numOfAssetsDeposited--;
        if (s_numOfAssetsDeposited == 0) {
            s_tradeState = TradeState.COMPLETED;
            s_depositState = DepositState.CLOSED;
            s_withdrawState = WithdrawState.CLOSED;
        }
    }

    /** GET FUNCTIONS*/
    function getSellerAddress() external view returns (address) {
        return s_seller;
    }

    function getBuyerAddress() external view returns (address) {
        return s_buyer;
    }

    function getSellerIsSet() external view returns (bool) {
        return s_sellerIsSet;
    }

    function getBuyerIsSet() external view returns (bool) {
        return s_buyerIsSet;
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
}
