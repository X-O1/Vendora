// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract TermHandler {
    /** CUSTOM ERRORS */
    error Not_Initiator();
    error Not_Terminator();

    /** STATE VARIABLES */
    address private immutable i_owner;

    address private s_initiator;
    address private s_terminator;
    bool private s_initiatorSet;
    bool private s_terminatorSet;
    mapping(bytes32 => address) private s_whitelistedTokens;

    /** CONTRUCTOR */
    constructor() {
        i_owner = msg.sender;
        s_initiatorSet = false;
        s_terminatorSet = false;
    }

    /** MODIFIERS */
    modifier onlyInitiator() {
        if (msg.sender != s_initiator) {
            revert Not_Initiator();
        }
        _;
    }
    modifier onlyTerminator() {
        if (msg.sender != s_terminator) {
            revert Not_Terminator();
        }
        _;
    }

    /** FUNCTIONS */
    // Set the Initiator
    function setInitiator() public {
        require(s_initiatorSet == false, "Initiator already set");
        s_initiator = msg.sender;
        s_initiatorSet = true;
    }

    // Set the Terminator
    function setTerminator() public {
        require(s_terminatorSet == false, "Terminator already set");
        s_terminator = msg.sender;
        s_terminatorSet = true;
    }

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
    function inviteCodeGenerator()
        public
        onlyInitiator
        returns (uint256 inviteCode)
    {}
}
