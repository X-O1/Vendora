// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vendora {
    struct NFTdetails {
        address nftAddress;
        uint256 tokenId;
    }
    struct ERC20details {
        address erc20Address;
        uint256 amount;
    }

    struct Terms {
        address seller;
        address buyer;
        NFTdetails[] offeredNFTs;
        NFTdetails[] requestedNFTs;
        ERC20details[] offeredERC20s;
        ERC20details[] requestedERC20s;
        uint256 offeredEthAmount;
        uint256 requestedEthAmount;
        bool sellerMetTerms;
        bool buyerMetTerms;
        bool tradeCompleted;
    }

    mapping(bytes32 => Terms) public trades;

    function setTerms(
        address buyer,
        address[] memory offeredNftAddresses,
        uint256[] memory offeredNftTokenIds,
        address[] memory requestedNftAddresses,
        uint256[] memory requestedNftTokenIds,
        address[] memory offeredERC20Addresses,
        uint256[] memory offeredERC20Amounts,
        address[] memory requestedERC20Addresses,
        uint256[] memory requestedERC20Amounts,
        uint256 offeredEthAmountInTrade,
        uint256 requestedEthAmountInTrade
    ) external {
        require(
            offeredNftAddresses.length == offeredNftTokenIds.length,
            "Unmatched amount of offered Nft addresses and token Ids"
        );
        require(
            requestedNftAddresses.length == requestedNftTokenIds.length,
            "Unmatched amount of requested Nft addresses and token Ids"
        );
        require(
            offeredERC20Addresses.length == offeredERC20Amounts.length,
            "Unmatched amount of offered ERC20 addresses and amounts"
        );
        require(
            requestedERC20Addresses.length == requestedERC20Amounts.length,
            "Unmatched amount of requested ERC20 addresses and amounts"
        );

        // Create a unique trade id for the trade and its terms
        bytes32 tradeId = keccak256(
            abi.encodePacked(
                msg.sender,
                buyer,
                offeredNftAddresses,
                offeredNftTokenIds,
                requestedNftAddresses,
                requestedNftTokenIds,
                offeredERC20Addresses,
                offeredERC20Amounts,
                requestedERC20Addresses,
                requestedERC20Amounts,
                offeredEthAmountInTrade,
                requestedEthAmountInTrade
            )
        );

        NFTdetails[] memory offeredNFTsList = new NFTdetails[](
            offeredNftAddresses.length
        );
        for (uint256 i = 0; i < offeredERC20Addresses.length; i++) {
            offeredNFTsList[i] = NFTdetails({
                nftAddress: offeredNftAddresses[i],
                tokenId: offeredNftTokenIds[i]
            });
        }

        NFTdetails[] memory requestedNFTsList = new NFTdetails[](
            requestedNftAddresses.length
        );
        for (uint256 i = 0; i < requestedNftAddresses.length; i++) {
            requestedNFTsList[i] = NFTdetails({
                nftAddress: requestedNftAddresses[i],
                tokenId: requestedNftTokenIds[i]
            });
        }

        ERC20details[] memory offeredERC20sList = new ERC20details[](
            offeredERC20Addresses.length
        );
        for (uint256 i = 0; i < offeredERC20Addresses.length; i++) {
            offeredERC20sList[i] = ERC20details({
                erc20Address: offeredERC20Addresses[i],
                amount: offeredERC20Amounts[i]
            });
        }

        ERC20details[] memory requestedERC20sList = new ERC20details[](
            requestedERC20Addresses.length
        );
        for (uint256 i = 0; i < requestedERC20Addresses.length; i++) {
            requestedERC20sList[i] = ERC20details({
                erc20Address: requestedERC20Addresses[i],
                amount: requestedERC20Amounts[i]
            });
        }

        trades[tradeId] = Terms({
            seller: msg.sender,
            buyer: buyer,
            offeredNFTs: offeredNFTsList,
            requestedNFTs: requestedNFTsList,
            offeredERC20s: offeredERC20sList,
            requestedERC20s: requestedERC20sList,
            offeredEthAmount: offeredEthAmountInTrade,
            requestedEthAmount: requestedEthAmountInTrade,
            sellerMetTerms: false,
            buyerMetTerms: false,
            tradeCompleted: false
        });
    }

    function approveTrade(bytes32 tradeId) external payable {
        // Make sure trade exist
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");

        // Check if SELLER owns and approved contract to transfer offered assets.
        if (msg.sender == terms.seller) {
            // ETH
            if (terms.offeredEthAmount > 0) {
                require(
                    msg.value == terms.offeredEthAmount,
                    "Deposit exact amount set in terms"
                );
            }
            // NFTs
            for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
                require(
                    IERC721(terms.offeredNFTs[i].nftAddress).ownerOf(
                        terms.offeredNFTs[i].tokenId
                    ) == terms.seller,
                    "You do not own one or more NFTs offered in terms"
                );
            }
            for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
                require(
                    IERC721(terms.offeredNFTs[i].nftAddress).getApproved(
                        terms.offeredNFTs[i].tokenId
                    ) == address(this),
                    "One of more offered NFTs in terms have not been approved to transfer"
                );
            }
            // ERC20s
            for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
                require(
                    IERC20(terms.offeredERC20s[i].erc20Address).balanceOf(
                        terms.seller
                    ) >= terms.offeredERC20s[i].amount,
                    "You do not own one or more amounts of ERC20s offered in terms"
                );
            }
            for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
                require(
                    IERC20(terms.offeredERC20s[i].erc20Address).allowance(
                        terms.seller,
                        address(this)
                    ) >= terms.offeredERC20s[i].amount,
                    "You have not approved one or more amounts of ERC20s offered in terms"
                );
            }
            // ETH
            require(
                terms.seller.balance >= terms.offeredEthAmount,
                "You do not own amount of ETH offered in terms"
            );

            terms.sellerMetTerms = true;
        }

        // Check if BUYER owns and approved contract to transfer requested assets.
        if (msg.sender == terms.buyer) {
            // ETH
            if (terms.requestedEthAmount > 0) {
                require(
                    msg.value == terms.requestedEthAmount,
                    "Deposit exact amount set in terms"
                );
            }
            // NFTs
            for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
                require(
                    IERC721(terms.requestedNFTs[i].nftAddress).ownerOf(
                        terms.requestedNFTs[i].tokenId
                    ) == msg.sender,
                    "You do not own one or more NFTs requested in terms"
                );
            }
            for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
                require(
                    IERC721(terms.requestedNFTs[i].nftAddress).getApproved(
                        terms.requestedNFTs[i].tokenId
                    ) == address(this),
                    "One or more requested NFTs have not been approved to transfer"
                );
            }
            // ERC20s
            for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
                require(
                    IERC20(terms.requestedERC20s[i].erc20Address).balanceOf(
                        terms.buyer
                    ) >= terms.requestedERC20s[i].amount,
                    "You do not own one or more amounts of ERC20s offered in terms"
                );
            }
            for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
                require(
                    IERC20(terms.requestedERC20s[i].erc20Address).allowance(
                        terms.buyer,
                        address(this)
                    ) >= terms.requestedERC20s[i].amount,
                    "You have not approved one or more amounts of ERC20s offered in terms"
                );
            }
            // ETH
            require(
                terms.buyer.balance >= terms.requestedEthAmount,
                "You do not own amount of ETH requested in trade terms"
            );

            terms.buyerMetTerms = true;
        }

        if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
            Vendora.completeTrade(tradeId);
        }
    }

    // Transfer all assets to escrow contract
    function completeTrade(bytes32 tradeId) internal {
        Terms storage terms = trades[tradeId];

        if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
            // Transfer all OFFERED assets from SELLER to CONTRACT and then send to BUYER.

            // ETH
            payable(terms.seller).transfer(terms.requestedEthAmount);
            // NFTS
            for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
                IERC721(terms.offeredNFTs[i].nftAddress).safeTransferFrom(
                    terms.seller,
                    address(this),
                    terms.offeredNFTs[i].tokenId
                );

                IERC721(terms.offeredNFTs[i].nftAddress).safeTransferFrom(
                    address(this),
                    terms.buyer,
                    terms.offeredNFTs[i].tokenId
                );
            }
            // ERC20s
            for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
                IERC20(terms.offeredERC20s[i].erc20Address).transferFrom(
                    terms.seller,
                    address(this),
                    terms.offeredERC20s[i].amount
                );
                IERC20(terms.offeredERC20s[i].erc20Address).transferFrom(
                    address(this),
                    terms.buyer,
                    terms.offeredERC20s[i].amount
                );
            }

            // Transfer all REQUESTED assets from BUYER to CONTRACT and then send to SELLER

            // ETH
            payable(terms.buyer).transfer(terms.offeredEthAmount);
            // NFTS
            for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
                IERC721(terms.requestedNFTs[i].nftAddress).safeTransferFrom(
                    terms.buyer,
                    address(this),
                    terms.requestedNFTs[i].tokenId
                );
                IERC721(terms.requestedNFTs[i].nftAddress).safeTransferFrom(
                    address(this),
                    terms.seller,
                    terms.requestedNFTs[i].tokenId
                );
            }
            // ERC20
            for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
                IERC20(terms.requestedERC20s[i].erc20Address).transferFrom(
                    terms.buyer,
                    address(this),
                    terms.requestedERC20s[i].amount
                );
                IERC20(terms.requestedERC20s[i].erc20Address).transferFrom(
                    address(this),
                    terms.seller,
                    terms.requestedERC20s[i].amount
                );
            }
            terms.tradeCompleted = true;
        }

        if (terms.tradeCompleted) {
            // Transfer all requested assets in contract to seller
            // ETH
            // NFTs
            // Transfer all offered assets in contract to buyer
        }
    }

    // GET FUNCTIONS

    function getTerms(bytes32 tradeId) external view returns (Terms memory) {
        return trades[tradeId];
    }
}
