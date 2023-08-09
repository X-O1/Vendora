// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {VendoraEscrow} from "../../src/VendoraEscrow.sol";
import {DeployVendoraEscrow} from "../../script/DeployVendoraEscrow.s.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MOCKLINK, MOCKAAVE, MOCKUNI} from "../../src/mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VendoraEscrowTest is Test {
    VendoraEscrow vendoraEscrow;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");
    address USER3 = makeAddr("user3");
    address USER4 = makeAddr("user4");
    address public LINK = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
    address public AAVE = 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9;
    address public UNI = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;

    MOCKLINK public link;
    MOCKAAVE public aave;
    MOCKUNI public uni;
    address public linkAddress = 0x2e234DAe75C793f67A35089C9d99245E1C58470b;
    address public aaveAddress = 0xF62849F9A0B5Bf2913b396098F7c7019b51A820a;
    address public uniAddress = 0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9;

    uint256 public tokenAmount = 10e18;

    function setUp() external {
        DeployVendoraEscrow deployVendoraEscrow = new DeployVendoraEscrow();
        vendoraEscrow = deployVendoraEscrow.run();

        link = new MOCKLINK();
        aave = new MOCKAAVE();
        uni = new MOCKUNI();
    }

    modifier setSeller() {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        _;
    }
    modifier sellerSetAndTermsFinalized() {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 100);
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(UNI, 100);
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        _;
    }

    modifier termsMetWitdrawlsOpen() {
        vm.prank(SELLER);
        vendoraEscrow.setSeller();
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(aaveAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(SELLER);
        link.approve(address(vendoraEscrow), 100e18);
        vm.prank(SELLER);
        vendoraEscrow.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        vm.prank(BUYER);
        aave.approve(address(vendoraEscrow), 100e18);
        vm.prank(BUYER);
        vendoraEscrow.depositERC20Buyer(aaveAddress, tokenAmount);
        _;
    }

    function testSellerCanOnlyBeSetOnce() public setSeller {
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setSeller();
    }

    function testSellerAddressIsSetToMsgSenderAddress() public setSeller {
        assert(vendoraEscrow.getSellerAddress() == SELLER);
    }

    function testSellerCantBeSetIfTradeIsLive() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setSeller();
    }

    function testBuyerCanOnlyBeSetOnce() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setBuyer();
    }

    function testBuyerAddressIsSetToMsgSenderAddress() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        assert(vendoraEscrow.getBuyerAddress() == BUYER);
    }

    function testBuyerCanOnlyBeSetAfterSellerIsSet() public {
        vm.prank(BUYER);
        vm.expectRevert();
        vendoraEscrow.setBuyer();
    }

    function testSwitchingBuyers() public sellerSetAndTermsFinalized {
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        assertEq(vendoraEscrow.getBuyerAddress(), BUYER);

        vm.prank(USER3);
        vm.expectRevert();
        vendoraEscrow.setBuyer();

        vm.prank(BUYER);
        vendoraEscrow.leaveTradeBuyer();
        assertEq(vendoraEscrow.getBuyerAddress(), address(0));

        vm.prank(USER3);
        vendoraEscrow.setBuyer();

        assertEq(vendoraEscrow.getBuyerAddress(), USER3);
    }

    // TEST CREATING TERMS OF THE TRADE
    function testRequestERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 200);
        uint256 amount = vendoraEscrow.getRequestedERC20Tokens(SELLER, LINK);

        assertEq(amount, 200);
    }

    function testDeleteRequestedERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(LINK, 200);
        vendoraEscrow.getRequestedERC20Tokens(SELLER, LINK);
        vm.prank(SELLER);
        vendoraEscrow.deleteRequestedERC20(LINK, 50);
        uint256 amount = vendoraEscrow.getRequestedERC20Tokens(SELLER, LINK);

        assertEq(amount, 150);
    }

    function testOfferERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(LINK, 200);
        uint256 amount = vendoraEscrow.getOfferedERC20Tokens(SELLER, LINK);

        assertEq(amount, 200);
    }

    function testDeleteOfferedERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(LINK, 200);
        vendoraEscrow.getOfferedERC20Tokens(SELLER, LINK);
        vm.prank(SELLER);
        vendoraEscrow.deleteOfferedERC20(LINK, 50);
        uint256 amount = vendoraEscrow.getOfferedERC20Tokens(SELLER, LINK);

        assertEq(amount, 150);
    }

    function testNumOfAssetsInTermsUpdate() public setSeller {
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

    function testModifyingTermsAfterFinalizedTermsAndOpenDepositsIsCalled()
        public
        sellerSetAndTermsFinalized
    {
        vm.prank(SELLER);
        vm.expectRevert();
        vendoraEscrow.deleteOfferedERC20(UNI, 100);
    }

    function testChangeTermsAndCloseDeposits()
        public
        sellerSetAndTermsFinalized
    {
        vm.prank(SELLER);
        vm.expectRevert();
        vendoraEscrow.deleteOfferedERC20(UNI, 100);
        vm.prank(SELLER);
        vendoraEscrow.changeTermsAndCloseDeposits();
        vm.prank(SELLER);
        vendoraEscrow.deleteOfferedERC20(UNI, 100);
        assertEq(vendoraEscrow.getNumOfAssetsInTradeTerms(), 1);
    }

    function testDeposits() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(aaveAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(SELLER);
        link.approve(address(vendoraEscrow), 100e18);
        vm.prank(SELLER);
        vendoraEscrow.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        vm.prank(BUYER);
        aave.approve(address(vendoraEscrow), 100e18);
        vm.prank(BUYER);
        vendoraEscrow.depositERC20Buyer(aaveAddress, tokenAmount);

        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 2);
        assertEq(
            vendoraEscrow.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(
            vendoraEscrow.getUserDepositBalances(BUYER, aaveAddress),
            tokenAmount
        );
        assert(
            vendoraEscrow.getWithdrawState() == VendoraEscrow.WithdrawState.OPEN
        );

        vm.prank(SELLER);
        link.approve(address(vendoraEscrow), 100e18);
        vm.prank(SELLER);
        vm.expectRevert();
        vendoraEscrow.depositERC20Seller(linkAddress, tokenAmount);
    }

    function testWithdrawOwnAssetsBeforeTermsAreMet() public setSeller {
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.offerERC20(uniAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.requestERC20(aaveAddress, tokenAmount);
        vm.prank(SELLER);
        vendoraEscrow.finalizeTermsAndOpenDeposits();
        vm.prank(SELLER);
        link.approve(address(vendoraEscrow), 100e18);
        vm.prank(SELLER);
        vendoraEscrow.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(BUYER);
        vendoraEscrow.setBuyer();
        vm.prank(BUYER);
        aave.approve(address(vendoraEscrow), 100e18);
        vm.prank(BUYER);
        vendoraEscrow.depositERC20Buyer(aaveAddress, tokenAmount);

        assert(
            vendoraEscrow.getWithdrawState() ==
                VendoraEscrow.WithdrawState.CLOSED
        );
        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 2);
        assertEq(
            vendoraEscrow.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(
            vendoraEscrow.getUserDepositBalances(BUYER, aaveAddress),
            tokenAmount
        );

        vm.prank(SELLER);
        vendoraEscrow.withdrawBeforeTermsAreMetSeller(linkAddress, tokenAmount);

        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 1);
        assertEq(vendoraEscrow.getUserDepositBalances(SELLER, linkAddress), 0);

        vm.prank(BUYER);
        vendoraEscrow.withdrawBeforeTermsAreMetBuyer(aaveAddress, tokenAmount);

        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 0);
        assertEq(vendoraEscrow.getUserDepositBalances(BUYER, aaveAddress), 0);
    }

    function testSellerCanWithdraw() public termsMetWitdrawlsOpen {
        assert(
            vendoraEscrow.getWithdrawState() == VendoraEscrow.WithdrawState.OPEN
        );

        assertEq(
            vendoraEscrow.getUserDepositBalances(BUYER, aaveAddress),
            tokenAmount
        );
        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 2);

        vm.prank(SELLER);
        vendoraEscrow.withdrawERC20Seller(aaveAddress, tokenAmount);
        assertEq(vendoraEscrow.getUserDepositBalances(BUYER, aaveAddress), 0);
        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 1);
    }

    function testBuyerCanWithdraw() public termsMetWitdrawlsOpen {
        assert(
            vendoraEscrow.getWithdrawState() == VendoraEscrow.WithdrawState.OPEN
        );

        assertEq(
            vendoraEscrow.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 2);

        vm.prank(BUYER);
        vendoraEscrow.withdrawERC20Buyer(linkAddress, tokenAmount);
        assertEq(vendoraEscrow.getUserDepositBalances(SELLER, linkAddress), 0);
        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 1);
    }

    function testUserCanWithdrawOwnDepositAfterTermsAreMetAndWithdrawlsAreOpen()
        public
        termsMetWitdrawlsOpen
    {
        vm.prank(SELLER);
        vm.expectRevert();
        vendoraEscrow.withdrawERC20Seller(linkAddress, tokenAmount);
        assertEq(
            vendoraEscrow.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 2);
    }

    function testEndingTrade() public termsMetWitdrawlsOpen {
        vm.prank(SELLER);
        vendoraEscrow.withdrawERC20Seller(aaveAddress, tokenAmount);

        vm.prank(BUYER);
        vendoraEscrow.withdrawERC20Buyer(linkAddress, tokenAmount);

        assertEq(vendoraEscrow.getNumOfAssetsDeposited(), 0);
        assert(
            vendoraEscrow.getWithdrawState() ==
                VendoraEscrow.WithdrawState.CLOSED
        );
        assert(
            vendoraEscrow.getTradeState() == VendoraEscrow.TradeState.COMPLETED
        );
    }
}
