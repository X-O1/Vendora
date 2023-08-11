// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ERC721 Interface
interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);
}

// ERC20 Interface
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

contract NFTescrow {
    struct NFTDetails {
        address nftAddress;
        uint256 tokenId;
    }

    struct ERC20Payment {
        address tokenAddress;
        uint256 amount;
    }

    struct Trade {
        address seller;
        address buyer;
        NFTDetails[] nftsForSale;
        NFTDetails[] paymentNFTs;
        ERC20Payment[] erc20Payments;
        uint256 ethPrice;
        bool buyerApproved;
        bool sellerApproved;
    }

    mapping(bytes32 => Trade) public trades;

    function beginTrade(
        address buyer,
        address[] memory nftAddressesForSale,
        uint256[] memory tokenIdsForSale,
        address[] memory paymentNftAddresses,
        uint256[] memory paymentTokenIds,
        address[] memory paymentErc20Addresses,
        uint256[] memory paymentErc20Amounts,
        uint256 ethPrice
    ) external {
        require(
            nftAddressesForSale.length == tokenIdsForSale.length,
            "Mismatched arrays for NFTs for sale."
        );
        require(
            paymentNftAddresses.length == paymentTokenIds.length,
            "Mismatched arrays for payment NFTs."
        );
        require(
            paymentErc20Addresses.length == paymentErc20Amounts.length,
            "Mismatched ERC20 arrays."
        );

        bytes32 tradeId = keccak256(
            abi.encodePacked(
                msg.sender,
                buyer,
                nftAddressesForSale,
                tokenIdsForSale,
                paymentNftAddresses,
                paymentTokenIds,
                paymentErc20Addresses,
                paymentErc20Amounts,
                ethPrice
            )
        );

        NFTDetails[] memory nftsForSaleArray = new NFTDetails[](
            nftAddressesForSale.length
        );
        for (uint i = 0; i < nftAddressesForSale.length; i++) {
            nftsForSaleArray[i] = NFTDetails({
                nftAddress: nftAddressesForSale[i],
                tokenId: tokenIdsForSale[i]
            });
        }

        NFTDetails[] memory paymentNFTsArray = new NFTDetails[](
            paymentNftAddresses.length
        );
        for (uint i = 0; i < paymentNftAddresses.length; i++) {
            paymentNFTsArray[i] = NFTDetails({
                nftAddress: paymentNftAddresses[i],
                tokenId: paymentTokenIds[i]
            });
        }

        ERC20Payment[] memory erc20PaymentsArray = new ERC20Payment[](
            paymentErc20Addresses.length
        );
        for (uint i = 0; i < paymentErc20Addresses.length; i++) {
            erc20PaymentsArray[i] = ERC20Payment({
                tokenAddress: paymentErc20Addresses[i],
                amount: paymentErc20Amounts[i]
            });
        }

        trades[tradeId] = Trade({
            seller: msg.sender,
            buyer: buyer,
            nftsForSale: nftsForSaleArray,
            paymentNFTs: paymentNFTsArray,
            erc20Payments: erc20PaymentsArray,
            ethPrice: ethPrice,
            buyerApproved: false,
            sellerApproved: false
        });
    }

    function approveTrade(bytes32 tradeId) external payable {
        Trade storage trade = trades[tradeId];
        require(trade.seller != address(0), "Trade does not exist.");

        if (msg.sender == trade.buyer) {
            require(msg.value == trade.ethPrice, "Send the exact ETH amount.");

            for (uint i = 0; i < trade.paymentNFTs.length; i++) {
                require(
                    IERC721(trade.paymentNFTs[i].nftAddress).ownerOf(
                        trade.paymentNFTs[i].tokenId
                    ) == msg.sender,
                    "You don't own one or more payment NFTs."
                );
            }

            for (uint i = 0; i < trade.erc20Payments.length; i++) {
                require(
                    IERC20(trade.erc20Payments[i].tokenAddress).allowance(
                        msg.sender,
                        address(this)
                    ) >= trade.erc20Payments[i].amount,
                    "Insufficient token allowance."
                );
                require(
                    IERC20(trade.erc20Payments[i].tokenAddress).balanceOf(
                        msg.sender
                    ) >= trade.erc20Payments[i].amount,
                    "Insufficient token balance."
                );
            }

            trade.buyerApproved = true;
        }

        if (trade.buyerApproved && trade.sellerApproved) {
            for (uint i = 0; i < trade.nftsForSale.length; i++) {
                IERC721(trade.nftsForSale[i].nftAddress).transferFrom(
                    trade.seller,
                    trade.buyer,
                    trade.nftsForSale[i].tokenId
                );
            }

            for (uint i = 0; i < trade.paymentNFTs.length; i++) {
                IERC721(trade.paymentNFTs[i].nftAddress).transferFrom(
                    trade.buyer,
                    trade.seller,
                    trade.paymentNFTs[i].tokenId
                );
            }

            for (uint i = 0; i < trade.erc20Payments.length; i++) {
                IERC20(trade.erc20Payments[i].tokenAddress).transferFrom(
                    trade.buyer,
                    trade.seller,
                    trade.erc20Payments[i].amount
                );
            }

            payable(trade.seller).transfer(trade.ethPrice);

            delete trades[tradeId];
        }
    }
}
