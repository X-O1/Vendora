// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

contract VendoraTest is Test {
    Vendora vendora;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");
    address USER3 = makeAddr("user3");
    address USER4 = makeAddr("user4");
    address public linkAddress = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
    address public aaveAddress = 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9;
    address public uniAddress = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
    bytes32 LINK =
        0x4c494e4b00000000000000000000000000000000000000000000000000000000;
    bytes32 AAVE =
        0x4141415645000000000000000000000000000000000000000000000000000000;
    bytes32 UNI =
        0x554E490000000000000000000000000000000000000000000000000000000000;

    function setUp() external {
        DeployVendora deployVendora = new DeployVendora();
        vendora = deployVendora.run();
    }

    // Test Whitelisting tokens
    function testWhitelistERC20Tokens() public {
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(LINK, linkAddress);
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(AAVE, aaveAddress);
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(UNI, uniAddress);

        assertEq(vendora.getWhitelistedERC20Tokens(LINK), linkAddress);
        assertEq(vendora.getWhitelistedERC20Tokens(AAVE), aaveAddress);
        assertEq(vendora.getWhitelistedERC20Tokens(UNI), uniAddress);
    }
}
