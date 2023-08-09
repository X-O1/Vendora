// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {EscrowERC20} from "src/EscrowERC20.sol";

contract DeployEscrowERC20 is Script {
    function run() external returns (EscrowERC20) {
        vm.startBroadcast();
        EscrowERC20 escrowERC20 = new EscrowERC20();
        vm.stopBroadcast();

        return escrowERC20;
    }
}
