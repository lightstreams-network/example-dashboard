pragma solidity ^0.5.0;

import './Profile.sol';
import './leth/permissioned_file.sol';

contract DashboardUser is Ownable {

    event UpdateRootData(string  _nextid);

    string username;

    Profile profile;

    string rootDataId;

    address delegatedOwner;


    constructor(string memory _username, address _profile) public {
        username = _username;
        profile = Profile(address(_profile));
    }

    function setDelegatedOwner(address _delegatedOwner) onlyOwner public {
        delegatedOwner = _delegatedOwner;
    }

    function grantReadAccess(address _acl, address _beneficiary) onlyDelegatedOwner public {
        PermissionedFile(address(_acl)).grantRead(_beneficiary);
    }

    function setNextRootDataId(string memory _nextDataId) onlyDelegatedOwner public {
        rootDataId = _nextDataId;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyDelegatedOwner() {
        require(delegatedOwner == msg.sender);
        _;
    }
}