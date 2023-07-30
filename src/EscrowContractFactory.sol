// SPDX-License-Identifier: MIT

// Creates new Escrow contracts for every otc deal
pragma solidity ^0.8.19;

import {TermHandler} from "./TermHandler.sol";
import {InitiatorEscrow} from "./InitiatorEscrow.sol";
import {TerminatorEscrow} from "./TerminatorEscrow.sol";

contract EscrowContractFactory {
    TermHandler termHandler;
    InitiatorEscrow initiatorEscrow;
    TerminatorEscrow terminatorEscrow;
}
