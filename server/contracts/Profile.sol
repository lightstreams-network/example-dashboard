pragma solidity ^0.5.0;

import './utils/Ownable.sol';

contract Profile is Ownable {

    event StackItem(uint32 _itemId);

    struct Content {
        string title;
        string description;
        string meta;
        address acl;
    }

    mapping(uint32 => Content) public items; // Key map is the meta
    uint32 public lastItemId;
    address holder;

    constructor (address _holder) public {
        holder = _holder;
    }

    function stackItem(string memory title, string memory description, string memory meta, address acl) onlyAuthorized public {
        lastItemId = lastItemId + 1;
        Content memory newItem = Content(title, description, meta, acl);
        items[lastItemId] = newItem;
        emit StackItem(lastItemId);
    }

    /**
   * @dev Throws if called by any account other than the owner.
   */
    modifier onlyAuthorized() {
        require(isAuthorized());
        _;
    }

    /**
   * @return true if `msg.sender` is the owner of the contract or profile owner
   */
    function isAuthorized() public view returns (bool) {
        return isOwner() || msg.sender == holder;
    }
}