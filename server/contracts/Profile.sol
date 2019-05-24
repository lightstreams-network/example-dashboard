pragma solidity ^0.5.0;

import './utils/Ownable.sol';

contract Profile is Ownable {

    event StackItem(int32 _itemId);

    struct Content {
        string title;
        string description;
        string meta;
        address acl;
    }

    mapping(int32 => Content) public items; // Key map is the meta
    int32 public lastItemId = -1;

    function stackItem(string memory title, string memory description, string memory meta, address acl) onlyOwner public {
        lastItemId = lastItemId + 1;
        Content memory newItem = Content(title, description, meta, acl);
        items[lastItemId] = newItem;
        emit StackItem(lastItemId);
    }
}