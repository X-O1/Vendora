// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";
import {DeployVendora} from "../../script/DeployVendora.s.sol";
import {MockNft1, MockNft2, MockResources1, MockResources2, MOCKLINK, MOCKAAVE} from "../../src/mocks/MockAssets.sol";

contract VendoraTest is Test {
    Vendora vendora;

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

    modifier termsSet() {
        Vendora.Erc721Details[]
            memory offeredErc721s = new Vendora.Erc721Details[](1);
        Vendora.Erc721Details[]
            memory requestedErc721s = new Vendora.Erc721Details[](1);

        Vendora.Erc1155Details[]
            memory offeredErc1155s = new Vendora.Erc1155Details[](1);
        Vendora.Erc1155Details[]
            memory requestedErc1155s = new Vendora.Erc1155Details[](1);

        Vendora.Erc20Details[]
            memory offeredErc20s = new Vendora.Erc20Details[](1);
        Vendora.Erc20Details[]
            memory requestedErc20s = new Vendora.Erc20Details[](1);

        offeredErc721s[0] = Vendora.Erc721Details(nft1Address, 1);
        requestedErc721s[0] = Vendora.Erc721Details(nft2Address, 2);

        offeredErc1155s[0] = Vendora.Erc1155Details(resource1Address, 1, 10);
        requestedErc1155s[0] = Vendora.Erc1155Details(resource2Address, 2, 10);

        offeredErc20s[0] = Vendora.Erc20Details(linkAddress, 10e18);
        requestedErc20s[0] = Vendora.Erc20Details(aaveAddress, 10e18);

        uint256 offeredEthAmount = 1 ether;
        uint256 requestedEthAmount = 0.5 ether;

        vm.prank(SELLER);
        vendora.setTerms(
            offeredErc721s,
            requestedErc721s,
            offeredErc1155s,
            requestedErc1155s,
            offeredErc20s,
            requestedErc20s,
            offeredEthAmount,
            requestedEthAmount
        );
        _;
    }

    modifier termsSetTradeStarted() {
        Vendora.Erc721Details[]
            memory offeredErc721s = new Vendora.Erc721Details[](1);
        Vendora.Erc721Details[]
            memory requestedErc721s = new Vendora.Erc721Details[](1);

        Vendora.Erc1155Details[]
            memory offeredErc1155s = new Vendora.Erc1155Details[](1);
        Vendora.Erc1155Details[]
            memory requestedErc1155s = new Vendora.Erc1155Details[](1);

        Vendora.Erc20Details[]
            memory offeredErc20s = new Vendora.Erc20Details[](1);
        Vendora.Erc20Details[]
            memory requestedErc20s = new Vendora.Erc20Details[](1);

        offeredErc721s[0] = Vendora.Erc721Details(nft1Address, 1);
        requestedErc721s[0] = Vendora.Erc721Details(nft2Address, 2);

        offeredErc1155s[0] = Vendora.Erc1155Details(resource1Address, 1, 10);
        requestedErc1155s[0] = Vendora.Erc1155Details(resource2Address, 2, 10);

        offeredErc20s[0] = Vendora.Erc20Details(linkAddress, 10e18);
        requestedErc20s[0] = Vendora.Erc20Details(aaveAddress, 10e18);

        uint256 offeredEthAmount = 1 ether;
        uint256 requestedEthAmount = 0.5 ether;

        vm.prank(SELLER);
        vendora.setTerms(
            offeredErc721s,
            requestedErc721s,
            offeredErc1155s,
            requestedErc1155s,
            offeredErc20s,
            requestedErc20s,
            offeredEthAmount,
            requestedEthAmount
        );

        vm.prank(BUYER);
        vendora.startTrade(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
        _;
    }
    modifier termsSetTradeStartedAssetsVerfied() {
        Vendora.Erc721Details[]
            memory offeredErc721s = new Vendora.Erc721Details[](1);
        Vendora.Erc721Details[]
            memory requestedErc721s = new Vendora.Erc721Details[](1);

        Vendora.Erc1155Details[]
            memory offeredErc1155s = new Vendora.Erc1155Details[](1);
        Vendora.Erc1155Details[]
            memory requestedErc1155s = new Vendora.Erc1155Details[](1);

        Vendora.Erc20Details[]
            memory offeredErc20s = new Vendora.Erc20Details[](1);
        Vendora.Erc20Details[]
            memory requestedErc20s = new Vendora.Erc20Details[](1);

        offeredErc721s[0] = Vendora.Erc721Details(nft1Address, 1);
        requestedErc721s[0] = Vendora.Erc721Details(nft2Address, 2);

        offeredErc1155s[0] = Vendora.Erc1155Details(resource1Address, 1, 10);
        requestedErc1155s[0] = Vendora.Erc1155Details(resource2Address, 2, 10);

        offeredErc20s[0] = Vendora.Erc20Details(linkAddress, 10e18);
        requestedErc20s[0] = Vendora.Erc20Details(aaveAddress, 10e18);

        uint256 offeredEthAmount = 1 ether;
        uint256 requestedEthAmount = 0.5 ether;

        vm.prank(SELLER);
        vendora.setTerms(
            offeredErc721s,
            requestedErc721s,
            offeredErc1155s,
            requestedErc1155s,
            offeredErc20s,
            requestedErc20s,
            offeredEthAmount,
            requestedEthAmount
        );

        vm.prank(BUYER);
        vendora.startTrade(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );

        vm.prank(SELLER);
        nft1.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 1);
        vm.prank(SELLER);
        resources1.setApprovalForAll(
            0x90193C961A926261B756D1E5bb255e67ff9498A1,
            true
        );
        vm.prank(SELLER);
        link.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 10e18);
        vm.prank(SELLER);
        vendora.verifySellerAssets(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );

        vm.prank(BUYER);
        nft2.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 2);
        vm.prank(BUYER);
        resources2.setApprovalForAll(
            0x90193C961A926261B756D1E5bb255e67ff9498A1,
            true
        );
        vm.prank(BUYER);
        aave.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 10e18);
        vm.prank(BUYER);
        vendora.verifyBuyerAssets(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
        _;
    }

    function testSettingTerms() public {
        // Mock details for ERC721, ERC1155, and ERC20
        Vendora.Erc721Details[]
            memory offeredErc721s = new Vendora.Erc721Details[](1);
        Vendora.Erc721Details[]
            memory requestedErc721s = new Vendora.Erc721Details[](1);

        Vendora.Erc1155Details[]
            memory offeredErc1155s = new Vendora.Erc1155Details[](1);
        Vendora.Erc1155Details[]
            memory requestedErc1155s = new Vendora.Erc1155Details[](1);

        Vendora.Erc20Details[]
            memory offeredErc20s = new Vendora.Erc20Details[](1);
        Vendora.Erc20Details[]
            memory requestedErc20s = new Vendora.Erc20Details[](1);

        offeredErc721s[0] = Vendora.Erc721Details(nft1Address, 1);
        requestedErc721s[0] = Vendora.Erc721Details(nft2Address, 2);

        offeredErc1155s[0] = Vendora.Erc1155Details(resource1Address, 1, 10);
        requestedErc1155s[0] = Vendora.Erc1155Details(resource2Address, 2, 10);

        offeredErc20s[0] = Vendora.Erc20Details(linkAddress, 10e18);
        requestedErc20s[0] = Vendora.Erc20Details(aaveAddress, 10e18);

        uint256 offeredEthAmount = 1 ether;
        uint256 requestedEthAmount = 0.5 ether;

        vm.prank(SELLER);
        vendora.setTerms(
            offeredErc721s,
            requestedErc721s,
            offeredErc1155s,
            requestedErc1155s,
            offeredErc20s,
            requestedErc20s,
            offeredEthAmount,
            requestedEthAmount
        );
    }

    function testStartingTrade() public termsSet {
        vm.prank(BUYER);
        vendora.startTrade(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }

    function testVerifingUserAssets() public termsSetTradeStarted {
        vm.prank(SELLER);
        nft1.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 1);
        vm.prank(SELLER);
        resources1.setApprovalForAll(
            0x90193C961A926261B756D1E5bb255e67ff9498A1,
            true
        );
        vm.prank(SELLER);
        link.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 10e18);
        vm.prank(SELLER);
        vendora.verifySellerAssets(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );

        vm.prank(BUYER);
        nft2.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 2);
        vm.prank(BUYER);
        resources2.setApprovalForAll(
            0x90193C961A926261B756D1E5bb255e67ff9498A1,
            true
        );
        vm.prank(BUYER);
        aave.approve(0x90193C961A926261B756D1E5bb255e67ff9498A1, 10e18);
        vm.prank(BUYER);
        vendora.verifyBuyerAssets(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }

    function testUserMustHaveAllAssetsInTermsAndApprovedThemBeforeDepositsOpen()
        public
        termsSetTradeStarted
    {
        vm.prank(SELLER);
        vm.expectRevert();
        vendora.depositAssets(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }

    function testSellerDeposits() public termsSetTradeStartedAssetsVerfied {
        vm.prank(SELLER);
        vendora.depositAssets{value: 1 ether}(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }

    function testBuyerDeposits() public termsSetTradeStartedAssetsVerfied {
        vm.prank(BUYER);
        vendora.depositAssets{value: 0.5 ether}(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }

    function testCancelingTrade() public termsSetTradeStartedAssetsVerfied {
        vm.prank(SELLER);
        vendora.depositAssets{value: 1 ether}(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
        vm.prank(SELLER);
        vendora.cancelTradeAndWithdraw(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
        vm.prank(SELLER);
        vm.expectRevert();
        vendora.depositAssets{value: 1 ether}(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }

    function testCompletingTrade() public termsSetTradeStartedAssetsVerfied {
        vm.prank(SELLER);
        vendora.depositAssets{value: 1 ether}(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );

        vm.prank(BUYER);
        vendora.depositAssets{value: 0.5 ether}(
            0xefc32cdffe5382ea0e3407394dcd1120a1fa5023886bead4e99a002094757787
        );
    }
}
