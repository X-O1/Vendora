// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract EscrowERC20 {
    /** CUSTOM ERRORS */
    error Not_Seller();
    error Not_Buyer();
    error Not_A_Party_Member();
    error Not_Owner();

    /** STATE VARIABLES */
    address private immutable i_owner;
    address private immutable i_unassignedPartyMember;

    address private s_seller;
    address private s_buyer;
    bool private s_sellerIsSet;
    bool private s_buyerIsSet;
    bool private s_allDepositsAreCompleted;
    uint256 private s_numOfAssetsInTradeTerms;
    uint256 private s_numOfAssetsDeposited;
    uint256 private s_numOfBuyerDeposits;

    TradeState private s_tradeState;
    DepositState private s_depositState;
    WithdrawState private s_withdrawState;

    /** MAPPINGS */
    mapping(address => mapping(address => uint256)) public s_userBalanceERC20;
    mapping(address => mapping(address => uint256)) private s_offeredERC20;
    mapping(address => mapping(address => uint256)) private s_requestedERC20;

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
        i_owner = msg.sender;
        i_unassignedPartyMember = address(0);

        s_buyer = i_unassignedPartyMember;
        s_sellerIsSet = false;
        s_buyerIsSet = false;
        s_tradeState = TradeState.CLOSED;
        s_depositState = DepositState.CLOSED;
        s_withdrawState = WithdrawState.CLOSED;
        s_numOfAssetsInTradeTerms = 0;
        s_numOfAssetsDeposited = 0;
        s_numOfBuyerDeposits = 0;
        s_allDepositsAreCompleted = false;
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
    modifier creatingTermsRequires() {
        require(
            s_tradeState == TradeState.CLOSED,
            "Can't change terms after trade is live"
        );
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
        _;
    }

    modifier depositRequires() {
        require(s_depositState == DepositState.OPEN, "Deposites are CLOSED");
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Cant deposit while withdraws are open"
        );
        require(
            s_tradeState == TradeState.OPEN,
            "Can't deposit while trade is not open"
        );
        require(
            s_allDepositsAreCompleted == false,
            "All agreed upon deposits have been made"
        );

        _;
    }

    modifier withdrawBeforeTermsAreMetRequires() {
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
        _;
    }
    modifier withdrawRequires() {
        require(
            checkIfAllDepositsAreMadeAndOpenWithdrawls(),
            "All deposits have not been made"
        );
        require(s_withdrawState == WithdrawState.OPEN, "Withdraw are CLOSED");
        _;
    }

    /** ESCROW */

    // SET SELLER
    function setSeller() external {
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
        require(
            s_numOfAssetsDeposited == 0,
            "Can not set seller after deposits have been made"
        );
        require(s_sellerIsSet == false, "Seller already set");
        require(s_buyerIsSet == false, "Seller already set");

        s_seller = msg.sender;
        s_sellerIsSet = true;

        emit Seller_Set(s_sellerIsSet, s_seller);
    }

    // ADD ERC20 REQUEST TO TRADE TERMS
    function requestERC20(
        address token,
        uint256 amount
    ) external onlySeller creatingTermsRequires {
        require(amount > 0, "Must choose an amount greater than zero");

        if (s_requestedERC20[s_seller][token] == 0) {
            s_numOfAssetsInTradeTerms++;
        }

        s_requestedERC20[s_seller][token] += amount;
    }

    // DELETE ERC20 REQUEST IN TRADE TERMS
    function deleteRequestedERC20(
        address token,
        uint256 amount
    ) external onlySeller creatingTermsRequires {
        require(s_requestedERC20[s_seller][token] > 0, "Nothing to delete");
        require(
            s_requestedERC20[s_seller][token] >= amount,
            "Trying to delete more than available in trade terms"
        );
        require(
            s_numOfAssetsInTradeTerms > 0,
            "Can be less than 0 items in trade terms"
        );

        s_requestedERC20[s_seller][token] -= amount;

        if (s_requestedERC20[s_seller][token] == 0) {
            s_numOfAssetsInTradeTerms--;
        }
    }

    // ADD ERC20 OFFER TO TRADE TERMS
    function offerERC20(
        address token,
        uint256 amount
    ) external onlySeller creatingTermsRequires {
        require(amount > 0, "Must choose an amount greater than zero");

        if (s_offeredERC20[s_seller][token] == 0) {
            s_numOfAssetsInTradeTerms++;
        }

        s_offeredERC20[s_seller][token] += amount;
    }

    // DELETE ERC20 OFFER IN TRADE TERMS
    function deleteOfferedERC20(
        address token,
        uint256 amount
    ) external onlySeller creatingTermsRequires {
        require(s_offeredERC20[s_seller][token] > 0, "Nothing to delete");
        require(
            s_offeredERC20[s_seller][token] >= amount,
            "Trying to delete more than available in trade terms"
        );
        require(
            s_numOfAssetsInTradeTerms > 0,
            "Can be less than 0 items in trade terms"
        );

        s_offeredERC20[s_seller][token] -= amount;

        if (s_offeredERC20[s_seller][token] == 0) {
            s_numOfAssetsInTradeTerms--;
        }
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
    function changeTermsAndCloseDeposits() external onlySeller {
        require(
            s_buyerIsSet == false,
            "Can only change terms after they have been set if there is no buyer set"
        );
        require(
            s_numOfAssetsDeposited == 0,
            "Withdraw all assets to change terms."
        );
        require(
            s_tradeState == TradeState.OPEN,
            "Can't change terms if the trade is closed"
        );
        require(
            s_depositState == DepositState.OPEN,
            "Can't change terms if the deposits are closed"
        );
        require(
            s_withdrawState == WithdrawState.CLOSED,
            "Can not change terms after withdrawls are open"
        );

        s_tradeState = TradeState.CLOSED;
        s_depositState = DepositState.CLOSED;
    }

    // SET BUYER
    function setBuyer() external {
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
    function leaveTradeBuyer() external onlyBuyer {
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
        s_buyer = i_unassignedPartyMember;
        s_buyerIsSet = false;

        emit Buyer_Changed(s_buyer);
    }

    // DEPOSIT ERC20 TOKENS (SELLER)
    function depositERC20Seller(
        address token,
        uint256 amount
    ) external onlySeller depositRequires {
        // Token
        IERC20 erc20 = IERC20(token);

        // Check allowances
        uint256 allowance = erc20.allowance(s_seller, address(this));
        require(allowance >= amount, "Amount of tokens have not been approved");

        // Transfer tokens from seller to escrow contract
        require(
            erc20.transferFrom(s_seller, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        s_userBalanceERC20[s_seller][token] += amount;

        // Check if seller made all deposits offered in trade terms
        if (
            s_userBalanceERC20[s_seller][token] ==
            s_offeredERC20[s_seller][token]
        ) {
            s_numOfAssetsDeposited++;
        }
        if (s_numOfAssetsInTradeTerms == s_numOfAssetsDeposited) {
            s_allDepositsAreCompleted = true;
            checkIfAllDepositsAreMadeAndOpenWithdrawls();
            emit Deposit_Terms_Met(s_allDepositsAreCompleted);
        } else {
            s_allDepositsAreCompleted = false;
        }
    }

    // DEPOSIT ERC20 TOKENS (BUYER)
    function depositERC20Buyer(
        address token,
        uint256 amount
    ) external onlyBuyer depositRequires {
        // Token
        IERC20 erc20 = IERC20(token);

        // Check token allowances
        uint256 allowance = erc20.allowance(s_buyer, address(this));
        require(allowance >= amount, "Amount of tokens have not been approved");

        // Transfer amount from buyer to the escrow contract
        require(
            erc20.transferFrom(s_buyer, address(this), amount),
            "Transfer failed"
        );

        // Update balances
        s_userBalanceERC20[s_buyer][token] += amount;

        // Check if buyer made all deposits requested in trade terms
        if (
            s_userBalanceERC20[s_buyer][token] ==
            s_requestedERC20[s_seller][token]
        ) {
            s_numOfAssetsDeposited++;
            s_numOfBuyerDeposits++;
        }
        if (s_numOfAssetsInTradeTerms == s_numOfAssetsDeposited) {
            s_allDepositsAreCompleted = true;
            checkIfAllDepositsAreMadeAndOpenWithdrawls();
            emit Deposit_Terms_Met(s_allDepositsAreCompleted);
        } else {
            s_allDepositsAreCompleted = false;
        }
    }

    // WITHDRAW YOUR OWN ASSETS BEFORE TERMS ARE MET (SELLER)
    function withdrawBeforeTermsAreMetSeller(
        address token,
        uint256 amount
    ) external onlySeller withdrawBeforeTermsAreMetRequires {
        // Check the user has enough in balance to withdraw
        require(
            s_userBalanceERC20[s_seller][token] >= amount,
            "Insufficient funds"
        );

        // Make sure user withdraws thier own asset
        require(
            getIfOtherUserOwnsThisAsset(s_buyer, token) == false,
            "Can not withdraw other party's assets"
        );

        // Token
        IERC20 erc20 = IERC20(token);

        // Transfer tokens to user
        require(erc20.transfer(s_seller, amount), "Token transfer failed");

        // Update the user balance after withdraw
        s_userBalanceERC20[s_seller][token] -= amount;

        // Check if all Deposits completed
        if (s_numOfAssetsDeposited != 0) {
            if (
                s_userBalanceERC20[s_seller][token] !=
                s_offeredERC20[s_seller][token]
            ) {
                s_numOfAssetsDeposited--;
            }
            if (s_numOfAssetsDeposited == s_numOfAssetsInTradeTerms) {
                s_allDepositsAreCompleted = true;
                checkIfAllDepositsAreMadeAndOpenWithdrawls();
                emit Deposit_Terms_Met(s_allDepositsAreCompleted);
            } else {
                s_allDepositsAreCompleted = false;
            }
        }
    }

    // WITHDRAW YOUR OWN ASSETS BEFORE TERMS ARE MET (BUYER)
    function withdrawBeforeTermsAreMetBuyer(
        address token,
        uint256 amount
    ) external onlyBuyer withdrawBeforeTermsAreMetRequires {
        // Check the user has enough in balance to withdraw
        require(
            s_userBalanceERC20[s_buyer][token] >= amount,
            "Insufficient funds"
        );
        // Make sure user withdraws thier own asset
        require(
            getIfOtherUserOwnsThisAsset(s_seller, token) == false,
            "Can not withdraw other party's assets"
        );

        // Token
        IERC20 erc20 = IERC20(token);

        // Transfer tokens to user
        require(erc20.transfer(s_buyer, amount), "Token transfer failed");

        // Update the user balance after withdraw
        s_userBalanceERC20[s_buyer][token] -= amount;

        // Check if all Deposits completed
        if (s_numOfAssetsDeposited != 0) {
            if (
                s_userBalanceERC20[s_buyer][token] !=
                s_requestedERC20[s_seller][token]
            ) {
                s_numOfAssetsDeposited--;
                s_numOfBuyerDeposits--;
            }
            if (s_numOfAssetsDeposited == s_numOfAssetsInTradeTerms) {
                s_allDepositsAreCompleted = true;
                checkIfAllDepositsAreMadeAndOpenWithdrawls();
                emit Deposit_Terms_Met(s_allDepositsAreCompleted);
            } else {
                s_allDepositsAreCompleted = false;
            }
        }
    }

    // OPEN WITHDRAWS
    function checkIfAllDepositsAreMadeAndOpenWithdrawls()
        internal
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
        address token,
        uint256 amount
    ) external onlySeller {
        // Make sure user doesn't withdraw their deposited items after the terms are set
        require(
            getIfUserOwnsThisAsset(s_seller, token) == false,
            "Can not withdraw your own deposited item after the terms have been met."
        );

        // Check if buyer deposited enough for the seller to withdraw
        require(
            s_userBalanceERC20[s_buyer][token] >= amount,
            "Insufficient funds"
        );

        IERC20 erc20 = IERC20(token);
        // Transfer tokens to user
        require(erc20.transfer(s_seller, amount), "Token transfer failed");

        // Update balances
        s_userBalanceERC20[s_buyer][token] -= amount;

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
        address token,
        uint256 amount
    ) external onlyBuyer {
        // Make sure user doesn't withdraw thier deposited items after the terms are set
        require(
            getIfUserOwnsThisAsset(s_buyer, token) == false,
            "Can not withdraw your own deposited item after the terms have been met."
        );

        // Check if seller deposited enough for the buyer to withdraw
        require(
            s_userBalanceERC20[s_seller][token] >= amount,
            "Insufficient funds"
        );

        IERC20 erc20 = IERC20(token);

        // Transfer tokens to user
        require(erc20.transfer(s_buyer, amount), "Token transfer failed");

        // Updates balances
        s_userBalanceERC20[s_seller][token] -= amount;

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

    function getNumOfAssetsInTradeTerms() external view returns (uint256) {
        return s_numOfAssetsInTradeTerms;
    }

    function getNumOfAssetsDeposited() external view returns (uint256) {
        return s_numOfAssetsDeposited;
    }

    function getUserDepositBalances(
        address user,
        address token
    ) external view returns (uint256 amount) {
        return s_userBalanceERC20[user][token];
    }

    function getRequestedERC20Tokens(
        address buyer,
        address token
    ) external view returns (uint256 amount) {
        return s_requestedERC20[buyer][token];
    }

    function getOfferedERC20Tokens(
        address seller,
        address token
    ) external view returns (uint256 amount) {
        return s_offeredERC20[seller][token];
    }

    function getIfOtherUserOwnsThisAsset(
        address user,
        address token
    ) internal view returns (bool) {
        bool s_otherUserOwnsThisAsset;
        if (s_userBalanceERC20[user][token] > 0) {
            s_otherUserOwnsThisAsset = true;
        } else {
            s_otherUserOwnsThisAsset = false;
        }

        return s_otherUserOwnsThisAsset;
    }

    function getIfUserOwnsThisAsset(
        address user,
        address token
    ) internal view returns (bool) {
        bool s_userOwnsThisAsset;
        if (s_userBalanceERC20[user][token] > 0) {
            s_userOwnsThisAsset = true;
        } else {
            s_userOwnsThisAsset = false;
        }

        return s_userOwnsThisAsset;
    }
}
