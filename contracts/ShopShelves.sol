pragma solidity ^0.5.0;

import './utils/SafeMath.sol';

contract ShopShelves {
    using SafeMath for uint256;

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

    function stackBook(string memory title, uint256 price, string memory file, string memory cover, address acl) public returns (uint32){
        lastBookId = lastBookId + 1;
        Book memory newBook = Book(title, msg.sender, price, file, cover, acl);
        shelves[lastBookId] = newBook;
        return lastBookId;
    }

    function purchase(uint32 bookId) public payable {
        require(shelves[bookId].owner != address(0x0));
        require(shelves[bookId].price <= msg.value);
        require(shelves[bookId].purchasers[msg.sender] == false);

        // acl.GrantRead(msg.sender); // TODO

        shelves[bookId].purchasers[msg.sender] = true;
        shelves[bookId].owner.transfer(msg.value);
    }

    function hasPurchased(uint32 bookId, address purchaser) public view returns (bool) {
        return shelves[bookId].purchasers[purchaser];
    }
}