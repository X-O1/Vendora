// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {VendoraEscrow} from "../src/VendoraEscrow.sol";

contract DeployVendoraEscrow is Script {
    function run() external returns (VendoraEscrow) {
        vm.startBroadcast();
        VendoraEscrow vendoraEscrow = new VendoraEscrow();
        vm.stopBroadcast();

        return vendoraEscrow;
    }
}
