//SPDX-License_Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    // max number od whitelisted address specified during deployment
    uint8 public maxWhitelistedAddresses;

    //mapping from the address => bool says wheather the addree is whitelisted or not
    mapping(address => bool) public whitelistedAddresses;

    //tracking the number of address already whitelisted
    uint8 public numAddressesWhitelisted;

    //constructor to set the maximun number od whitelisted address during deployment
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    //funciton to add the address to the list of whitelisted address if not already present and maxWhitelistedAddresses is not reched yet!!!
    function addAddressToWhitelist() public {
        //checking wheather the address is already whitelisted or not
        require(
            !whitelistedAddresses[msg.sender],
            "sender has already been whitelisted"
        );

        //checking wheather the maximum number of whitelisted address reached or not
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "more address cannot be added, limit reached!!"
        );

        whitelistedAddresses[msg.sender] = true;

        numAddressesWhitelisted += 1;
    }
}

// contract address - 0x31F5399c01582F3c8f62247D8Be1f982DD839EF3
