//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Tickets is AccessControl, ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private tickedID;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint128 public totalTicketSupply;
    uint128 public ticketPrice;

    address private eventOrganiser;
    address[] private Buyers;

    struct Ticket {
        uint256 price;
        bool isSold;
    }
    mapping(uint256 => Ticket) ticketDetails;

    constructor() ERC721("NFT Ticket Token", "NTT") {
        _setupRole(MINTER_ROLE, eventOrganiser);
    }

    function _createTicket() internal returns (uint256) {
        require(
            hasRole(MINTER_ROLE, eventOrganiser),
            "only owner can mint tickets"
        );
        tickedID.increment();
        uint256 newTicketId = tickedID.current();
        Ticket memory tickets = Ticket(ticketPrice, false);
        ticketDetails[newTicketId] = tickets;
        return newTicketId;
    }

    function mintTickets() public {
        uint256 _newTicketId = _createTicket();
        _mint(msg.sender, _newTicketId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
