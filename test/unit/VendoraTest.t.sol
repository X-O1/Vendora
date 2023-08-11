// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Vendora} from "../../src/Vendora.sol";

contract VendoraTest is Test {
    Vendora vendora;

    address SELLER = makeAddr("user");
    address BUYER = makeAddr("user2");

    function setUp() external {
        Vendora vendora = new Vendora();
    }
}
