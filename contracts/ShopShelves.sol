pragma solidity ^0.5.0;

import './utils/SafeMath.sol';
import './leth/permissioned_file.sol';

contract ShopShelves {
    using SafeMath for uint256;

    event StackBook(uint32 _bookId);

    event PurchasedBook(uint32 _bookId, address _purchaser, uint256 _price);

    struct Book {
        string title;
        address payable owner;
        uint256 price;
        string file;
        string cover;
        address acl;
        mapping(address => bool) purchasers;
    }

    uint32 public lastBookId;
    mapping(uint32 => Book) public shelves; // Key map is the meta

    function stackBook(string memory title, uint256 price, string memory file, string memory cover, address acl) public {
        lastBookId = lastBookId + 1;
        Book memory newBook = Book(title, msg.sender, price, file, cover, acl);
        shelves[lastBookId] = newBook;

        emit StackBook(lastBookId);
    }

    function purchase(uint32 bookId) public payable {
        require(shelves[bookId].owner != address(0x0));
        require(shelves[bookId].price <= msg.value);

        PermissionedFile(address(shelves[bookId].acl)).grantRead(msg.sender);

        shelves[bookId].purchasers[msg.sender] = true;
        shelves[bookId].owner.transfer(msg.value);

        emit PurchasedBook(bookId, msg.sender, msg.value);
    }

    function hasPurchased(uint32 bookId, address purchaser) public view returns (bool) {
        return shelves[bookId].purchasers[purchaser];
    }
}