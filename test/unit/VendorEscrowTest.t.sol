// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {EscrowERC20} from "../../src/EscrowERC20.sol";
import {DeployEscrowERC20} from "../../script/DeployEscrowERC20.s.sol";
import {MOCKLINK, MOCKAAVE, MOCKUNI} from "../../src/mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20EscrowTest is Test {
    EscrowERC20 escrowERC20;

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
        DeployEscrowERC20 deployEscrowERC20 = new DeployEscrowERC20();
        escrowERC20 = deployEscrowERC20.run();

        link = new MOCKLINK();
        aave = new MOCKAAVE();
        uni = new MOCKUNI();
    }

    modifier setSeller() {
        vm.prank(SELLER);
        escrowERC20.setSeller();
        _;
    }
    modifier sellerSetAndTermsFinalized() {
        vm.prank(SELLER);
        escrowERC20.setSeller();
        vm.prank(SELLER);
        escrowERC20.requestERC20(LINK, 100);
        vm.prank(SELLER);
        escrowERC20.offerERC20(UNI, 100);
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        _;
    }

    modifier termsMetWitdrawlsOpen() {
        vm.prank(SELLER);
        escrowERC20.setSeller();
        vm.prank(SELLER);
        escrowERC20.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.requestERC20(aaveAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        vm.prank(SELLER);
        link.approve(address(escrowERC20), 100e18);
        vm.prank(SELLER);
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(BUYER);
        escrowERC20.setBuyer();
        vm.prank(BUYER);
        aave.approve(address(escrowERC20), 100e18);
        vm.prank(BUYER);
        escrowERC20.depositERC20Buyer(aaveAddress, tokenAmount);
        _;
    }

    function testSellerCanOnlyBeSetOnce() public setSeller {
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.setSeller();
    }

    function testSellerAddressIsSetToMsgSenderAddress() public setSeller {
        assert(escrowERC20.getSellerAddress() == SELLER);
    }

    function testSellerCantBeSetIfTradeIsLive() public setSeller {
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.setSeller();
    }

    function testBuyerCanOnlyBeSetOnce() public setSeller {
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        vm.prank(BUYER);
        escrowERC20.setBuyer();
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.setBuyer();
    }

    function testBuyerAddressIsSetToMsgSenderAddress() public setSeller {
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        vm.prank(BUYER);
        escrowERC20.setBuyer();
        assert(escrowERC20.getBuyerAddress() == BUYER);
    }

    function testBuyerCanOnlyBeSetAfterSellerIsSet() public {
        vm.prank(BUYER);
        vm.expectRevert();
        escrowERC20.setBuyer();
    }

    function testSwitchingBuyers() public sellerSetAndTermsFinalized {
        vm.prank(BUYER);
        escrowERC20.setBuyer();
        assertEq(escrowERC20.getBuyerAddress(), BUYER);

        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.setBuyer();

        vm.prank(BUYER);
        escrowERC20.leaveTradeBuyer();
        assertEq(escrowERC20.getBuyerAddress(), address(0));

        vm.prank(USER3);
        escrowERC20.setBuyer();

        assertEq(escrowERC20.getBuyerAddress(), USER3);
    }

    // TEST CREATING TERMS OF THE TRADE
    function testRequestERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        escrowERC20.requestERC20(LINK, 200);
        uint256 amount = escrowERC20.getRequestedERC20Tokens(SELLER, LINK);

        assertEq(amount, 200);
    }

    function testDeleteRequestedERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        escrowERC20.requestERC20(LINK, 200);
        escrowERC20.getRequestedERC20Tokens(SELLER, LINK);
        vm.prank(SELLER);
        escrowERC20.deleteRequestedERC20(LINK, 50);
        uint256 amount = escrowERC20.getRequestedERC20Tokens(SELLER, LINK);

        assertEq(amount, 150);
    }

    function testOfferERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        escrowERC20.offerERC20(LINK, 200);
        uint256 amount = escrowERC20.getOfferedERC20Tokens(SELLER, LINK);

        assertEq(amount, 200);
    }

    function testDeleteOfferedERC20DateStructure() public setSeller {
        vm.prank(SELLER);
        escrowERC20.offerERC20(LINK, 200);
        escrowERC20.getOfferedERC20Tokens(SELLER, LINK);
        vm.prank(SELLER);
        escrowERC20.deleteOfferedERC20(LINK, 50);
        uint256 amount = escrowERC20.getOfferedERC20Tokens(SELLER, LINK);

        assertEq(amount, 150);
    }

    function testNumOfAssetsInTermsUpdate() public setSeller {
        vm.prank(SELLER);
        escrowERC20.requestERC20(LINK, 100);
        vm.prank(SELLER);
        escrowERC20.requestERC20(AAVE, 100);
        vm.prank(SELLER);
        escrowERC20.offerERC20(UNI, 100);
        vm.prank(SELLER);
        escrowERC20.deleteRequestedERC20(LINK, 100);
        vm.prank(SELLER);
        escrowERC20.requestERC20(LINK, 50);
        vm.prank(SELLER);
        escrowERC20.offerERC20(LINK, 100);
        vm.prank(SELLER);
        escrowERC20.offerERC20(AAVE, 100);
        vm.prank(SELLER);
        escrowERC20.offerERC20(UNI, 100);
        vm.prank(SELLER);
        escrowERC20.deleteOfferedERC20(LINK, 100);
        vm.prank(SELLER);
        escrowERC20.requestERC20(LINK, 100);

        assertEq(escrowERC20.getNumOfAssetsInTradeTerms(), 4);
    }

    function testModifyingTermsAfterFinalizedTermsAndOpenDepositsIsCalled()
        public
        sellerSetAndTermsFinalized
    {
        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.deleteOfferedERC20(UNI, 100);
    }

    function testChangeTermsAndCloseDeposits()
        public
        sellerSetAndTermsFinalized
    {
        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.deleteOfferedERC20(UNI, 100);
        vm.prank(SELLER);
        escrowERC20.changeTermsAndCloseDeposits();
        vm.prank(SELLER);
        escrowERC20.deleteOfferedERC20(UNI, 100);
        assertEq(escrowERC20.getNumOfAssetsInTradeTerms(), 1);
    }

    function testDeposits() public setSeller {
        vm.prank(SELLER);
        escrowERC20.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.requestERC20(aaveAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        vm.prank(SELLER);
        link.approve(address(escrowERC20), 100e18);
        vm.prank(SELLER);
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(BUYER);
        escrowERC20.setBuyer();
        vm.prank(BUYER);
        aave.approve(address(escrowERC20), 100e18);
        vm.prank(BUYER);
        escrowERC20.depositERC20Buyer(aaveAddress, tokenAmount);

        assertEq(escrowERC20.getNumOfAssetsDeposited(), 2);
        assertEq(
            escrowERC20.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(
            escrowERC20.getUserDepositBalances(BUYER, aaveAddress),
            tokenAmount
        );
        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.OPEN
        );

        vm.prank(SELLER);
        link.approve(address(escrowERC20), 100e18);
        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount);
    }

    function testWithdrawOwnAssetsBeforeTermsAreMet() public setSeller {
        vm.prank(SELLER);
        escrowERC20.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.offerERC20(uniAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.requestERC20(aaveAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.finalizeTermsAndOpenDeposits();
        vm.prank(SELLER);
        link.approve(address(escrowERC20), 100e18);
        vm.prank(SELLER);
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(BUYER);
        escrowERC20.setBuyer();
        vm.prank(BUYER);
        aave.approve(address(escrowERC20), 100e18);
        vm.prank(BUYER);
        escrowERC20.depositERC20Buyer(aaveAddress, tokenAmount);

        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.CLOSED
        );
        assertEq(escrowERC20.getNumOfAssetsDeposited(), 2);
        assertEq(
            escrowERC20.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(
            escrowERC20.getUserDepositBalances(BUYER, aaveAddress),
            tokenAmount
        );

        vm.prank(SELLER);
        escrowERC20.withdrawBeforeTermsAreMetSeller(linkAddress, tokenAmount);

        assertEq(escrowERC20.getNumOfAssetsDeposited(), 1);
        assertEq(escrowERC20.getUserDepositBalances(SELLER, linkAddress), 0);

        vm.prank(BUYER);
        escrowERC20.withdrawBeforeTermsAreMetBuyer(aaveAddress, tokenAmount);

        assertEq(escrowERC20.getNumOfAssetsDeposited(), 0);
        assertEq(escrowERC20.getUserDepositBalances(BUYER, aaveAddress), 0);
    }

    function testSellerCanWithdraw() public termsMetWitdrawlsOpen {
        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.OPEN
        );

        assertEq(
            escrowERC20.getUserDepositBalances(BUYER, aaveAddress),
            tokenAmount
        );
        assertEq(escrowERC20.getNumOfAssetsDeposited(), 2);

        vm.prank(SELLER);
        escrowERC20.withdrawERC20Seller(aaveAddress, tokenAmount);
        assertEq(escrowERC20.getUserDepositBalances(BUYER, aaveAddress), 0);
        assertEq(escrowERC20.getNumOfAssetsDeposited(), 1);
    }

    function testBuyerCanWithdraw() public termsMetWitdrawlsOpen {
        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.OPEN
        );

        assertEq(
            escrowERC20.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(escrowERC20.getNumOfAssetsDeposited(), 2);

        vm.prank(BUYER);
        escrowERC20.withdrawERC20Buyer(linkAddress, tokenAmount);
        assertEq(escrowERC20.getUserDepositBalances(SELLER, linkAddress), 0);
        assertEq(escrowERC20.getNumOfAssetsDeposited(), 1);
    }

    function testUserCanWithdrawOwnDepositAfterTermsAreMetAndWithdrawlsAreOpen()
        public
        termsMetWitdrawlsOpen
    {
        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.withdrawERC20Seller(linkAddress, tokenAmount);
        assertEq(
            escrowERC20.getUserDepositBalances(SELLER, linkAddress),
            tokenAmount
        );
        assertEq(escrowERC20.getNumOfAssetsDeposited(), 2);
    }

    function testEndingTrade() public termsMetWitdrawlsOpen {
        vm.prank(SELLER);
        escrowERC20.withdrawERC20Seller(aaveAddress, tokenAmount);

        vm.prank(BUYER);
        escrowERC20.withdrawERC20Buyer(linkAddress, tokenAmount);

        assertEq(escrowERC20.getNumOfAssetsDeposited(), 0);
        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.CLOSED
        );
        assert(escrowERC20.getTradeState() == EscrowERC20.TradeState.COMPLETED);
    }

    // AI generated test

    function testWithdrawByNonParticipant() public termsMetWitdrawlsOpen {
        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.OPEN
        );

        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.withdrawERC20Buyer(aaveAddress, tokenAmount);
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.withdrawERC20Seller(aaveAddress, tokenAmount);
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.withdrawBeforeTermsAreMetBuyer(aaveAddress, tokenAmount);
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.withdrawBeforeTermsAreMetSeller(aaveAddress, tokenAmount);
    }

    function testRepeatedWithdraw() public termsMetWitdrawlsOpen {
        assert(
            escrowERC20.getWithdrawState() == EscrowERC20.WithdrawState.OPEN
        );

        vm.prank(SELLER);
        escrowERC20.withdrawERC20Seller(aaveAddress, tokenAmount);

        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.withdrawERC20Seller(aaveAddress, tokenAmount);
    }

    function testTradeCompletionState() public termsMetWitdrawlsOpen {
        vm.prank(SELLER);
        escrowERC20.withdrawERC20Seller(aaveAddress, tokenAmount);
        vm.prank(BUYER);
        escrowERC20.withdrawERC20Buyer(linkAddress, tokenAmount);

        assert(escrowERC20.getTradeState() == EscrowERC20.TradeState.COMPLETED);
    }

    function testDepositMoreThanAllowed() public setSeller {
        vm.prank(SELLER);
        escrowERC20.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        link.approve(address(escrowERC20), 100e18);
        vm.expectRevert();
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount + 1);
    }

    function testWithdrawMoreThanDeposited() public termsMetWitdrawlsOpen {
        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.withdrawBeforeTermsAreMetSeller(
            linkAddress,
            tokenAmount + 1
        );
    }

    function testOtherUserCannotWithdraw() public termsMetWitdrawlsOpen {
        vm.prank(USER3);
        vm.expectRevert();
        escrowERC20.withdrawBeforeTermsAreMetSeller(linkAddress, tokenAmount);
    }

    function testOverApprovalDoesNotAllowOverDeposit() public setSeller {
        vm.prank(SELLER);
        escrowERC20.offerERC20(linkAddress, tokenAmount);
        vm.prank(SELLER);
        link.approve(address(escrowERC20), 1000e18); // Excessive approval
        vm.expectRevert();
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount + 1); // Try to deposit more than the terms
    }

    function testZeroTokenAmount() public setSeller {
        vm.prank(SELLER);
        vm.expectRevert();
        escrowERC20.requestERC20(LINK, 0);
    }

    function testMultipleDepositsBySeller() public sellerSetAndTermsFinalized {
        vm.prank(SELLER);
        link.approve(address(escrowERC20), 200e18);
        vm.prank(SELLER);
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount);
        vm.prank(SELLER);
        escrowERC20.depositERC20Seller(linkAddress, tokenAmount);

        assertEq(
            escrowERC20.getUserDepositBalances(SELLER, linkAddress),
            2 * tokenAmount
        );
    }
}
