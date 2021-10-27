//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Ticketing is ERC721 {
    constructor(string memory Name, string memory Symbol)
        ERC721(Name, Symbol)
    {}
}
