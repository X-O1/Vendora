// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {Vendora} from "../src/Vendora.sol";

contract DeployVendora is Script {
    function run() external returns (Vendora) {
        vm.startBroadcast();
        Vendora vendora = new Vendora();
        vm.stopBroadcast();

        return vendora;
    }
}
