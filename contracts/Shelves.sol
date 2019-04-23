pragma solidity ^0.5.0;

import './utils/SafeMath.sol';
import './leth/permissioned_file.sol';

contract Shelves {
    using SafeMath for uint256;

    event StackContent(uint32 _itemId);

    event PurchaseContent(uint32 _itemId, address _purchaser, uint256 _price);

    struct Content {
        string title;
        address payable owner;
        uint256 price;
        string file;
        string cover;
        address acl;
    }

    mapping(uint32 => Content) public items; // Key map is the meta
    uint32 public lastItemId;

    function stackItem(string memory title, uint256 price, string memory file, string memory cover, address acl) public {
        lastItemId = lastItemId + 1;
        Content memory newBook = Content(title, msg.sender, price, file, cover, acl);
        items[lastItemId] = newBook;
        emit StackContent(lastItemId);
    }

    function purchase(uint32 _itemId) public payable {
        require(items[_itemId].owner != address(0x0));
        require(items[_itemId].price <= msg.value);

        PermissionedFile(address(items[_itemId].acl)).grantRead(msg.sender);
        items[_itemId].owner.transfer(msg.value);
        emit PurchaseContent(_itemId, msg.sender, msg.value);
    }

    function hasPurchased(uint32 _itemId, address _purchaser) public view returns (bool) {
        return PermissionedFile(address(items[_itemId].acl)).hasRead(_purchaser);
    }
}