pragma solidity ^0.5.0;

import './utils/SafeMath.sol';
import './utils/Ownable.sol';

contract Faucet is Ownable {
    using SafeMath for uint256;

    uint256 private constant decimalFactor = 10 ** uint256(18);

    uint public topUpLimit = 2 * decimalFactor;
    uint public minTopUp = 1 * decimalFactor;
    mapping(address => uint) public topUpRecords;
    uint public balance;

    constructor() public {
    }

    function() external payable {
        balance = balance.add(msg.value);
    }

    function setNewLimit(uint256 _nextLimit) onlyOwner public {
        require(_nextLimit >= minTopUp);
        topUpLimit = _nextLimit;
    }

    function topUp(address payable _beneficiary, uint256 _requestAmount) public {
        require(balance >= _requestAmount);
        require(_requestAmount.add(topUpRecords[_beneficiary]) <= topUpLimit);

        topUpRecords[_beneficiary] = _requestAmount.add(topUpRecords[_beneficiary]);
        balance = balance.sub(_requestAmount);
        _beneficiary.transfer(_requestAmount);
    }
}