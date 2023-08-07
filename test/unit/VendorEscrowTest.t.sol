// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {VendoraEscrow} from "../../src/VendoraEscrow.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendoraEscrow} from "../../script/DeployVendoraEscrow.s.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

contract VendoraEscrowTest is Test {
    VendoraEscrow vendoraEscrow;
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

    // MockERC20 public link;
    // MockERC20 public aave;
    // MockERC20 public uni;
    // uint256 public tokenAmount = 10e18;

    function setUp() external {
        DeployVendoraEscrow deployVendoraEscrow = new DeployVendoraEscrow();
        vendoraEscrow = deployVendoraEscrow.run();

        DeployVendora deployVendora = new DeployVendora();
        vendora = deployVendora.run();

        // link = new MockERC20();
        // aave = new MockERC20();
        // uni = new MockERC20();
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

    // TEST CREATING TERMS OF THE TRADE
    function testRequestERC20DateStructure() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 200);
        uint256 amount = vendoraEscrow.getRequestedERC20Tokens(SELLER, LINK);

        assertEq(amount, 200);
    }

    function testDeleteRequestedERC20DateStructure() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 200);
        vendoraEscrow.getRequestedERC20Tokens(SELLER, LINK);
        vm.prank(SELLER);
        vendoraEscrow.deleteRequestedERC20(LINK, 50);
        uint256 amount = vendoraEscrow.getRequestedERC20Tokens(SELLER, LINK);

        assertEq(amount, 150);
    }

    function testOfferERC20DateStructure() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(LINK, 200);
        uint256 amount = vendoraEscrow.getOfferedERC20Tokens(SELLER, LINK);

        assertEq(amount, 200);
    }

    function testDeleteOfferedERC20DateStructure() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(LINK, 200);
        vendoraEscrow.getOfferedERC20Tokens(SELLER, LINK);
        vm.prank(SELLER);
        vendoraEscrow.deleteOfferedERC20(LINK, 50);
        uint256 amount = vendoraEscrow.getOfferedERC20Tokens(SELLER, LINK);

        assertEq(amount, 150);
    }

    function testNumOfAssetsInTermsUpdate() public {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 100);
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(AAVE, 100);
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(UNI, 100);
        vm.prank(SELLER);
        vendoraEscrow.deleteRequestedERC20(LINK, 100);
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 50);
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(LINK, 100);
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(AAVE, 100);
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(UNI, 100);
        vm.prank(SELLER);
        vendoraEscrow.deleteOfferedERC20(LINK, 100);
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 100);

        assertEq(vendoraEscrow.getNumOfAssetsInTradeTerms(), 4);
    }
}
