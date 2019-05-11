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

    function stackItem(string memory title, string memory description, string memory meta, address acl) onlyOwner public {
        lastItemId = lastItemId + 1;
        Content memory newItem = Content(title, description, meta, acl);
        items[lastItemId] = newItem;
        emit StackItem(lastItemId);
    }
}