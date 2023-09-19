// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/** IMPORTS */
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract Vendora is IERC721Receiver, IERC1155Receiver {
    /** ERRORS */
    error TRADE_DOES_NOT_EXIST();
    /** STRUCTS */
    struct Erc721Details {
        address erc721Address;
        uint256 tokenId;
    }
    struct Erc1155Details {
        address erc1155Address;
        uint256 tokenId;
        uint256 amount;
    }
    struct Erc20Details {
        address erc20Address;
        uint256 amount;
    }

    struct Terms {
        address seller;
        address buyer;
        Erc721Details[] offeredErc721s;
        Erc721Details[] requestedErc721s;
        Erc1155Details[] offeredErc1155s;
        Erc1155Details[] requestedErc1155s;
        Erc20Details[] offeredErc20s;
        Erc20Details[] requestedErc20s;
        uint256 offeredEthAmount;
        uint256 requestedEthAmount;
        bool termsFinalized;
        bool sellerReady;
        bool buyerReady;
        bool sellerMetTerms;
        bool buyerMetTerms;
        bool allTermsMet;
        bool tradeCanceled;
        bool tradeCompleted;
    }

    struct UserProfile {
        address user;
        bytes32[] activeTradeIds;
    }
    /** MAPPINGS */
    mapping(bytes32 => Terms) public trades;
    mapping(address => bytes32[]) private userActiveTrades;
    // need to make sure both data structures are updated **********************************

    /** EVENTS */
    event Trade_Started(
        bytes32 indexed tradeId,
        bool indexed termsFinalized,
        address indexed buyer
    );
    event Terms_Set(bytes32 indexed tradeId, address indexed seller);
    event Seller_Ready(bytes32 indexed tradeId, bool indexed sellerReady);
    event Buyer_Ready(bytes32 indexed tradeId, bool indexed buyerReady);
    event Seller_Met_Terms(
        bytes32 indexed tradeId,
        bool indexed sellerMetTerms
    );
    event Buyer_Met_Terms(bytes32 indexed tradeId, bool indexed buyerMetTerms);
    event Trade_Canceled(
        bytes32 indexed tradeId,
        bool indexed tradeCanceled,
        address indexed userThatCanceled
    );
    event Trade_Completed(bytes32 indexed tradeId, bool indexed tradeCompleted);

    // START NEW TRADE
    function setTerms(
        Erc721Details[] memory offeredErc721s,
        Erc721Details[] memory requestedErc721s,
        Erc1155Details[] memory offeredErc1155s,
        Erc1155Details[] memory requestedErc1155s,
        Erc20Details[] memory offeredErc20s,
        Erc20Details[] memory requestedErc20s,
        uint256 offeredEthAmount,
        uint256 requestedEthAmount
    ) external {
        bytes32 tradeId = generateTradeId(
            offeredErc721s.length,
            requestedErc721s.length,
            offeredErc1155s.length,
            requestedErc1155s.length,
            offeredErc20s.length,
            requestedErc20s.length,
            offeredEthAmount,
            requestedEthAmount
        );
        Terms storage terms = trades[tradeId];
        bytes32[] storage profile = userActiveTrades[msg.sender];

        profile.push(tradeId);

        require(terms.seller == address(0), "This trade already exists");

        if (offeredErc721s.length > 0) {
            _addErc721(offeredErc721s, terms.offeredErc721s);
        }
        if (requestedErc721s.length > 0) {
            _addErc721(requestedErc721s, terms.requestedErc721s);
        }
        if (offeredErc1155s.length > 0) {
            _addErc1155(offeredErc1155s, terms.offeredErc1155s);
        }
        if (requestedErc1155s.length > 0) {
            _addErc1155(requestedErc1155s, terms.requestedErc1155s);
        }
        if (offeredErc20s.length > 0) {
            _addErc20(offeredErc20s, terms.offeredErc20s);
        }
        if (requestedErc20s.length > 0) {
            _addErc20(requestedErc20s, terms.requestedErc20s);
        }

        terms.seller = msg.sender;
        terms.buyer = address(0);
        terms.termsFinalized = false;
        terms.sellerReady = false;
        terms.buyerReady = false;
        terms.sellerMetTerms = false;
        terms.buyerMetTerms = false;
        terms.allTermsMet = false;
        terms.tradeCanceled = false;
        terms.tradeCompleted = false;
        terms.offeredEthAmount = offeredEthAmount;
        terms.requestedEthAmount = requestedEthAmount;

        emit Terms_Set(tradeId, terms.seller);
    }

    function deleteTerms(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        bytes32[] storage profile = userActiveTrades[msg.sender];
        require(
            msg.sender == terms.seller,
            "Only User that set original terms can delete trades"
        );
        require(
            terms.termsFinalized == false,
            "Cant delete terms if buyer has entered the trade"
        );
        for (uint256 i = 0; i < profile.length; i++) {
            if (profile[i] == tradeId) {
                if (i != profile.length - 1) {
                    profile[i] = profile[profile.length - 1];
                }
                profile.pop();
                return;
            }
            if (profile[i] != tradeId) {
                revert TRADE_DOES_NOT_EXIST();
            }
        }
    }

    function startTrade(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.seller != address(0), "This trade does not exist");
        require(msg.sender != terms.seller, "Trade must be started by buyer");
        require(terms.buyer == address(0), "This trade already has a buyer");

        terms.buyer = msg.sender;
        terms.termsFinalized = true;
        terms.tradeCanceled = false;
        emit Trade_Started(tradeId, terms.termsFinalized, terms.buyer);
    }

    // VERIFY BOTH PARTIES HAVE ASSETS SET IN TERMS
    function verifySellerAssets(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(
            terms.buyer != address(0),
            "This trade does not exist or does not have a buyer"
        );
        require(msg.sender == terms.seller, "Not a memeber in this trade");
        require(terms.termsFinalized == true, "Terms not finalized");

        // Check if seller has same amount of eth offered in terms
        if (terms.offeredEthAmount > 0) {
            require(
                terms.seller.balance >= terms.offeredEthAmount,
                "You do not hold amount of eth set in terms"
            );
        }

        // Check if seller has NFTs(ERC721) offered in terms/approved them for transfer
        if (terms.offeredErc721s.length > 0) {
            _verifyErc721(terms.offeredErc721s, terms.seller);
        }

        // Check if seller has NFTs(ERC1155) offered in terms/approved them for transfer
        if (terms.offeredErc1155s.length > 0) {
            _verifyErc1155(terms.offeredErc1155s, terms.seller);
        }

        // Check if seller has amounts of ERC20s offered in terms/approved them for transfer
        if (terms.offeredErc20s.length > 0) {
            _verifyErc20(terms.offeredErc20s, terms.seller);
        }

        terms.sellerReady = true;
        emit Seller_Ready(tradeId, terms.sellerReady);
    }

    function verifyBuyerAssets(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(
            terms.buyer != address(0),
            "This trade does not exist or does not have a buyer"
        );
        require(msg.sender == terms.buyer, "Not buyer in this trade");
        require(terms.termsFinalized == true, "Terms not finalized");
        // Check if buyer has same amount of eth offered in terms
        if (terms.requestedEthAmount > 0) {
            require(
                terms.buyer.balance >= terms.requestedEthAmount,
                "You do not hold amount of eth set in terms"
            );
        }

        // Check if buyer has NFTs(ERC721) requested in terms/approved them for transfer
        if (terms.requestedErc721s.length > 0) {
            _verifyErc721(terms.requestedErc721s, terms.buyer);
        }

        // Check if buyer has NFTs(ERC1155) requested in terms/approved them for transfer
        if (terms.requestedErc1155s.length > 0) {
            _verifyErc1155(terms.requestedErc1155s, terms.buyer);
        }

        // Check if buyer has amounts of ERC20s requested in terms/approved them for transfer
        if (terms.requestedErc20s.length > 0) {
            _verifyErc20(terms.requestedErc20s, terms.buyer);
        }

        terms.buyerReady = true;
        emit Buyer_Ready(tradeId, terms.buyerReady);
    }

    // DEPOSIT ALL ASSETS SET IN TERMS OF TRADE
    function depositAssets(bytes32 tradeId) external payable {
        Terms storage terms = trades[tradeId];
        require(
            terms.buyer != address(0),
            "This trade does not exist or does not have a buyer"
        );
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a member of this trade"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade already canceled");
        require(
            terms.sellerReady == true && terms.buyerReady == true,
            "Buyer and/or Seller have not verified they own all assets in terms"
        );

        if (msg.sender == terms.seller) {
            // Deposit seller's eth
            if (terms.offeredEthAmount > 0) {
                require(
                    msg.value == terms.offeredEthAmount,
                    "Send exact amount of ETH set in terms"
                );
            }
            // Deposit seller's ERC721s
            if (terms.offeredErc721s.length > 0) {
                _depositErc721(terms.offeredErc721s, terms.seller);
            }
            // Deposit seller's ERC1155s
            if (terms.offeredErc1155s.length > 0) {
                _depositErc1155(terms.offeredErc1155s, terms.seller);
            }
            // Deposit seller's Erc20s
            if (terms.offeredErc20s.length > 0) {
                _depositErc20(terms.offeredErc20s, terms.seller);
            }

            terms.sellerMetTerms = true;
            emit Seller_Met_Terms(tradeId, terms.sellerMetTerms);
        }

        if (msg.sender == terms.buyer) {
            // Deposit buyer's Eth
            if (terms.requestedEthAmount > 0) {
                require(
                    msg.value == terms.requestedEthAmount,
                    "Send exact amount of ETH set in terms"
                );
            }
            // Deposit buyer's ERC721s
            if (terms.requestedErc721s.length > 0) {
                _depositErc721(terms.requestedErc721s, terms.buyer);
            }

            // Deposit buyer's ERC1155s
            if (terms.requestedErc1155s.length > 0) {
                _depositErc1155(terms.requestedErc1155s, terms.buyer);
            }
            // Deposit buyer's Erc20s
            if (terms.requestedErc20s.length > 0) {
                _depositErc20(terms.requestedErc20s, terms.buyer);
            }

            terms.buyerMetTerms = true;
            emit Buyer_Met_Terms(tradeId, terms.buyerMetTerms);
        }

        // If all deposits were successful complete the trade
        if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
            terms.allTermsMet = true;
            completeTrade(tradeId);
        }
    }

    // CANCEL TRADE
    function cancelTradeAndWithdraw(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(
            terms.buyer != address(0),
            "This trade does not exist or does not have a buyer"
        );
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a member of this trade"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade already canceled");
        require(
            terms.allTermsMet == false,
            "Can not cancel trade after all terms have been met"
        );

        if (terms.sellerMetTerms == true && terms.buyerMetTerms == false) {
            // Send back seller's Eth
            if (terms.offeredEthAmount > 0) {
                payable(terms.seller).transfer(terms.offeredEthAmount);
            }
            // Send back seller's ERC721s
            if (terms.offeredErc721s.length > 0) {
                _sendErc721(terms.offeredErc721s, terms.seller);
            }
            // Send back seller's ERC1155s
            if (terms.offeredErc1155s.length > 0) {
                _sendErc1155(terms.offeredErc1155s, terms.seller);
            }
            // Send back seller's ERC20s
            if (terms.offeredErc20s.length > 0) {
                _sendErc20(terms.offeredErc20s, terms.seller);
            }
        }

        if (terms.buyerMetTerms == true && terms.sellerMetTerms == false) {
            // Send back buyer's Eth
            if (terms.requestedEthAmount > 0) {
                payable(terms.buyer).transfer(terms.requestedEthAmount);
            }
            // Send back buyer's ERC721s
            if (terms.requestedErc721s.length > 0) {
                _sendErc721(terms.requestedErc721s, terms.buyer);
            }
            // Send back buyer's ERC1155s
            if (terms.requestedErc1155s.length > 0) {
                _sendErc1155(terms.requestedErc1155s, terms.buyer);
            }
            // Send back buyer's ERC20s
            if (terms.requestedErc20s.length > 0) {
                _sendErc20(terms.requestedErc20s, terms.buyer);
            }
        }

        // Cancel and delete trade
        terms.termsFinalized = false;
        terms.tradeCanceled = true;
        terms.buyer = address(0);
        emit Trade_Canceled(tradeId, terms.tradeCanceled, msg.sender);
    }

    // TRANFER ALL ASSETS TO RIGHTFUL OWNER AND COMPLETE THE TRADE
    function completeTrade(bytes32 tradeId) private {
        Terms storage terms = trades[tradeId];
        require(
            terms.buyer != address(0),
            "This trade does not exist or does not have a buyer"
        );
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a member of this trade"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade canceled");
        require(
            terms.allTermsMet == true,
            "All assets must be deposited to complete the trade"
        );

        // Send Eth
        if (terms.offeredEthAmount > 0) {
            payable(terms.buyer).transfer(terms.offeredEthAmount);
        }
        if (terms.requestedEthAmount > 0) {
            payable(terms.seller).transfer(terms.requestedEthAmount);
        }

        // Send Erc721s
        if (terms.offeredErc721s.length > 0) {
            _sendErc721(terms.offeredErc721s, terms.buyer);
        }
        if (terms.requestedErc721s.length > 0) {
            _sendErc721(terms.requestedErc721s, terms.seller);
        }

        // Send Erc1155s
        if (terms.offeredErc1155s.length > 0) {
            _sendErc1155(terms.offeredErc1155s, terms.buyer);
        }
        if (terms.requestedErc1155s.length > 0) {
            _sendErc1155(terms.requestedErc1155s, terms.seller);
        }

        // Send Erc20s
        if (terms.offeredErc20s.length > 0) {
            _sendErc20(terms.offeredErc20s, terms.buyer);
        }
        if (terms.requestedErc20s.length > 0) {
            _sendErc20(terms.requestedErc20s, terms.seller);
        }

        terms.tradeCompleted = true;
        emit Trade_Completed(tradeId, terms.tradeCompleted);
        delete trades[tradeId];
    }

    /** HELPER FUNCTIONS */
    function _addErc721(
        Erc721Details[] memory details,
        Erc721Details[] storage terms
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            require(
                details[i].erc721Address != address(0),
                "Invalid Erc721 address"
            );
            require(details[i].tokenId > 0, "Invalid token id");
            terms.push(
                Erc721Details({
                    erc721Address: details[i].erc721Address,
                    tokenId: details[i].tokenId
                })
            );
        }
    }

    function _addErc1155(
        Erc1155Details[] memory details,
        Erc1155Details[] storage terms
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            require(
                details[i].erc1155Address != address(0),
                "Invalid Erc1155 address"
            );
            require(details[i].tokenId > 0, "Invalid token id");
            require(
                details[i].amount > 0,
                "Invalid amount, must be greater than 0"
            );
            terms.push(
                Erc1155Details({
                    erc1155Address: details[i].erc1155Address,
                    tokenId: details[i].tokenId,
                    amount: details[i].amount
                })
            );
        }
    }

    function _addErc20(
        Erc20Details[] memory details,
        Erc20Details[] storage terms
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            require(
                details[i].erc20Address != address(0),
                "Invalid erc20 address"
            );
            require(
                details[i].amount > 0,
                "Invalid erc20 amount, must be greater than zero"
            );
            terms.push(
                Erc20Details({
                    erc20Address: details[i].erc20Address,
                    amount: details[i].amount
                })
            );
        }
    }

    function _verifyErc721(
        Erc721Details[] storage details,
        address user
    ) private view {
        for (uint256 i = 0; i < details.length; i++) {
            require(
                IERC721(details[i].erc721Address).ownerOf(details[i].tokenId) ==
                    user,
                "You do not own one of more NFTs set in terms"
            );

            require(
                IERC721(details[i].erc721Address).getApproved(
                    details[i].tokenId
                ) == address(this),
                "One of more Nfts have not been approved for transfer"
            );
        }
    }

    function _verifyErc1155(
        Erc1155Details[] storage details,
        address user
    ) private view {
        for (uint256 i = 0; i < details.length; i++) {
            require(
                IERC1155(details[i].erc1155Address).balanceOf(
                    user,
                    details[i].tokenId
                ) >= details[i].amount,
                "You do not own one or more amounts of Erc1155s set in terms"
            );

            require(
                IERC1155(details[i].erc1155Address).isApprovedForAll(
                    user,
                    address(this)
                ) == true,
                "One of more Nfts have not been approved for transfer"
            );
        }
    }

    function _verifyErc20(
        Erc20Details[] storage details,
        address user
    ) private view {
        for (uint256 i = 0; i < details.length; i++) {
            require(
                IERC20(details[i].erc20Address).balanceOf(user) >=
                    details[i].amount,
                "You do not own one or more amounts of ERC20s offered in terms"
            );

            require(
                IERC20(details[i].erc20Address).allowance(
                    user,
                    address(this)
                ) >= details[i].amount,
                "One or more amounts of ERC20s have not been approved for transfer"
            );
        }
    }

    function _depositErc721(
        Erc721Details[] storage details,
        address user
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            IERC721(details[i].erc721Address).safeTransferFrom(
                user,
                address(this),
                details[i].tokenId
            );
        }
    }

    function _depositErc1155(
        Erc1155Details[] storage details,
        address user
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            IERC1155(details[i].erc1155Address).safeTransferFrom(
                user,
                address(this),
                details[i].tokenId,
                details[i].amount,
                bytes("")
            );
        }
    }

    function _depositErc20(
        Erc20Details[] storage details,
        address user
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            IERC20(details[i].erc20Address).transferFrom(
                user,
                address(this),
                details[i].amount
            );
        }
    }

    function _sendErc721(
        Erc721Details[] storage details,
        address user
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            IERC721(details[i].erc721Address).safeTransferFrom(
                address(this),
                user,
                details[i].tokenId
            );
        }
    }

    function _sendErc1155(
        Erc1155Details[] storage details,
        address user
    ) private {
        for (uint256 i = 0; i < details.length; i++) {
            IERC1155(details[i].erc1155Address).safeTransferFrom(
                address(this),
                user,
                details[i].tokenId,
                details[i].amount,
                bytes("")
            );
        }
    }

    function _sendErc20(Erc20Details[] storage details, address user) private {
        for (uint256 i = 0; i < details.length; i++) {
            IERC20(details[i].erc20Address).transfer(user, details[i].amount);
        }
    }

    /** GET  */
    function generateTradeId(
        uint256 offeredErc721sLength,
        uint256 requestedErc721sLength,
        uint256 offeredErc1155sLength,
        uint256 requestedErc1155sLength,
        uint256 offeredErc20sLength,
        uint256 requestedErc20sLength,
        uint256 offeredEthAmount,
        uint256 requestedEthAmount
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    msg.sender,
                    block.timestamp,
                    offeredErc721sLength,
                    requestedErc721sLength,
                    offeredErc1155sLength,
                    requestedErc1155sLength,
                    offeredErc20sLength,
                    requestedErc20sLength,
                    offeredEthAmount,
                    requestedEthAmount
                )
            );
    }

    function getUserActiveTerms(
        address user
    ) external view returns (bytes32[] memory) {
        bytes32[] storage profile = userActiveTrades[user];
        return profile;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure override returns (bool) {
        return
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
