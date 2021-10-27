//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Ticketing is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private idCounter;

    constructor(string memory Name, string memory Symbol)
        ERC721(Name, Symbol)
    {}

    struct Ticket {
        string Name;
        uint256 price;
        uint256 totalSupply;
    }
    mapping(uint256 => Ticket) private ticketDetails;

    function createEvent(
        string memory _name,
        uint256 _price,
        uint256 _totalSupply
    ) public returns (uint256) {
        idCounter.increment();
        uint256 newId = idCounter.current();
        _mint(msg.sender, newId);
        Ticket memory tickets = Ticket(_name, _price, _totalSupply);
        ticketDetails[newId] = tickets;
        return newId;
    }
}
