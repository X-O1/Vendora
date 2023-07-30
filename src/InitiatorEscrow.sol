// SPDX-License-Identifier: MIT

// CONTRACT OBJECTIVES:

pragma solidity ^0.8.19;

contract InitiatorEscrow {
    /** CUSTOM ERRORS */
    error Not_Initiator();

    /** STATE VARIABLES */

    address private s_initiator;
    bool private s_initiatorSet;
    mapping(bytes32 => address) private s_whitelistedTokens;
    bytes32[] public s_symbolWanted;
    uint256[] public s_amountWanted;
    bytes32[] public s_symbolGiving;
    uint256[] public s_amountGiving;

    /** EVENTS */
    event Initiator_Set(bool indexed set, address indexed initiatorsAddress);

    /** CONTRUCTOR */
    constructor(
        bytes32[] memory symbolWanted,
        uint256[] memory amountWanted,
        bytes32[] memory symbolGiving,
        uint256[] memory amountGiving
    ) {
        s_symbolWanted = symbolWanted;
        s_amountWanted = amountWanted;
        s_symbolGiving = symbolGiving;
        s_amountGiving = amountGiving;
        s_initiatorSet = false;
    }

    /** MODIFIERS */
    modifier onlyInitiator() {
        if (msg.sender != s_initiator) {
            revert Not_Initiator();
        }
        _;
    }

    /** FUNCTIONS */
    // Set the Initiator
    function setInitiator() public {
        require(s_initiatorSet == false, "Initiator already set");

        s_initiator = msg.sender;
        s_initiatorSet = true;

        emit Initiator_Set(s_initiatorSet, s_initiator);
    }

    // Deposit
    // function initiatorDeposit() public onlyInitiator {}

    // Withdraw
    // function terminatorWithdraw() public onlyTerminator {}
}
