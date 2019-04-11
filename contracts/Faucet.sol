pragma solidity ^0.5.0;

import './utils/SafeMath.sol';
import './utils/Ownable.sol';

contract Faucet is Ownable {
    using SafeMath for uint256;

    uint public topUpAmount = 5;
    mapping(address => uint) public topUpList;

    uint public balance;

    constructor() public {
    }

    function() external payable {
        balance = balance.add(msg.value);
    }

    function setTopUpLimit(uint256 _nextLimit) onlyOwner public {
        topUpAmount = _nextLimit;
    }


    function requestTopUp(address payable _beneficiary, uint256 amount) public {
        require(balance > topUpAmount);
        require(topUpList[_beneficiary] < topUpAmount);

        topUpList[_beneficiary] = amount;
        balance = balance.sub(amount);
        _beneficiary.transfer(amount);
    }
}