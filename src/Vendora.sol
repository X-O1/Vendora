// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/** IMPORTS */
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC1155} from "lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol";

contract Vendora {
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
    /** MAPPINGS */
    mapping(bytes32 => Terms) public trades;
    mapping(bytes32 => Terms) public completedTrades;

    /** EVENTS */
    event Trade_Started(bytes32 indexed tradeId);
    event Terms_Finalized(bytes32 indexed tradeId, bool indexed termsFinalized);
    event Seller_Ready(bytes32 indexed tradeId, bool indexed sellerReady);
    event Buyer_Ready(bytes32 indexed tradeId, bool indexed buyerReady);
    event Seller_Met_Terms(
        bytes32 indexed tradeId,
        bool indexed sellerMetTerms
    );
    event Buyer_Met_Terms(bytes32 indexed tradeId, bool indexed buyerMetTerms);
    event Trade_Canceled(bytes32 indexed tradeId, bool indexed tradeCanceled);
    event Trade_Completed(bytes32 indexed tradeId, bool indexed tradeCompleted);

    // START NEW TRADE
    function startTrade(address buyer) external returns (bytes32) {
        bytes32 tradeId = generateTradeId(buyer);
        Terms storage terms = trades[tradeId];

        terms.seller = msg.sender;
        terms.buyer = buyer;
        terms.termsFinalized = false;
        terms.sellerReady = false;
        terms.buyerReady = false;
        terms.sellerMetTerms = false;
        terms.buyerMetTerms = false;
        terms.allTermsMet = false;
        terms.tradeCanceled = false;
        terms.tradeCompleted = false;

        emit Trade_Started(tradeId);

        return tradeId;
    }

    // ADD ASSETS TO TRADE TERMS
    function addErc721(
        bytes32 tradeId,
        address erc721Address,
        uint256 tokenId,
        bool offeringAsset
    ) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(
            msg.sender == terms.seller,
            "Only seller can add assets to terms"
        );
        require(erc721Address != address(0), "Invalid address");
        require(tokenId > 0, "Invalid token id");
        require(
            terms.termsFinalized == false,
            "Can not change terms after terms are finalized"
        );

        offeringAsset
            ? terms.offeredErc721s.push(
                Erc721Details({erc721Address: erc721Address, tokenId: tokenId})
            )
            : terms.requestedErc721s.push(
                Erc721Details({erc721Address: erc721Address, tokenId: tokenId})
            );
    }

    function addErc1155(
        bytes32 tradeId,
        address erc1155Address,
        uint256 tokenId,
        uint256 amount,
        bool offeringAsset
    ) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(
            msg.sender == terms.seller,
            "Only seller can add assets to terms"
        );
        require(erc1155Address != address(0), "Invalid address");
        require(tokenId > 0, "Invalid token id");
        require(amount > 0, "Invalid amount, must be greater than 0");
        require(
            terms.termsFinalized == false,
            "Can not change terms after terms are finalized"
        );

        offeringAsset
            ? terms.offeredErc1155s.push(
                Erc1155Details({
                    erc1155Address: erc1155Address,
                    tokenId: tokenId,
                    amount: amount
                })
            )
            : terms.requestedErc1155s.push(
                Erc1155Details({
                    erc1155Address: erc1155Address,
                    tokenId: tokenId,
                    amount: amount
                })
            );
    }

    function addErc20(
        bytes32 tradeId,
        address erc20Address,
        uint256 amount,
        bool offeringAsset
    ) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(
            msg.sender == terms.seller,
            "Only seller can add assets to terms"
        );
        require(erc20Address != address(0), "Invalid erc20 address");
        require(amount > 0, "Invalid erc20 amount, must be greater than zero");
        require(
            terms.termsFinalized == false,
            "Can not change terms after terms are finalized"
        );

        offeringAsset
            ? terms.offeredErc20s.push(
                Erc20Details({erc20Address: erc20Address, amount: amount})
            )
            : terms.requestedErc20s.push(
                Erc20Details({erc20Address: erc20Address, amount: amount})
            );
    }

    function addEth(
        bytes32 tradeId,
        uint256 ethAmount,
        bool offeringAsset
    ) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "Trade does not exist");
        require(
            msg.sender == terms.seller,
            "Only seller can add assets to terms"
        );
        require(ethAmount > 0, "Invalid eth amount, must be greater than zero");
        require(
            terms.termsFinalized == false,
            "Can not change terms after terms are finalized"
        );

        offeringAsset
            ? terms.offeredEthAmount = ethAmount
            : terms.requestedEthAmount = ethAmount;
    }

    function finalizeTerms(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(msg.sender == terms.seller, "Only seller can finalize terms");
        require(terms.termsFinalized == false, "Terms are aleady finalized");

        terms.termsFinalized = true;
        emit Terms_Finalized(tradeId, terms.termsFinalized);
    }

    // VERIFY BOTH PARTIES HAVE ASSETS SET IN TERMS
    function verifyUserAssets(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a memeber in this trade"
        );
        require(terms.termsFinalized == true, "Terms not finalized");

        if (msg.sender == terms.seller) {
            // Check if seller has same amount of eth offered in terms
            if (terms.offeredEthAmount > 0) {
                require(
                    terms.seller.balance >= terms.offeredEthAmount,
                    "You do not hold amount of eth set in terms"
                );
            }

            // Check if seller has same NFTs(ERC721) offered in terms and approved them for transfer
            uint256 offeredErc721ListLength = terms.offeredErc721s.length;
            if (offeredErc721ListLength > 0) {
                for (uint256 i = 0; i < offeredErc721ListLength; i++) {
                    require(
                        IERC721(terms.offeredErc721s[i].erc721Address).ownerOf(
                            terms.offeredErc721s[i].tokenId
                        ) == terms.seller,
                        "You do not own one of more NFTs set in terms"
                    );

                    require(
                        IERC721(terms.offeredErc721s[i].erc721Address)
                            .getApproved(terms.offeredErc721s[i].tokenId) ==
                            address(this),
                        "One of more Nfts have not been approved for transfer"
                    );
                }
            }

            // Check if seller has same NFTs(ERC1155) offered in terms and approved them for transfer
            uint256 offeredErc1155ListLength = terms.offeredErc1155s.length;
            if (offeredErc1155ListLength > 0) {
                for (uint256 i = 0; i < offeredErc1155ListLength; i++) {
                    require(
                        IERC1155(terms.offeredErc1155s[i].erc1155Address)
                            .balanceOf(
                                terms.seller,
                                terms.offeredErc1155s[i].tokenId
                            ) >= terms.offeredErc1155s[i].amount,
                        "You do not own one or more amounts of Erc1155s set in terms"
                    );

                    require(
                        IERC1155(terms.offeredErc1155s[i].erc1155Address)
                            .isApprovedForAll(terms.seller, address(this)) ==
                            true,
                        "One of more Nfts have not been approved for transfer"
                    );
                }
            }

            // Check if seller has same amounts of ERC20s offered in terms and approved them for transfer
            uint256 offeredErc20ListLength = terms.offeredErc20s.length;
            if (offeredErc20ListLength > 0) {
                for (uint256 i = 0; i < offeredErc20ListLength; i++) {
                    require(
                        IERC20(terms.offeredErc20s[i].erc20Address).balanceOf(
                            terms.seller
                        ) >= terms.offeredErc20s[i].amount,
                        "You do not own one or more amounts of ERC20s offered in terms"
                    );

                    require(
                        IERC20(terms.offeredErc20s[i].erc20Address).allowance(
                            terms.seller,
                            address(this)
                        ) >= terms.offeredErc20s[i].amount,
                        "One or more amounts of ERC20s have not been approved for transfer"
                    );
                }
            }

            terms.sellerReady = true;
            emit Seller_Ready(tradeId, terms.sellerReady);
        }

        // Check if seller has same amount of eth offered in terms
        if (msg.sender == terms.buyer) {
            if (terms.requestedEthAmount > 0) {
                require(
                    terms.buyer.balance >= terms.requestedEthAmount,
                    "You do not hold amount of eth set in terms"
                );
            }
            // Check if seller has same NFTs(ERC721) offered in terms and approved them for transfer
            uint256 requestedErc721ListLength = terms.requestedErc721s.length;
            if (requestedErc721ListLength > 0) {
                for (uint256 i = 0; i < requestedErc721ListLength; i++) {
                    require(
                        IERC721(terms.requestedErc721s[i].erc721Address)
                            .ownerOf(terms.requestedErc721s[i].tokenId) ==
                            terms.buyer,
                        "You do not own one of more NFTs set in terms"
                    );

                    require(
                        IERC721(terms.requestedErc721s[i].erc721Address)
                            .getApproved(terms.requestedErc721s[i].tokenId) ==
                            address(this),
                        "One of more Nfts have not been approved for transfer"
                    );
                }
            }

            // Check if buyer has same NFTs(ERC1155) offered in terms and approved them for transfer
            uint256 requestedErc1155ListLength = terms.requestedErc1155s.length;
            if (requestedErc1155ListLength > 0) {
                for (uint256 i = 0; i < requestedErc1155ListLength; i++) {
                    require(
                        IERC1155(terms.requestedErc1155s[i].erc1155Address)
                            .balanceOf(
                                terms.buyer,
                                terms.requestedErc1155s[i].tokenId
                            ) >= terms.requestedErc1155s[i].amount,
                        "You do not own one or more amounts of Erc1155s set in terms"
                    );

                    require(
                        IERC1155(terms.requestedErc1155s[i].erc1155Address)
                            .isApprovedForAll(terms.buyer, address(this)) ==
                            true,
                        "One of more amounts of ERC155s have not been approved for transfer"
                    );
                }
            }

            // Check if seller has same amounts of ERC20s offered in terms and approved them for transfer
            uint256 requestedERC20ListLength = terms.requestedErc20s.length;
            if (requestedERC20ListLength > 0) {
                for (uint256 i = 0; i < requestedERC20ListLength; i++) {
                    require(
                        IERC20(terms.requestedErc20s[i].erc20Address).balanceOf(
                            terms.buyer
                        ) >= terms.requestedErc20s[i].amount,
                        "You do not own one or more amounts of ERC20s offered in terms"
                    );

                    require(
                        IERC20(terms.requestedErc20s[i].erc20Address).allowance(
                            terms.buyer,
                            address(this)
                        ) >= terms.requestedErc20s[i].amount,
                        "One or more amounts of ERC20s have not been approved for transfer"
                    );
                }
            }

            terms.buyerReady = true;
            emit Buyer_Ready(tradeId, terms.buyerReady);
        }
    }

    // DEPOSIT ALL ASSETS SET IN TERMS OF TRADE
    function depositAssets(bytes32 tradeId) external payable {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "Trade does not exist");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a member of this trade"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(
            terms.sellerReady == true && terms.buyerReady == true,
            "Buyer and Seller are not ready to complete trade"
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
            uint256 offeredErc721ListLength = terms.offeredErc721s.length;
            if (offeredErc721ListLength > 0) {
                for (uint256 i = 0; i < offeredErc721ListLength; i++) {
                    IERC721(terms.offeredErc721s[i].erc721Address)
                        .safeTransferFrom(
                            terms.seller,
                            address(this),
                            terms.offeredErc721s[i].tokenId
                        );
                }
            }
            // Deposit seller's ERC1155s
            uint256 offeredErc1155ListLength = terms.offeredErc1155s.length;
            if (offeredErc1155ListLength > 0) {
                for (uint256 i = 0; i < offeredErc1155ListLength; i++) {
                    IERC1155(terms.offeredErc1155s[i].erc1155Address)
                        .safeTransferFrom(
                            terms.seller,
                            address(this),
                            terms.offeredErc1155s[i].tokenId,
                            terms.offeredErc1155s[i].amount,
                            bytes("")
                        );
                }
            }
            // Deposit seller's Erc20s
            uint256 offeredErc20ListLength = terms.offeredErc20s.length;
            if (offeredErc20ListLength > 0) {
                for (uint256 i = 0; i < offeredErc20ListLength; i++) {
                    IERC20(terms.offeredErc20s[i].erc20Address).transferFrom(
                        terms.seller,
                        address(this),
                        terms.offeredErc20s[i].amount
                    );
                }
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
            uint256 requestedErc721ListLength = terms.requestedErc721s.length;
            if (requestedErc721ListLength > 0) {
                for (uint256 i = 0; i < requestedErc721ListLength; i++) {
                    IERC721(terms.requestedErc721s[i].erc721Address)
                        .safeTransferFrom(
                            terms.buyer,
                            address(this),
                            terms.requestedErc721s[i].tokenId
                        );
                }
            }

            // Deposit buyer's ERC1155s
            uint256 requestedErc1155ListLength = terms.requestedErc1155s.length;
            if (requestedErc1155ListLength > 0) {
                for (uint256 i = 0; i < requestedErc1155ListLength; i++) {
                    IERC1155(terms.requestedErc1155s[i].erc1155Address)
                        .safeTransferFrom(
                            terms.buyer,
                            address(this),
                            terms.requestedErc1155s[i].tokenId,
                            terms.requestedErc1155s[i].amount,
                            bytes("")
                        );
                }
            }
            // Deposit buyer's Erc20s
            uint256 requestedErc20ListLength = terms.requestedErc20s.length;
            if (requestedErc20ListLength > 0) {
                for (uint256 i = 0; i < requestedErc20ListLength; i++) {
                    IERC20(terms.requestedErc20s[i].erc20Address).transferFrom(
                        terms.buyer,
                        address(this),
                        terms.requestedErc20s[i].amount
                    );
                }
            }
            terms.buyerMetTerms = true;
            emit Buyer_Met_Terms(tradeId, terms.buyerMetTerms);
        }

        // If all deposits were successful complete the trade
        if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
            terms.allTermsMet = true;
            Vendora.completeTrade(tradeId);
        }
    }

    // CANCEL TRADE
    function cancelAndDeleteTrade(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "Trade does not exist");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a member of this trade"
        );
        require(terms.termsFinalized == true, "Terms not finalized");
        require(terms.tradeCanceled == false, "Trade already canceled");
        require(
            terms.allTermsMet == false,
            "All assets must be deposited to complete the trade"
        );

        if (terms.sellerMetTerms == true && terms.buyerMetTerms == false) {
            // Send back seller's Eth
            if (terms.offeredEthAmount > 0) {
                payable(terms.seller).transfer(terms.offeredEthAmount);
            }
            // Send back seller's ERC721s
            uint256 offeredErc721ListLength = terms.offeredErc721s.length;
            if (offeredErc721ListLength > 0) {
                for (uint256 i = 0; i < offeredErc721ListLength; i++) {
                    IERC721(terms.offeredErc721s[i].erc721Address)
                        .safeTransferFrom(
                            address(this),
                            terms.seller,
                            terms.offeredErc721s[i].tokenId
                        );
                }
            }
            // Send back seller's ERC1155s
            uint256 offeredErc1155ListLength = terms.offeredErc1155s.length;
            if (offeredErc1155ListLength > 0) {
                for (uint256 i = 0; i < offeredErc1155ListLength; i++) {
                    IERC1155(terms.offeredErc1155s[i].erc1155Address)
                        .safeTransferFrom(
                            address(this),
                            terms.seller,
                            terms.offeredErc1155s[i].tokenId,
                            terms.offeredErc1155s[i].amount,
                            bytes("")
                        );
                }
            }
            // Send back seller's ERC20s
            uint256 offeredErc20ListLength = terms.offeredErc20s.length;
            if (offeredErc20ListLength > 0) {
                for (uint256 i = 0; i < offeredErc20ListLength; i++) {
                    IERC20(terms.offeredErc20s[i].erc20Address).transfer(
                        terms.seller,
                        terms.offeredErc20s[i].amount
                    );
                }
            }
        }

        if (terms.buyerMetTerms == true && terms.sellerMetTerms == false) {
            // Send back buyer's Eth
            if (terms.requestedEthAmount > 0) {
                payable(terms.buyer).transfer(terms.requestedEthAmount);
            }
            // Send back buyer's ERC721s
            uint256 requestedErc721ListLength = terms.requestedErc721s.length;
            if (requestedErc721ListLength > 0) {
                for (uint256 i = 0; i < requestedErc721ListLength; i++) {
                    IERC721(terms.requestedErc721s[i].erc721Address)
                        .safeTransferFrom(
                            address(this),
                            terms.buyer,
                            terms.requestedErc721s[i].tokenId
                        );
                }
            }
            // Send back buyer's ERC1155s
            uint256 requestedErc1155ListLength = terms.requestedErc1155s.length;
            if (requestedErc1155ListLength > 0) {
                for (uint256 i = 0; i < requestedErc1155ListLength; i++) {
                    IERC1155(terms.requestedErc1155s[i].erc1155Address)
                        .safeTransferFrom(
                            address(this),
                            terms.buyer,
                            terms.requestedErc1155s[i].tokenId,
                            terms.requestedErc1155s[i].amount,
                            bytes("")
                        );
                }
            }
            // Send back buyer's ERC20s
            uint256 requestedErc20ListLength = terms.requestedErc20s.length;
            if (requestedErc20ListLength > 0) {
                for (uint256 i = 0; i < requestedErc20ListLength; i++) {
                    IERC20(terms.requestedErc20s[i].erc20Address).transfer(
                        terms.buyer,
                        terms.requestedErc20s[i].amount
                    );
                }
            }
        }

        // Cancel and delete trade
        terms.tradeCanceled = true;
        emit Trade_Canceled(tradeId, terms.tradeCanceled);

        delete trades[tradeId];
    }

    // TRANFER ALL ASSETS TO RIGHTFUL OWNER AND COMPLETE THE TRADE
    function completeTrade(bytes32 tradeId) internal {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "Trade does not exist");
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

        if (terms.offeredEthAmount > 0) {
            payable(terms.buyer).transfer(terms.offeredEthAmount);
        }
        if (terms.requestedEthAmount > 0) {
            payable(terms.seller).transfer(terms.requestedEthAmount);
        }

        uint256 offeredErc721ListLength = terms.offeredErc721s.length;
        if (offeredErc721ListLength > 0) {
            for (uint256 i = 0; i < offeredErc721ListLength; i++) {
                IERC721(terms.offeredErc721s[i].erc721Address).safeTransferFrom(
                        address(this),
                        terms.buyer,
                        terms.offeredErc721s[i].tokenId
                    );
            }
        }

        uint256 requestedErc721ListLength = terms.requestedErc721s.length;
        if (requestedErc721ListLength > 0) {
            for (uint256 i = 0; i < requestedErc721ListLength; i++) {
                IERC721(terms.requestedErc721s[i].erc721Address)
                    .safeTransferFrom(
                        address(this),
                        terms.seller,
                        terms.requestedErc721s[i].tokenId
                    );
            }
        }

        uint256 offeredErc1155ListLength = terms.offeredErc1155s.length;
        if (offeredErc1155ListLength > 0) {
            for (uint256 i = 0; i < offeredErc1155ListLength; i++) {
                IERC1155(terms.offeredErc1155s[i].erc1155Address)
                    .safeTransferFrom(
                        address(this),
                        terms.buyer,
                        terms.offeredErc1155s[i].tokenId,
                        terms.offeredErc1155s[i].amount,
                        bytes("")
                    );
            }
        }

        uint256 requestedErc1155ListLength = terms.requestedErc1155s.length;
        if (requestedErc1155ListLength > 0) {
            for (uint256 i = 0; i < requestedErc1155ListLength; i++) {
                IERC1155(terms.requestedErc1155s[i].erc1155Address)
                    .safeTransferFrom(
                        address(this),
                        terms.seller,
                        terms.requestedErc1155s[i].tokenId,
                        terms.requestedErc1155s[i].amount,
                        bytes("")
                    );
            }
        }

        uint256 offeredErc20ListLength = terms.offeredErc20s.length;
        if (offeredErc20ListLength > 0) {
            for (uint256 i = 0; i < offeredErc20ListLength; i++) {
                IERC20(terms.offeredErc20s[i].erc20Address).transfer(
                    terms.buyer,
                    terms.offeredErc20s[i].amount
                );
            }
        }

        uint256 requestedErc20ListLength = terms.requestedErc20s.length;
        if (requestedErc20ListLength > 0) {
            for (uint256 i = 0; i < requestedErc20ListLength; i++) {
                IERC20(terms.requestedErc20s[i].erc20Address).transfer(
                    terms.seller,
                    terms.requestedErc20s[i].amount
                );
            }
        }

        terms.tradeCompleted = true;
        completedTrades[tradeId] = terms;
        emit Trade_Completed(tradeId, terms.tradeCompleted);

        delete trades[tradeId];
    }

    /** GET */
    // Generate tradeId
    function generateTradeId(address buyer) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, buyer, block.timestamp));
    }

    function getTerms(
        bytes32 tradeId
    )
        external
        view
        returns (
            address seller,
            address buyer,
            Erc721Details[] memory,
            Erc721Details[] memory,
            Erc1155Details[] memory,
            Erc1155Details[] memory,
            Erc20Details[] memory,
            Erc20Details[] memory,
            uint256 offeredEth,
            uint256 requestedEth
        )
    {
        Terms storage terms = trades[tradeId];
        return (
            terms.seller,
            terms.buyer,
            terms.offeredErc721s,
            terms.requestedErc721s,
            terms.offeredErc1155s,
            terms.requestedErc1155s,
            terms.offeredErc20s,
            terms.requestedErc20s,
            terms.offeredEthAmount,
            terms.requestedEthAmount
        );
    }
}
