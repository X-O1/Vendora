// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MOCKLINK, MOCKAAVE, MOCKUNI} from "../../src/mocks/MockERC20.sol";
import {MockNft1, MockNft2, MockNft3} from "../../src/mocks/MockERC721.sol";
import {MockResources1, MockResources2, MockResources3} from "../../src/mocks/MockERC1155.sol";

contract VendoraTest is Test {
    Vendora vendora;

    MOCKLINK public link;
    MOCKAAVE public aave;
    MOCKUNI public uni;
    address public linkAddress;
    address public aaveAddress;
    address public uniAddress;

    MockNft1 public mockNft1;
    MockNft2 public mockNft2;
    MockNft3 public mockNft3;
    address public mockNft1Address;
    address public mockNft2Address;
    address public mockNft3Address;

    MockResources1 public mockResources1;
    MockResources2 public mockResources2;
    MockResources3 public mockResources3;
    address public mockResources1Address;
    address public mockResources2Address;
    address public mockResources3Address;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");

    function setUp() external {
        DeployVendora deployVendora = new DeployVendora();
        vendora = deployVendora.run();

        link = new MOCKLINK();
        aave = new MOCKAAVE();
        uni = new MOCKUNI();

        mockNft1 = new MockNft1();
        mockNft2 = new MockNft2();
        mockNft3 = new MockNft3();

        mockResources1 = new MockResources1();
        mockResources2 = new MockResources2();
        mockResources3 = new MockResources3();
    }
}
