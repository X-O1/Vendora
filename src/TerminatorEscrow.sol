// SPDX-License-Identifier: MIT

// CONTRACT OBJECTIVES:

pragma solidity ^0.8.19;

contract TerminatorEscrow {
    /** CUSTOM ERRORS */
    error Not_Terminator();

    /** STATE VARIABLES */
    address private s_terminator;
    bool private s_terminatorSet;
    mapping(bytes32 => address) private s_whitelistedTokens;

    /** EVENTS */
    event Initiator_Set(bool indexed set, address indexed initiatorsAddress);

    /** CONTRUCTOR */
    constructor() {
        s_terminatorSet = false;
    }

    /** MODIFIERS */
    modifier onlyTerminator() {
        if (msg.sender != s_terminator) {
            revert Not_Terminator();
        }
        _;
    }

    /** FUNCTIONS */

    // Set the Terminator
    function setTerminator() public {
        require(s_terminatorSet == false, "Terminator already set");

        s_terminator = msg.sender;
        s_terminatorSet = true;

        emit Initiator_Set(s_terminatorSet, s_terminator);
    }

    // Deposit
    function initiatorDeposit() public onlyTerminator {}

    // Withdraw
    function withdrawFromTerminator() public onlyTerminator {}
}
