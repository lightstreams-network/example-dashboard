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

    function requestTopUp(address destAddr) public {
        require(balance > topUpLimit);
        require(topUpList[addr] == 0);

        topUpList[addr] = topUpLimit;
        destAddr.transfer(topUpList);
        balance -= topUpList;
    }
}