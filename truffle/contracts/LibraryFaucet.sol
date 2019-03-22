pragma solidity ^0.5.0;

contract libraryFaucet {

    uint public topUpLimit = 5;
    mapping(address => uint) public topUpList;

    uint public balance;

    constructor() public {
    }

    function() external payable {
        balance = balance + msg.value;
    }

    function requestTopUp() public {
        require(balance > topUpLimit);
        require(topUpList[msg.sender] == 0);

        topUpList[msg.sender] = topUpLimit;
        msg.sender.transfer(topUpList);
        balance -= topUpList;
    }
}