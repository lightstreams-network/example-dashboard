pragma solidity ^0.5.0;

import './Profile.sol';

contract Dashboard {

    event UpdateRootData(address _account, string _nextid);
    event NewUserAdded(address _account, string _username);

    mapping(bytes32 => address) public _users;
    mapping(address => string) _usernames;
    mapping(address => Profile) _profiles;
    mapping(address => string) _rootIPFSs;
    mapping(address => address) _holders;
    address public _publicAcl;

    constructor(address acl) public {
        _publicAcl = acl;
    }

    function createUser(address _account, string memory _username, address _profile, string memory _rootIpfs) public {
        _usernames[_account] = _username;
        _profiles[_account] = Profile(_profile);
        _rootIPFSs[_account] = _rootIpfs;
        _holders[_account] = msg.sender;

        _users[_stringToBytes32(_username)] = _profiles[_account].owner();
        emit NewUserAdded(_account, _username);
    }

    function findUser(string memory _username) public view returns (address) {
        return _users[_stringToBytes32(_username)];
    }

    function username() public view returns (string memory) {
        return _usernames[msg.sender];
    }

    function profile() public view returns (address) {
        return address(_profiles[msg.sender]);
    }

    function rootIPFS() public view returns (string memory) {
        return _rootIPFSs[msg.sender];
    }

    function publicAcl() public view returns (address) {
        return _publicAcl;
    }

    function updateRootIPFS(address _account, string memory _nextRootIpfs) public {
        _rootIPFSs[_account] = _nextRootIpfs;
    }

    function updateHolder(address _account, address _nextHolder) public {
        require(_account == msg.sender);
        _holders[_account] = _nextHolder;
    }

    function findUsername(address _account) public view returns (string memory) {
        return _usernames[_account];
    }

    function findProfile(address _account) public view returns (address) {
        return address(_profiles[_account]);
    }

    function findRootIPFS(address _account) public view returns (string memory) {
        return _rootIPFSs[_account];
    }

    function _stringToBytes32(string memory source) internal view returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}