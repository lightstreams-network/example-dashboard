pragma solidity ^0.5.0;

import './utils/Ownable.sol';
import './leth/permissioned_file.sol';

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

    function itemAcl(int32 _itemId) public returns (address) {
        return items[_itemId].acl;
    }

    function grantReadAccess(int32 itemId, address _beneficiary) onlyOwner public {
        PermissionedFile(address(items[itemId].acl)).grantRead(_beneficiary);
    }

    function revokeAccess(int32 itemId, address _beneficiary) onlyOwner public {
        PermissionedFile(address(items[itemId].acl)).revokeAccess(_beneficiary);
    }
}