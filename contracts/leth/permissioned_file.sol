pragma solidity ^0.5.0;

contract Permissioned {
    address public owner;

    /**
     * The higher permission automatically contains all lower permissions.
     *
     * E.g, granting WRITE, automatically grants READ permission.
     *
     * Do NOT shuffle these values as business logic in Go codebase is based on their order.
     *
     * @see go-lightstreams/lethacl/permission.go
     *
     * NO_ACCESS uint value is 0
     * READ      uint value is 1
     * WRITE     uint value is 2
     * ADMIN     uint value is 3
    */
    enum Level {NO_ACCESS, READ, WRITE, ADMIN}

    struct Permission {
        Level level;
    }

    mapping(address => Permission) permissions;

    event PermissionGranted(address account, Level level);

    constructor(address _owner) internal {
        owner = _owner;

        permissions[_owner] = Permission({
            level: Level.ADMIN
        });
    }

    modifier onlyAdmin {
        require(permissions[msg.sender].level >= Level.ADMIN, "Only user with Admin permission lvl can call this function.");
        _;
    }

    function revokeAccess(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.NO_ACCESS
        });

        emit PermissionGranted(account, Level.NO_ACCESS);
    }

    function grantRead(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.READ
        });

        emit PermissionGranted(account, Level.READ);
    }

    function grantWrite(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.WRITE
        });

        emit PermissionGranted(account, Level.WRITE);
    }

    function grantAdmin(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.ADMIN
        });

        emit PermissionGranted(account, Level.ADMIN);
    }

    function hasRead(address account) public view returns (bool hasReadAccess) {
        return permissions[account].level >= Level.READ;
    }

    function hasAdmin(address account) public view returns (bool hasAdminAccess) {
        return permissions[account].level >= Level.ADMIN;
    }

    function getOwner() public view returns (address fileOwner) {
        return owner;
    }
}

contract PermissionedFile is Permissioned {
    constructor(address _owner) public Permissioned(_owner) {
    }
}