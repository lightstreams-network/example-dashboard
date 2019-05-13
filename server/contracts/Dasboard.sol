pragma solidity ^0.5.0;

import './Profile.sol';
import './leth/permissioned_file.sol';

contract Dashboard is Ownable {

    event UpdateRootData(address _holder, string  _nextid);
    event NewUserAdded(address _holder, string  _username);

    mapping(bytes32 => address) public _users;
    mapping(address => string) _usernames;
    mapping(address => Profile) _profiles;
    mapping(address => string) _rootIPFSs;

    function createUser(address _holder, string memory _username, address _profile, string memory _rootIpfs) onlyOwner public {
        _usernames[_holder] = _username;
        _profiles[_holder] = Profile(_profile);
        _rootIPFSs[_holder] = _rootIpfs;

        _users[_stringToBytes32(_username)] = _profiles[_holder].owner();
        emit NewUserAdded(_holder, _username);
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

    function updateRootIPFS(address _holder, string memory _nextRootIpfs) onlyOwner public {
        _rootIPFSs[_holder] = _nextRootIpfs;
    }

    function findUsername(address _holder) onlyOwner public view returns (string memory) {
        return _usernames[_holder];
    }

    function findProfile(address _holder) onlyOwner public view returns (address) {
        return address(_profiles[_holder]);
    }

    function findRootIPFS(address _holder) onlyOwner public view returns (string memory) {
        return _rootIPFSs[_holder];
    }

    function grantReadAccess(address _holder, int32 itemId, address _beneficiary) onlyOwner public {
        PermissionedFile(_profiles[_holder].itemAcl(itemId)).grantRead(_beneficiary);
    }

    function revokeAccess(address _holder, int32 itemId, address _beneficiary) onlyOwner public {
        PermissionedFile(_profiles[_holder].itemAcl(itemId)).revokeAccess(_beneficiary);
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