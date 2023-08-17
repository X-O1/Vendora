// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/** IMPORTS */
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vendora {
    /** EVENTS */
    event Trade_Started(bytes32 indexed tradeId);
    event Seller_Ready(bool indexed sellerReady);
    event Buyer_Ready(bool indexed buyerReady);
    event Seller_Met_Terms(bool indexed sellerMetTerms);
    event Buyer_Met_Terms(bool indexed buyerMetTerms);
    event Trade_Completed(bool indexed tradeCompleted);

    /** STRUCTS */
    struct NftDetails {
        address nftAddress;
        uint256 tokenId;
    }
    struct Erc20Details {
        address erc20Address;
        uint256 amount;
    }

    struct Terms {
        address seller;
        address buyer;
        NftDetails[] offeredNfts;
        NftDetails[] requestedNfts;
        Erc20Details[] offeredErc20s;
        Erc20Details[] requestedErc20s;
        uint256 offeredEthAmount;
        uint256 requestedEthAmount;
        bool sellerReady;
        bool buyerReady;
        bool sellerMetTerms;
        bool buyerMetTerms;
        bool tradeCompleted;
    }
    /** MAPPINGS */
    mapping(bytes32 => Terms) public trades;

    // Generate a tradeId
    function generateTradeId(address buyer) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, buyer, block.timestamp));
    }

    // START NEW TRADE
    function startTrade(address buyer) external returns (bytes32) {
        bytes32 tradeId = generateTradeId(buyer);
        Terms storage terms = trades[tradeId];

        terms.seller = msg.sender;
        terms.buyer = buyer;
        terms.sellerReady = false;
        terms.buyerReady = false;
        terms.sellerMetTerms = false;
        terms.buyerMetTerms = false;
        terms.tradeCompleted = false;

        emit Trade_Started(tradeId);

        return tradeId;
    }

    // ADD ASSETS TO TRADE TERMS
    function addErc721(
        bytes32 tradeId,
        address nftAddress,
        uint256 tokenId,
        bool offeringAsset
    ) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(
            msg.sender == terms.seller,
            "Only seller can add assets to terms"
        );
        require(nftAddress != address(0), "Invalid address");
        require(tokenId > 0, "Invalid token id");

        offeringAsset
            ? terms.offeredNfts.push(
                NftDetails({nftAddress: nftAddress, tokenId: tokenId})
            )
            : terms.requestedNfts.push(
                NftDetails({nftAddress: nftAddress, tokenId: tokenId})
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

        offeringAsset
            ? terms.offeredEthAmount = ethAmount
            : terms.requestedEthAmount = ethAmount;
    }

    // VERIFY BOTH PARTIES HAVE ASSETS SET IN TERMS
    function verifyUserAssets(bytes32 tradeId) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a memeber in this trade"
        );

        if (msg.sender == terms.seller) {
            // Check if seller has same amount of eth offered in terms
            if (terms.offeredEthAmount > 0) {
                require(
                    terms.seller.balance >= terms.offeredEthAmount,
                    "You do not hold amount of eth set in terms"
                );
            }

            // Check if seller has same NFTs(ERC721) offered in terms and approved them for transfer
            uint256 offeredNftListLength = terms.offeredNfts.length;
            if (offeredNftListLength > 0) {
                for (uint256 i = 0; i < offeredNftListLength; i++) {
                    require(
                        IERC721(terms.offeredNfts[i].nftAddress).ownerOf(
                            terms.offeredNfts[i].tokenId
                        ) == terms.seller,
                        "You do not own one of more NFTs set in terms"
                    );

                    require(
                        IERC721(terms.offeredNfts[i].nftAddress).getApproved(
                            terms.offeredNfts[i].tokenId
                        ) == address(this),
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
            emit Seller_Ready(terms.sellerReady);
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
            uint256 requestedNftListLength = terms.requestedNfts.length;
            if (requestedNftListLength > 0) {
                for (uint256 i = 0; i < requestedNftListLength; i++) {
                    require(
                        IERC721(terms.requestedNfts[i].nftAddress).ownerOf(
                            terms.requestedNfts[i].tokenId
                        ) == terms.buyer,
                        "You do not own one of more NFTs set in terms"
                    );

                    require(
                        IERC721(terms.requestedNfts[i].nftAddress).getApproved(
                            terms.requestedNfts[i].tokenId
                        ) == address(this),
                        "One of more Nfts have not been approved for transfer"
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
            emit Buyer_Ready(terms.buyerReady);
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
        require(
            terms.sellerReady == true && terms.buyerReady == true,
            "Buyer and Seller are not ready to complete trade"
        );

        if (msg.sender == terms.seller) {
            if (terms.offeredEthAmount > 0) {
                require(
                    msg.value == terms.offeredEthAmount,
                    "Send exact amount of ETH set in terms"
                );
            }

            uint256 offeredNftListLength = terms.offeredNfts.length;
            if (offeredNftListLength > 0) {
                for (uint256 i = 0; i < offeredNftListLength; i++) {
                    IERC721(terms.offeredNfts[i].nftAddress).safeTransferFrom(
                        terms.seller,
                        address(this),
                        terms.offeredNfts[i].tokenId
                    );
                }
            }

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
            emit Seller_Met_Terms(terms.sellerMetTerms);
        }

        if (msg.sender == terms.buyer) {
            if (terms.requestedEthAmount > 0) {
                require(
                    msg.value == terms.requestedEthAmount,
                    "Send exact amount of ETH set in terms"
                );
            }

            uint256 requestedNftListLength = terms.requestedNfts.length;
            if (requestedNftListLength > 0) {
                for (uint256 i = 0; i < requestedNftListLength; i++) {
                    IERC721(terms.requestedNfts[i].nftAddress).safeTransferFrom(
                            terms.buyer,
                            address(this),
                            terms.requestedNfts[i].tokenId
                        );
                }
            }

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
            emit Buyer_Met_Terms(terms.buyerMetTerms);
        }
        if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
            Vendora.completeTrade(tradeId);
        }
    }

    // TRANFER ALL ASSETS TO RIGHTFUL OWNER AND COMPLETE THE TRADE
    function completeTrade(bytes32 tradeId) internal {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "Trade does not exist");
        require(
            msg.sender == terms.seller || msg.sender == terms.buyer,
            "Not a member of this trade"
        );
        require(
            terms.sellerMetTerms == true && terms.buyerMetTerms == true,
            "All assets must be deposited to complete the trade"
        );

        if (terms.offeredEthAmount > 0) {
            payable(terms.buyer).transfer(terms.offeredEthAmount);
        }
        if (terms.requestedEthAmount > 0) {
            payable(terms.seller).transfer(terms.requestedEthAmount);
        }

        uint256 offeredNftListLength = terms.offeredNfts.length;
        if (offeredNftListLength > 0) {
            for (uint256 i = 0; i < offeredNftListLength; i++) {
                IERC721(terms.offeredNfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    terms.buyer,
                    terms.offeredNfts[i].tokenId
                );
            }
        }

        uint256 requestedNftListLength = terms.requestedNfts.length;
        if (requestedNftListLength > 0) {
            for (uint256 i = 0; i < requestedNftListLength; i++) {
                IERC721(terms.requestedNfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    terms.seller,
                    terms.requestedNfts[i].tokenId
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
        emit Trade_Completed(terms.tradeCompleted);

        delete trades[tradeId];
    }
}
