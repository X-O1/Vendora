// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MOCKLINK, MOCKAAVE} from "../../src/mocks/MockERC20.sol";
import {MockNft1, MockNft2} from "../../src/mocks/MockERC721.sol";
import {MockResources1, MockResources2} from "../../src/mocks/MockERC1155.sol";

contract VendoraTest is Test {
    Vendora vendora;

    MOCKLINK public link;
    MOCKAAVE public aave;
    address public linkAddress;
    address public aaveAddress;

    MockNft1 public mockNft1;
    MockNft2 public mockNft2;
    address public mockNft1Address;
    address public mockNft2Address;

    MockResources1 public mockResources1;
    MockResources2 public mockResources2;
    address public mockResources1Address;
    address public mockResources2Address;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");

    function setUp() external {
        DeployVendora deployVendora = new DeployVendora();
        vendora = deployVendora.run();

        vm.deal(SELLER, 10 ether);
        vm.deal(BUYER, 10 ether);

        link = new MOCKLINK();
        aave = new MOCKAAVE();

        mockNft1 = new MockNft1();
        mockNft2 = new MockNft2();

        mockResources1 = new MockResources1();
        mockResources2 = new MockResources2();
    }

    function testStartingNewTrade() public {
        vm.prank(SELLER);
        // vendora.startTrade(BUYER);
    }
}
