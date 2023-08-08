// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MOCKLINK, MOCKAAVE, MOCKUNI} from "../../src/mocks/MockERC20.sol";

contract VendoraTest is Test {
    Vendora vendora;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");
    address USER3 = makeAddr("user3");
    address USER4 = makeAddr("user4");
    address public LINK = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
    address public AAVE = 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9;
    address public UNI = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;

    MOCKLINK public link;
    address public linkAddress = 0x2e234DAe75C793f67A35089C9d99245E1C58470b;
    uint256 public tokenAmount = 10e18;

    function setUp() external {
        DeployVendora deployVendora = new DeployVendora();
        vendora = deployVendora.run();

        link = new MOCKLINK();
    }

    // Test Whitelisting tokens
    function testWhitelistERC20Tokens() public {
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(LINK);
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(AAVE);
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(UNI);
        vm.prank(vendora.getOwner());
        vendora.deleteWhitelistERC20(UNI);
        vm.prank(vendora.getOwner());
        vendora.whitelistERC20(linkAddress);

        assertEq(vendora.getWhitelistedERC20Tokens(LINK), true);
        assertEq(vendora.getWhitelistedERC20Tokens(AAVE), true);
        assertEq(vendora.getWhitelistedERC20Tokens(UNI), false);
        assertEq(vendora.getWhitelistedERC20Tokens(linkAddress), true);
    }
}
