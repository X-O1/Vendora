// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MOCKLINK, MOCKAAVE} from "../../src/mocks/MockERC20.sol";
import {MockNft1, MockNft2} from "../../src/mocks/MockERC721.sol";
import {MockResources1, MockResources2} from "../../src/mocks/MockERC1155.sol";

contract VendoraTest is Test {
    Vendora vendora;

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

    MOCKLINK public link;
    MOCKAAVE public aave;
    address public linkAddress = 0x2e234DAe75C793f67A35089C9d99245E1C58470b;
    address public aaveAddress = 0xF62849F9A0B5Bf2913b396098F7c7019b51A820a;

    MockNft1 public nft1;
    MockNft2 public nft2;
    address public nft1Address = 0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9;
    address public nft2Address = 0xc7183455a4C133Ae270771860664b6B7ec320bB1;

    MockResources1 public resources1;
    MockResources2 public resources2;
    address public resource1Address =
        0xa0Cb889707d426A7A386870A03bc70d1b0697598;
    address public resource2Address =
        0x1d1499e622D69689cdf9004d05Ec547d650Ff211;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");

    function setUp() external {
        DeployVendora deployVendora = new DeployVendora();
        vendora = deployVendora.run();

        vm.deal(SELLER, 10 ether);
        vm.deal(BUYER, 10 ether);

        link = new MOCKLINK();
        aave = new MOCKAAVE();

        nft1 = new MockNft1();
        nft2 = new MockNft2();

        resources1 = new MockResources1();
        resources2 = new MockResources2();
    }

    // function testStartingNewTrade() public {
    //     vm.prank(SELLER);
    //     vendora.startTrade(
    //         BUYER,
    //         [[nft1Address, 1]],
    //         [[nft2Address, 2]],
    //         [[resource1Address, 1, 10]],
    //         [[resource2Address, 2, 10]],
    //         [[linkAddress, 10]],
    //         [[aaveAddress, 10]],
    //         5 ether,
    //         5 ether
    //     );
    // }
}
