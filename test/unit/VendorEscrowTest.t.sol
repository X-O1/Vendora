// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {VendoraEscrow} from "../../src/VendoraEscrow.sol";
import {DeployVendoraEscrow} from "../../script/DeployVendoraEscrow.s.sol";

contract VendoraEscrowTest is Test {
    VendoraEscrow vendoraEscrow;

    address INITIATOR = makeAddr("user");
    address FINALIZER = makeAddr("user2");
    address USER3 = makeAddr("user3");
    address USER4 = makeAddr("user4");

    function setUp() external {
        DeployVendoraEscrow deployVendoraEscrow = new DeployVendoraEscrow();
        vendoraEscrow = deployVendoraEscrow.run();
    }

    function testInitiatorCanOnlyBeSetOnce() public {
        vm.prank(INITIATOR);
        vendoraEscrow.setSeller();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setSeller();
    }

    function testInitiatorAddressIsSetToMsgSenderAddress() public {
        vm.prank(INITIATOR);
        vendoraEscrow.setSeller();
        assert(vendoraEscrow.getSellerAddress() == INITIATOR);
    }

    function testInitiatorCantBeSetIfTradeIsLive() public {
        vm.prank(INITIATOR);
        vendoraEscrow.setSeller();
        vm.prank(INITIATOR);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setSeller();
    }

    function testFinalizerCanOnlyBeSetOnce() public {
        vm.prank(INITIATOR);
        vendoraEscrow.setSeller();
        vm.prank(INITIATOR);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(FINALIZER);
        vendoraEscrow.setBuyer();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setBuyer();
    }

    function testFinalizerAddressIsSetToMsgSenderAddress() public {
        vm.prank(INITIATOR);
        vendoraEscrow.setSeller();
        vm.prank(INITIATOR);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(FINALIZER);
        vendoraEscrow.setBuyer();
        assert(vendoraEscrow.getBuyerAddress() == FINALIZER);
    }

    function testFinalizerCanOnlyBeSetAfterInitiatorIsSet() public {
        vm.prank(FINALIZER);
        vm.expectRevert();
        vendoraEscrow.setBuyer();
    }
}
