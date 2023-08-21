# Vendora

## Overview

Vendora is a peer-to-peer, over-the-counter trade facilitator for digital assets including ETH, ERC721s (NFTs), ERC1155s, and ERC20 tokens. The contract ensures trades are properly validated, terms are finalized, and assets are correctly deposited before completing any trade. The contract also offers the option to cancel a trade provided certain conditions are met.

## Features

- Create and finalize trade terms.
- Secure deposit of assets (ETH, ERC721, ERC1155, and ERC20) ensuring all trade conditions are satisfied before execution.
- Cancel trades under certain conditions, ensuring the rightful return of assets.
- Atomically complete trades, transferring all assets to their rightful owners.
- Generate unique trade IDs.
- Helper functions to validate, deposit, and transfer assets.

## Main Functions

### 1. `createAndFinalizeTrade`
Allows users to create a new trade by setting the terms which include the assets to be exchanged. The function ensures the trade is unique and finalizes the terms.

### 2. `cancelAndDeleteTrade`
Allows either the buyer or seller to cancel a trade if specific conditions are met. If one party has already met their terms but the other hasn't, the assets of the party that met the terms are returned.

### 3. `completeTrade`
Executes the trade, transferring assets to the respective parties. This function is internal and is called once all conditions for a trade are satisfied.

### 4. `generateTradeId`
Generates a unique trade ID based on the seller, buyer, and timestamp.

## Helper Functions

- **Erc721 Related**: 
  - `_addErc721Details`: Validates and adds details for ERC721 assets.
  - `_verifyUserErc721`: Verifies the user owns and has approved the ERC721 tokens for transfer.
  - `_depositErc721`: Transfers ERC721 tokens to the contract.
  - `_sendErc721`: Sends ERC721 tokens to a specified user.

- **Erc1155 Related**:
  - `_addErc1155Details`: Validates and adds details for ERC1155 assets.
  - `_verifyUserErc1155`: Verifies the user owns and has approved the ERC1155 tokens for transfer.
  - `_depositErc1155`: Transfers ERC1155 tokens to the contract.
  - `_sendErc1155`: Sends ERC1155 tokens to a specified user.

- **Erc20 Related**:
  - `_addErc20Details`: Validates and adds details for ERC20 tokens.
  - `_verifyErc20`: Verifies the user owns and has approved the ERC20 tokens for transfer.
  - `_depositErc20`: Transfers ERC20 tokens to the contract.
  - `_sendErc20`: Sends ERC20 tokens to a specified user.

## Requirements & Recommendations

- Before finalizing a trade, users should ensure they've approved the contract to transfer their ERC721, ERC1155, and ERC20 assets.
- Users should ensure all details provided (e.g., token addresses, token IDs, amounts) are accurate to prevent potential loss of assets.
- For safety, users are recommended to double-check the trade details and confirm the addresses of both parties before finalizing any trade.
- Trades can be canceled under specific conditions; users should understand these conditions before initiating a trade.
  
## Dependencies

The contract interfaces with standard Ethereum token contracts:
- ERC721
- ERC1155
- ERC20

## Events

- `Trade_Initiated`: Emits when a new trade is initiated.
- `Trade_TermsAdded`: Emits when terms are added to an existing trade.
- `Trade_Finalized`: Emits when a trade is finalized by both parties.
- `Seller_AssetsDeposited`: Emits when the seller's assets are deposited.
- `Buyer_AssetsDeposited`: Emits when the buyer's assets are deposited.
- `Trade_Completed`: Emits when a trade is successfully completed.
- `Trade_Canceled`: Emits when a trade is successfully canceled.

## Conclusion

The OTC market's outdated methods have exposed us to undue risk, fraud and untrustworthy individuals who don’t keep their word after terms are met. Vendora changes this. With smart contract technology, we cut out the unreliable middlemen and remove chances of deceit. If terms are met, the deal is sealed. No exceptions. Welcome to the gold standard of OTC trading. 
