pragma solidity ^0.5.0;

contract LibraryShelves {

    mapping(string => Book) public shelves; // Key map is the meta
    mapping(address => uint) writeBalance;

    struct Book {
        string title;
        address owner;
        uint8 price;
        address acl;
        string cover;
        mapping(address => bool) purchasers;
    }

    function stackBook(string title, uint price, string cover, string meta, address acl) public {
        require(shelves[meta] == 0);
        Book storage newBook;
        newBook[title] = title;
        newBook[price] = price;
        newBook[acl] = acl;
        newBook[owner] = msg.sender;
        shelves[meta] = newBook;
    }

    function purchase(string bookId) public payable {
        require(shelves[bookId] != 0);
        require(shelves[bookId][price] < msg.value);
        shelves[bookId][purchasers].append(msg.sender);
        acl.grant("read", msg.sender); // TODO
        writeBalance[shelves[bookId][owner]] = writeBalance[shelves[bookId][owner]] + msg.value;
    }

    function cashOut() public {
        require(writeBalance[msg.sender] != 0);
        writeBalance[msg.sender] = 0;
        msg.sender.transfer(writeBalance[msg.sender]);
    }
}