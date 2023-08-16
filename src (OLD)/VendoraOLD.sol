// // SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

// /** IMPORTS */
// import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract Vendora {
//     /** EVENTS */
//     event Terms_Set(bytes32 indexed tradeId);
//     event Seller_Assets_Confirmed(bool indexed sellerAssetsConfirmed);
//     event Buyer_Assets_Confirmed(bool indexed buyerAssetsConfirmed);
//     event All_Assets_Confirmed(
//         bool indexed sellerAssetsConfirmed,
//         bool indexed buyerAssetsConfirmed
//     );
//     event Seller_Met_Terms(bool indexed sellerMetTerms);
//     event Buyer_Met_Terms(bool indexed buyerMetTerms);
//     event All_Assets_Deposited(
//         bool indexed sellerMetTerms,
//         bool indexed buyerMetTerms
//     );
//     event Trade_Completed(bool indexed tradeCompleted);

//     /** STRUCTS */
//     struct NFTdetails {
//         address nftAddress;
//         uint256 tokenId;
//     }
//     struct ERC20details {
//         address erc20Address;
//         uint256 amount;
//     }

//     struct AssetDetails {
//         address[] nftAddresses;
//         uint256[] nftTokenIds;
//         address[] erc20Addresses;
//         uint256[] erc20Amounts;
//     }

//     struct Terms {
//         address seller;
//         address buyer;
//         NFTdetails[] offeredNFTs;
//         NFTdetails[] requestedNFTs;
//         ERC20details[] offeredERC20s;
//         ERC20details[] requestedERC20s;
//         uint256 offeredEthAmount;
//         uint256 requestedEthAmount;
//         bool sellerAssetsConfirmed;
//         bool buyerAssetsConfirmed;
//         bool sellerMetTerms;
//         bool buyerMetTerms;
//     }

//     /** MAPPINGS */
//     mapping(bytes32 => Terms) public trades;

//     /** FUNCTIONS */

//     // Generate trade id
//     // Generate trade id
//     function generateTradeId(
//         address buyer,
//         AssetDetails memory offeredAssets,
//         AssetDetails memory requestedAssets,
//         uint256 offeredEthAmountInTrade,
//         uint256 requestedEthAmountInTrade
//     ) internal view returns (bytes32) {
//         return
//             keccak256(
//                 abi.encodePacked(
//                     msg.sender,
//                     buyer,
//                     offeredAssets.nftAddresses,
//                     offeredAssets.nftTokenIds,
//                     requestedAssets.nftAddresses,
//                     requestedAssets.nftTokenIds,
//                     offeredAssets.erc20Addresses,
//                     offeredAssets.erc20Amounts,
//                     requestedAssets.erc20Addresses,
//                     requestedAssets.erc20Amounts,
//                     offeredEthAmountInTrade,
//                     requestedEthAmountInTrade
//                 )
//             );
//     }

//     function setTerms(
//         address buyer,
//         AssetDetails memory offeredAssets,
//         AssetDetails memory requestedAssets,
//         uint256 offeredEthAmountInTrade,
//         uint256 requestedEthAmountInTrade
//     ) external {
//         // validation checks
//         validateAssetDetails(offeredAssets);
//         validateAssetDetails(requestedAssets);

//         // Generate the trade ID
//         bytes32 tradeId = generateTradeId(
//             buyer,
//             offeredAssets,
//             requestedAssets,
//             offeredEthAmountInTrade,
//             requestedEthAmountInTrade
//         );

//         // Set Details
//         setDetails(tradeId, offeredAssets, true);
//         setDetails(tradeId, requestedAssets, false);

//         // Set other trade details
//         setTradeDetails(
//             tradeId,
//             buyer,
//             offeredEthAmountInTrade,
//             requestedEthAmountInTrade
//         );

//         emit Terms_Set(tradeId);
//     }

//     function setDetails(
//         bytes32 tradeId,
//         AssetDetails memory assets,
//         bool isOffered
//     ) internal {
//         setNFTDetails(
//             tradeId,
//             assets.nftAddresses,
//             assets.nftTokenIds,
//             isOffered
//         );
//         setERC20Details(
//             tradeId,
//             assets.erc20Addresses,
//             assets.erc20Amounts,
//             isOffered
//         );
//     }

//     function validateAssetDetails(AssetDetails memory assets) internal pure {
//         require(
//             assets.nftAddresses.length == assets.nftTokenIds.length,
//             "Amount of Nft addresses do not match amount of Nft token Ids"
//         );
//         require(
//             assets.erc20Addresses.length == assets.erc20Amounts.length,
//             "Number of ERC20 addresses given do not match number of ERC20 amounts given"
//         );
//     }

//     function setNFTDetails(
//         bytes32 tradeId,
//         address[] memory nftAddresses,
//         uint256[] memory nftTokenIds,
//         bool isOffered
//     ) internal {
//         NFTdetails[] storage nftDetailsStorage = isOffered
//             ? trades[tradeId].offeredNFTs
//             : trades[tradeId].requestedNFTs;
//         for (uint256 i = 0; i < nftAddresses.length; i++) {
//             NFTdetails memory newDetail = NFTdetails({
//                 nftAddress: nftAddresses[i],
//                 tokenId: nftTokenIds[i]
//             });
//             nftDetailsStorage.push(newDetail);
//         }
//     }

//     function setERC20Details(
//         bytes32 tradeId,
//         address[] memory erc20Addresses,
//         uint256[] memory erc20Amounts,
//         bool isOffered
//     ) internal {
//         ERC20details[] storage erc20DetailsStorage = isOffered
//             ? trades[tradeId].offeredERC20s
//             : trades[tradeId].requestedERC20s;
//         for (uint256 i = 0; i < erc20Addresses.length; i++) {
//             ERC20details memory newDetail = ERC20details({
//                 erc20Address: erc20Addresses[i],
//                 amount: erc20Amounts[i]
//             });
//             erc20DetailsStorage.push(newDetail);
//         }
//     }

//     function setTradeDetails(
//         bytes32 tradeId,
//         address buyer,
//         uint256 offeredEthAmount,
//         uint256 requestedEthAmount
//     ) internal {
//         trades[tradeId].seller = msg.sender;
//         trades[tradeId].buyer = buyer;
//         trades[tradeId].offeredEthAmount = offeredEthAmount;
//         trades[tradeId].requestedEthAmount = requestedEthAmount;
//         trades[tradeId].sellerAssetsConfirmed = false;
//         trades[tradeId].buyerAssetsConfirmed = false;
//         trades[tradeId].sellerMetTerms = false;
//         trades[tradeId].buyerMetTerms = false;
//     }

//     // Confirm users have all assets set in trade terms and approved them for transfer
//     function confirmUserOwnsAssets(bytes32 tradeId) external {
//         // Make sure trade exist
//         Terms storage terms = trades[tradeId];
//         require(terms.buyer != address(0), "This trade does not exist");

//         // Check if SELLER owns and approved contract to transfer offered assets.
//         if (msg.sender == terms.seller) {
//             // NFTs
//             for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
//                 require(
//                     IERC721(terms.offeredNFTs[i].nftAddress).ownerOf(
//                         terms.offeredNFTs[i].tokenId
//                     ) == terms.seller,
//                     "You do not own one or more NFTs offered in terms"
//                 );
//             }
//             for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
//                 require(
//                     IERC721(terms.offeredNFTs[i].nftAddress).getApproved(
//                         terms.offeredNFTs[i].tokenId
//                     ) == address(this),
//                     "One of more offered NFTs in terms have not been approved to transfer"
//                 );
//             }
//             // ERC20s
//             for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
//                 require(
//                     IERC20(terms.offeredERC20s[i].erc20Address).balanceOf(
//                         terms.seller
//                     ) >= terms.offeredERC20s[i].amount,
//                     "You do not own one or more amounts of ERC20s offered in terms"
//                 );
//             }
//             for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
//                 require(
//                     IERC20(terms.offeredERC20s[i].erc20Address).allowance(
//                         terms.seller,
//                         address(this)
//                     ) >= terms.offeredERC20s[i].amount,
//                     "You have not approved one or more amounts of ERC20s offered in terms"
//                 );
//             }
//             // ETH
//             require(
//                 terms.seller.balance >= terms.offeredEthAmount,
//                 "You do not own amount of ETH offered in terms"
//             );

//             terms.sellerAssetsConfirmed = true;
//             emit Seller_Assets_Confirmed(terms.sellerAssetsConfirmed);
//         }

//         // Check if BUYER owns and approved contract to transfer requested assets.
//         if (msg.sender == terms.buyer) {
//             // NFTs
//             for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
//                 require(
//                     IERC721(terms.requestedNFTs[i].nftAddress).ownerOf(
//                         terms.requestedNFTs[i].tokenId
//                     ) == msg.sender,
//                     "You do not own one or more NFTs requested in terms"
//                 );
//             }
//             for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
//                 require(
//                     IERC721(terms.requestedNFTs[i].nftAddress).getApproved(
//                         terms.requestedNFTs[i].tokenId
//                     ) == address(this),
//                     "One or more requested NFTs have not been approved to transfer"
//                 );
//             }
//             // ERC20s
//             for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
//                 require(
//                     IERC20(terms.requestedERC20s[i].erc20Address).balanceOf(
//                         terms.buyer
//                     ) >= terms.requestedERC20s[i].amount,
//                     "You do not own one or more amounts of ERC20s offeredx in terms"
//                 );
//             }
//             for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
//                 require(
//                     IERC20(terms.requestedERC20s[i].erc20Address).allowance(
//                         terms.buyer,
//                         address(this)
//                     ) >= terms.requestedERC20s[i].amount,
//                     "You have not approved one or more amounts of ERC20s offered in terms"
//                 );
//             }
//             // ETH
//             require(
//                 terms.buyer.balance >= terms.requestedEthAmount,
//                 "You do not own amount of ETH requested in trade terms"
//             );

//             terms.buyerAssetsConfirmed = true;
//             emit Buyer_Assets_Confirmed(terms.buyerAssetsConfirmed);
//         }
//         if (
//             terms.sellerAssetsConfirmed == true &&
//             terms.buyerAssetsConfirmed == true
//         ) {
//             emit All_Assets_Confirmed(
//                 terms.sellerAssetsConfirmed,
//                 terms.buyerAssetsConfirmed
//             );
//         }
//     }

//     // Deposit all assets then trasfer all to correct user
//     function completeTrade(bytes32 tradeId) external payable {
//         Terms storage terms = trades[tradeId];
//         require(terms.buyer != address(0), "This trade does not exist");

//         // Deposit
//         if (
//             terms.sellerAssetsConfirmed == true &&
//             terms.buyerAssetsConfirmed == true
//         ) {
//             // Deposit all OFFERED assets from SELLER to CONTRACT
//             // ETH
//             if (msg.sender == terms.seller) {
//                 if (terms.offeredEthAmount > 0) {
//                     require(
//                         msg.value == terms.offeredEthAmount,
//                         "Deposit exact amount set in terms"
//                     );
//                 }
//                 // NFTS
//                 for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
//                     IERC721(terms.offeredNFTs[i].nftAddress).safeTransferFrom(
//                         terms.seller,
//                         address(this),
//                         terms.offeredNFTs[i].tokenId
//                     );
//                 }
//                 // ERC20s
//                 for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
//                     IERC20(terms.offeredERC20s[i].erc20Address).transferFrom(
//                         terms.seller,
//                         address(this),
//                         terms.offeredERC20s[i].amount
//                     );
//                 }
//                 terms.sellerMetTerms = true;
//                 emit Seller_Met_Terms(terms.sellerMetTerms);
//             }
//             // Deposit all REQUESTED assets from BUYER to CONTRACT
//             // ETH
//             if (msg.sender == terms.buyer) {
//                 if (terms.requestedEthAmount > 0) {
//                     require(
//                         msg.value == terms.requestedEthAmount,
//                         "Deposit exact amount set in terms"
//                     );
//                 }
//                 // NFTS
//                 for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
//                     IERC721(terms.requestedNFTs[i].nftAddress).safeTransferFrom(
//                             terms.buyer,
//                             address(this),
//                             terms.requestedNFTs[i].tokenId
//                         );
//                 }
//                 // ERC20
//                 for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
//                     IERC20(terms.requestedERC20s[i].erc20Address).transferFrom(
//                         terms.buyer,
//                         address(this),
//                         terms.requestedERC20s[i].amount
//                     );
//                 }
//                 terms.buyerMetTerms = true;
//                 emit Buyer_Met_Terms(terms.buyerMetTerms);
//             }

//             if (terms.sellerMetTerms == true && terms.buyerMetTerms == true) {
//                 emit All_Assets_Deposited(
//                     terms.sellerMetTerms,
//                     terms.buyerMetTerms
//                 );

//                 // Send all assets to rightful owner based on terms and complete the trade
//                 // OFFERED assets from CONTRACT to BUYER.
//                 // ETH
//                 if (terms.offeredEthAmount > 0) {
//                     payable(terms.buyer).transfer(terms.offeredEthAmount);
//                 }

//                 // NFTS
//                 for (uint256 i = 0; i < terms.offeredNFTs.length; i++) {
//                     IERC721(terms.offeredNFTs[i].nftAddress).safeTransferFrom(
//                         address(this),
//                         terms.buyer,
//                         terms.offeredNFTs[i].tokenId
//                     );
//                 }
//                 // ERC20s
//                 for (uint256 i = 0; i < terms.offeredERC20s.length; i++) {
//                     IERC20(terms.offeredERC20s[i].erc20Address).transferFrom(
//                         address(this),
//                         terms.buyer,
//                         terms.offeredERC20s[i].amount
//                     );
//                 }

//                 // REQUESTED assets from CONTRACT to SELLER
//                 // ETH
//                 if (terms.requestedEthAmount > 0) {
//                     payable(terms.seller).transfer(terms.requestedEthAmount);
//                 }
//                 // NFTS
//                 for (uint256 i = 0; i < terms.requestedNFTs.length; i++) {
//                     IERC721(terms.requestedNFTs[i].nftAddress).safeTransferFrom(
//                             address(this),
//                             terms.seller,
//                             terms.requestedNFTs[i].tokenId
//                         );
//                 }
//                 // ERC20
//                 for (uint256 i = 0; i < terms.requestedERC20s.length; i++) {
//                     IERC20(terms.requestedERC20s[i].erc20Address).transferFrom(
//                         address(this),
//                         terms.seller,
//                         terms.requestedERC20s[i].amount
//                     );
//                 }
//             }
//         }
//     }
// }
