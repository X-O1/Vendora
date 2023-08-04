// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {VendoraEscrow} from "../../src/VendoraEscrow.sol";
import {DeployVendoraEscrow} from "../../script/DeployVendoraEscrow.s.sol";

contract VendoraEscrowTest is Test {
    VendoraEscrow vendoraEscrow;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");
    address USER3 = makeAddr("user3");
    address USER4 = makeAddr("user4");

    function setUp() external {
        DeployVendoraEscrow deployVendoraEscrow = new DeployVendoraEscrow();
        vendoraEscrow = deployVendoraEscrow.run();
    }

    function testSellerCanOnlyBeSetOnce() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setSeller();
    }

    function testSellerAddressIsSetToMsgSenderAddress() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        assert(vendoraEscrow.getSellerAddress() == SELLER);
    }

    function testSellerCantBeSetIfTradeIsLive() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setSeller();
    }

    function testBuyerCanOnlyBeSetOnce() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setBuyer();
    }

    function testBuyerAddressIsSetToMsgSenderAddress() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        assert(vendoraEscrow.getBuyerAddress() == BUYER);
    }

    function testBuyerCanOnlyBeSetAfterInitiatorIsSet() public {
        vm.prank(BUYER);
        vm.expectRevert();
        vendoraEscrow.setBuyer();
    }
}
