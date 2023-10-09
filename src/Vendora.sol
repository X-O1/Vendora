// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/** IMPORTS */
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
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
        bool sellerMetTerms;
        bool buyerMetTerms;
        bool allTermsMet;
        bool tradeCanceled;
        bool tradeCompleted;
    }

    /** MAPPINGS */
    mapping(bytes32 => Terms) public trades;
    mapping(address => bytes32[]) public usersActiveTrades;

    /** EVENTS */
    event Trade_Started(
        bytes32 indexed tradeId,
        bool indexed termsFinalized,
        address indexed buyer
    );
    event Terms_Set(bytes32 indexed tradeId, address indexed seller);
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
        require(terms.seller == address(0), "Trade exists");

        bytes32[] storage profile = usersActiveTrades[msg.sender];
        profile.push(tradeId);

        _addErc721(offeredErc721s, terms.offeredErc721s);
        _addErc721(requestedErc721s, terms.requestedErc721s);
        _addErc1155(offeredErc1155s, terms.offeredErc1155s);
        _addErc1155(requestedErc1155s, terms.requestedErc1155s);
        _addErc20(offeredErc20s, terms.offeredErc20s);
        _addErc20(requestedErc20s, terms.requestedErc20s);

        terms.seller = msg.sender;
        terms.buyer = address(0);
        terms.termsFinalized = false;
        terms.sellerMetTerms = false;
        terms.buyerMetTerms = false;
        terms.allTermsMet = false;
        terms.tradeCanceled = false;
        terms.tradeCompleted = false;
        terms.offeredEthAmount = offeredEthAmount;
        terms.requestedEthAmount = requestedEthAmount;

        emit Terms_Set(tradeId, terms.seller);
    }

    function deleteTrade(bytes32 tradeId) public {
        Terms storage terms = trades[tradeId];
        bytes32[] storage profile = usersActiveTrades[msg.sender];

        require(msg.sender == terms.seller, "Seller only");
        require(terms.termsFinalized == false, "Trade started");
        require(terms.buyer == address(0), "Buyer entered");

        delete trades[tradeId];

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

    function enterTrade(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.seller != address(0), "Trade doesnt exist");
        require(msg.sender != terms.seller, "Buyer only");
        require(terms.buyer == address(0), "Has buyer");

        terms.buyer = msg.sender;
        terms.termsFinalized = true;
        terms.tradeCanceled = false;
        emit Trade_Started(tradeId, terms.termsFinalized, terms.buyer);
    }

    function depositAssets(bytes32 tradeId) external payable {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "No buyer");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not member"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade canceled");

        if (msg.sender == terms.seller) {
            if (terms.offeredEthAmount > 0) {
                require(
                    msg.value == terms.offeredEthAmount,
                    "Send exact amount"
                );
            }

            _verifyErc721(terms.offeredErc721s, terms.seller);
            _verifyErc1155(terms.offeredErc1155s, terms.seller);
            _verifyErc20(terms.offeredErc20s, terms.seller);

            _depositErc721(terms.offeredErc721s, terms.seller);
            _depositErc1155(terms.offeredErc1155s, terms.seller);
            _depositErc20(terms.offeredErc20s, terms.seller);

            terms.sellerMetTerms = true;
            emit Seller_Met_Terms(tradeId, terms.sellerMetTerms);
        }

        if (msg.sender == terms.buyer) {
            if (terms.requestedEthAmount > 0) {
                require(
                    msg.value == terms.requestedEthAmount,
                    "Send exact amount"
                );
            }

            _verifyErc721(terms.requestedErc721s, terms.buyer);
            _verifyErc1155(terms.requestedErc1155s, terms.buyer);
            _verifyErc20(terms.requestedErc20s, terms.buyer);

            _depositErc721(terms.requestedErc721s, terms.buyer);
            _depositErc1155(terms.requestedErc1155s, terms.buyer);
            _depositErc20(terms.requestedErc20s, terms.buyer);

            terms.buyerMetTerms = true;
            emit Buyer_Met_Terms(tradeId, terms.buyerMetTerms);
        }

        if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
            terms.allTermsMet = true;
            completeTrade(tradeId);
        }
    }

    function completeTrade(bytes32 tradeId) private {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "No buyer");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not member"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade canceled");
        require(terms.allTermsMet == true, "Terms not met");

        if (terms.offeredEthAmount > 0) {
            payable(terms.buyer).transfer(terms.offeredEthAmount);
        }
        if (terms.requestedEthAmount > 0) {
            payable(terms.seller).transfer(terms.requestedEthAmount);
        }

        _sendErc721(terms.offeredErc721s, terms.buyer);
        _sendErc721(terms.requestedErc721s, terms.seller);

        _sendErc1155(terms.offeredErc1155s, terms.buyer);
        _sendErc1155(terms.requestedErc1155s, terms.seller);

        _sendErc20(terms.offeredErc20s, terms.buyer);
        _sendErc20(terms.requestedErc20s, terms.seller);

        terms.tradeCompleted = true;
        emit Trade_Completed(tradeId, terms.tradeCompleted);
        delete trades[tradeId];
    }

    function cancelTradeAndWithdraw(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "No buyer");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not member"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade canceled");
        require(terms.allTermsMet == false, "Terms met");

        if (terms.sellerMetTerms == true && terms.buyerMetTerms == false) {
            if (terms.offeredEthAmount > 0) {
                payable(terms.seller).transfer(terms.offeredEthAmount);
            }
            _sendErc721(terms.offeredErc721s, terms.seller);
            _sendErc1155(terms.offeredErc1155s, terms.seller);
            _sendErc20(terms.offeredErc20s, terms.seller);
        }

        if (terms.buyerMetTerms == true && terms.sellerMetTerms == false) {
            if (terms.requestedEthAmount > 0) {
                payable(terms.buyer).transfer(terms.requestedEthAmount);
            }
            _sendErc721(terms.requestedErc721s, terms.buyer);
            _sendErc1155(terms.requestedErc1155s, terms.buyer);
            _sendErc20(terms.requestedErc20s, terms.buyer);
        }

        terms.termsFinalized = false;
        terms.tradeCanceled = true;
        terms.buyer = address(0);
        emit Trade_Canceled(tradeId, terms.tradeCanceled, msg.sender);
    }

    /** HELPER FUNCTIONS */
    function _addErc721(
        Erc721Details[] memory details,
        Erc721Details[] storage terms
    ) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                require(
                    details[i].erc721Address != address(0),
                    "Invalid address"
                );
                require(details[i].tokenId > 0, "Invalid id");
                terms.push(
                    Erc721Details({
                        erc721Address: details[i].erc721Address,
                        tokenId: details[i].tokenId
                    })
                );
            }
        }
    }

    function _addErc1155(
        Erc1155Details[] memory details,
        Erc1155Details[] storage terms
    ) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                require(
                    details[i].erc1155Address != address(0),
                    "Invalid address"
                );
                require(details[i].tokenId > 0, "Invalid id");
                require(details[i].amount > 0, "Invalid amount");
                terms.push(
                    Erc1155Details({
                        erc1155Address: details[i].erc1155Address,
                        tokenId: details[i].tokenId,
                        amount: details[i].amount
                    })
                );
            }
        }
    }

    function _addErc20(
        Erc20Details[] memory details,
        Erc20Details[] storage terms
    ) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                require(
                    details[i].erc20Address != address(0),
                    "Invalid address"
                );
                require(details[i].amount > 0, "Invalid amount");
                terms.push(
                    Erc20Details({
                        erc20Address: details[i].erc20Address,
                        amount: details[i].amount
                    })
                );
            }
        }
    }

    function _verifyErc721(
        Erc721Details[] storage details,
        address user
    ) private view {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                require(
                    IERC721(details[i].erc721Address).ownerOf(
                        details[i].tokenId
                    ) == user,
                    "NFTs not owned"
                );

                require(
                    IERC721(details[i].erc721Address).getApproved(
                        details[i].tokenId
                    ) == address(this),
                    "Nfts not approved"
                );
            }
        }
    }

    function _verifyErc1155(
        Erc1155Details[] storage details,
        address user
    ) private view {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                require(
                    IERC1155(details[i].erc1155Address).balanceOf(
                        user,
                        details[i].tokenId
                    ) >= details[i].amount,
                    "NFTs not owned"
                );

                require(
                    IERC1155(details[i].erc1155Address).isApprovedForAll(
                        user,
                        address(this)
                    ) == true,
                    "Nfts not approved"
                );
            }
        }
    }

    function _verifyErc20(
        Erc20Details[] storage details,
        address user
    ) private view {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                require(
                    IERC20(details[i].erc20Address).balanceOf(user) >=
                        details[i].amount,
                    "Amounts not owned"
                );

                require(
                    IERC20(details[i].erc20Address).allowance(
                        user,
                        address(this)
                    ) >= details[i].amount,
                    "Amounts not approved"
                );
            }
        }
    }

    function _depositErc721(
        Erc721Details[] storage details,
        address user
    ) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                IERC721(details[i].erc721Address).safeTransferFrom(
                    user,
                    address(this),
                    details[i].tokenId
                );
            }
        }
    }

    function _depositErc1155(
        Erc1155Details[] storage details,
        address user
    ) private {
        if (details.length > 0) {
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
    }

    function _depositErc20(
        Erc20Details[] storage details,
        address user
    ) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                IERC20(details[i].erc20Address).transferFrom(
                    user,
                    address(this),
                    details[i].amount
                );
            }
        }
    }

    function _sendErc721(
        Erc721Details[] storage details,
        address user
    ) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                IERC721(details[i].erc721Address).safeTransferFrom(
                    address(this),
                    user,
                    details[i].tokenId
                );
            }
        }
    }

    function _sendErc1155(
        Erc1155Details[] storage details,
        address user
    ) private {
        if (details.length > 0) {
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
    }

    function _sendErc20(Erc20Details[] storage details, address user) private {
        if (details.length > 0) {
            for (uint256 i = 0; i < details.length; i++) {
                IERC20(details[i].erc20Address).transfer(
                    user,
                    details[i].amount
                );
            }
        }
    }

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

    function getTerms(
        bytes32 tradeId
    )
        external
        view
        returns (
            Erc721Details[] memory offeredErc721s,
            Erc721Details[] memory requestedErc721s,
            Erc1155Details[] memory offeredErc1155s,
            Erc1155Details[] memory requestedErc1155s,
            Erc20Details[] memory offeredErc20s,
            Erc20Details[] memory requestedErc20s,
            uint256 offeredEth,
            uint256 requestedEth
        )
    {
        Terms storage term = trades[tradeId];

        return (
            term.offeredErc721s,
            term.requestedErc721s,
            term.offeredErc1155s,
            term.requestedErc1155s,
            term.offeredErc20s,
            term.requestedErc20s,
            term.offeredEthAmount,
            term.requestedEthAmount
        );
    }

    function getUsersActiveTrades(
        address user
    ) external view returns (bytes32[] memory userTrades) {
        return usersActiveTrades[user];
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
