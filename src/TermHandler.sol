// SPDX-License-Identifier: MIT

// CONTRACT OBJECTIVES:

pragma solidity ^0.8.19;

contract TermHandler {
    /** CUSTOM ERRORS */

    /** STATE VARIABLES */
    address private immutable i_owner;

    mapping(bytes32 => address) private s_whitelistedTokens;

    /** CONTRUCTOR */
    constructor() {
        i_owner = msg.sender;
    }

    /** MODIFIERS */

    /** FUNCTIONS */

    // want() and give() will take in Initiator's front-end input values as thier arguments
    function want(
        bytes32[] memory,
        uint256[] memory
    )
        external
        pure
        returns (bytes32[] memory symbolWanted, uint256[] memory amountWanted)
    {
        return (symbolWanted, amountWanted);
    }

    function give(
        bytes32[] memory,
        uint256[] memory
    )
        external
        pure
        returns (bytes32[] memory symbolGiving, uint256[] memory amountGiving)
    {
        return (symbolGiving, amountGiving);
    }

    // Generate a code to send to the terminator that will display the terms the Initiator set
    function inviteCodeGenerator() public returns (uint256 inviteCode) {}
}
