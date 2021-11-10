//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Tickets is AccessControl, ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private tickedID;
        Counters.Counter private _saleTicketId;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint128 public totalTicketSupply;
    uint128 public ticketPrice;

    address private eventOrganiser;
    address[] private Buyers;

    struct Ticket {
        uint256 price;
        bool isSold;
        uint ticketid;
    }
    mapping(uint256 => Ticket) ticketDetails;
    
    constructor(uint128 _totalTicketSupply, uint128 _ticketPrice, address _eventOrganiser) ERC721("NFT Ticket Token", "NTT") {
        totalTicketSupply=_totalTicketSupply;
        ticketPrice=_ticketPrice;
        eventOrganiser=_eventOrganiser;
        _setupRole(MINTER_ROLE, eventOrganiser);
    }
    
    
    
        modifier isMinterRole {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "only owner can mint"
        );
        _;
    }


 function _createTicket() public isMinterRole returns (uint256) {
     
        tickedID.increment();
        uint256 newTicketId = tickedID.current();
                _mint(msg.sender, newTicketId);

        Ticket memory tickets = Ticket(ticketPrice, false,newTicketId);
        ticketDetails[newTicketId] = tickets;
        return newTicketId;
    }

 

    function buyTickets() public payable{
        _saleTicketId.increment();
        uint256 saleTicketId = _saleTicketId.current();
        payable(eventOrganiser).transfer(ticketPrice);
        transferFrom(ownerOf(saleTicketId), msg.sender, saleTicketId);
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
