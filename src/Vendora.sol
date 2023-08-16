// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/** IMPORTS */
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vendora {
    /** STRUCTS */
    struct NftDetails {
        address nftAddress;
        uint256 tokenId;
    }
    struct Erc20Details {
        address erc20Address;
        uint256 amount;
    }
    struct AssetDetails {
        address[] nftAddresses;
        uint256[] nftTokenIds;
        address[] erc20Addresses;
        uint256[] erc20Amounts;
        uint256[] ethAmounts;
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

    /** FUNCTIONS */

    // Generate a tradeId
    function generateTradeId(address buyer) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, buyer, block.timestamp));
    }

    function startTrade(address buyer) external returns (bytes32 tradeId) {
        bytes32 tradeId = generateTradeId(buyer);

        trades[tradeId].seller = msg.sender;
        trades[tradeId].buyer = buyer;
        trades[tradeId].sellerReady = false;
        trades[tradeId].buyerReady = false;
        trades[tradeId].sellerMetTerms = false;
        trades[tradeId].buyerMetTerms = false;
        trades[tradeId].tradeCompleted = false;
    }

    function addErc721(
        bytes32 tradeId,
        address nftAddress,
        uint256 tokenId,
        bool offeringAsset
    ) external {
        Terms storage terms = trades[tradeId];
        require(terms.buyer != address(0), "This trade does not exist");
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
        require(ethAmount > 0, "Invalid eth amount, must be greater than zero");

        offeringAsset
            ? terms.offeredEthAmount = ethAmount
            : terms.requestedEthAmount = ethAmount;
    }

    /** GET FUNCTIONS */
    function getOfferedNfts(
        bytes32 tradeId
    ) external view returns (NftDetails[] memory) {
        Terms storage terms = trades[tradeId];
        return terms.offeredNfts;
    }

    function getRequestedNfts(
        bytes32 tradeId
    ) external view returns (NftDetails[] memory) {
        Terms storage terms = trades[tradeId];
        return terms.requestedNfts;
    }
}
