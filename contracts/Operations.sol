// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @dev Contract module for user management.
 *
 * This module is used through inheritance. It will make available the contract
 * addresses of users, admin, whitelisting and blacklisting of users.
 */
contract Operations is Initializable, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    // To Check and Balance the System Account.
    uint256 internal _totalIssued;
    uint256 internal _totalRedeemed;

    address[] private admins;
    address[] private authorizers;
    address[] private usersList;
    address[] private blackList;

    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isAuthorizer;
    mapping(address => bool) public isUserListed;
    mapping(address => bool) public isBlackListed;

    event AddedAdmin(address indexed _admin);
    event RemovedAdmin(address indexed _admin);
    event AddedAuthorizer(address indexed _authorizer);
    event RemovedAuthorizer(address indexed _authorizer);
    event SetAddressList(address indexed _user);
    event RemoveAddressList(address _user);
    event AddedBlackList(address _user);
    event RemovedBlackList(address _user);
    event DestroyedBlackFunds(address _User, uint256 _amount);

    modifier isAdminAddr(address _admin) {
        require(isAdmin[_admin], "Admin does not exist");
        _;
    }

    modifier notAdmin(address admin) {
        require(!isAdmin[admin], "Account already Admin");
        _;
    }

    modifier isAuthorizerAddr(address authorizer) {
        require(isAuthorizer[authorizer], "Account not Authorized");
        _;
    }

    modifier notAuthorizer(address authorizer) {
        require(!isAuthorizer[authorizer], "Account already authorized");
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0x0), "No provided account");
        _;
    }

    modifier checkUserList(address _user) {
        require(isUserListed[_user], "Account not a User");
        _;
    }

     /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    

    function initialize()
    public initializer
     {
         __Ownable_init();
         __Pausable_init();
        isUserListed[_msgSender()] = true;
        usersList.push(_msgSender());

        AddAdmin(_msgSender());
        AddAuthorizer(_msgSender());
    }

    //adds address as admin and also authorizers the address
    function AddAdmin(address _AdminID)
        public
        onlyOwner
        notAdmin(_AdminID)
        checkUserList(_AdminID)
        whenNotPaused
        returns (bool)
    {
        admins.push(_AdminID);
        isAdmin[_AdminID] = true;

        emit AddedAdmin(_AdminID);

        return true;
    }

    //Removes and Admin
    function RemoveAdmin(address _addr)
        public
        onlyOwner
        isAdminAddr(_addr)
        returns (bool)
    {
        for (uint256 i = 0; i < admins.length - 1; i++)
            if (admins[i] == _addr) {
                admins[i] = admins[admins.length - 1];
                break;
            }
        admins.pop();
        isAdmin[_addr] = false;

        emit RemovedAdmin(_addr);

        return true;
    }

    //Get all listed Admins on the System
    function GetAdminList()
        public
        view
        isAdminAddr(_msgSender())
        returns (address[] memory)
    {
        return admins;
    }

    //Authorizer Rights and Functions
    function AddAuthorizer(address authorizer)
        public
        onlyOwner
        checkUserList(authorizer)
        notAuthorizer(authorizer)
        whenNotPaused
        returns (bool)
    {
        isAuthorizer[authorizer] = true;
        authorizers.push(authorizer);

        emit AddedAuthorizer(authorizer);

        return true;
    }

    // Remove authorizer
    function RemoveAuthorizer(address _authorizer)
        public
        onlyOwner
        isAuthorizerAddr(_authorizer)
        returns (bool)
    {
        for (uint256 i = 0; i < authorizers.length - 1; i++)
            if (authorizers[i] == _authorizer) {
                authorizers[i] = authorizers[authorizers.length - 1];
                break;
            }
        authorizers.pop();
        isAuthorizer[_authorizer] = false;

        emit RemovedAuthorizer(_authorizer);

        return true;
    }

    // Get all listed authorizers on the System
    function GetAuthorizerList()
        public
        view
        isAdminAddr(_msgSender())
        returns (address[] memory)
    {
        return authorizers;
    }

    // List users on the System
    function SetUserList(address _addr)
        public
        isAdminAddr(_msgSender())
        notNull(_addr)
        whenNotPaused
        returns (bool)
    {
        require(isUserListed[_addr] != true, "Address has been Whitelisted");
        isUserListed[_addr] = true;
        usersList.push(_addr);

        emit SetAddressList(_addr);

        return true;
    }

    // Remove users from whitelist
    function RemoveUserList(address _addr)
        public
        isAdminAddr(_msgSender())
        notNull(_addr)
        returns (bool)
    {
        require(isUserListed[_addr], "Address not a Listed User");

        if (isAdmin[_addr]) {
            RemoveAdmin(_addr);
        }

        for (uint256 i = 0; i < usersList.length - 1; i++)
            if (usersList[i] == _addr) {
                usersList[i] = usersList[usersList.length - 1];
                break;
            }
        usersList.pop();
        isUserListed[_addr] = false;

        emit RemoveAddressList(_addr);

        return true;
    }

    //check if user is listed
    function CheckUserList(address _addr)
        public
        view
        returns (bool)
    {
        return isUserListed[_addr];
    }

    //Get all listed users in the System
    function GetUsersList()
        public
        view
        isAdminAddr(_msgSender())
        returns (address[] memory)
    {
        return usersList;
    }

    // Add adress to BlackList
    function AddBlackList(address _evilUser)
        public
        isAdminAddr(_msgSender())
        checkUserList(_evilUser)
    {
        require(!isBlackListed[_evilUser], "User already BlackListed");

        if (isAdmin[_evilUser]) {
            RemoveAdmin(_evilUser);
        }
        if (isAuthorizer[_evilUser]) {
            RemoveAuthorizer(_evilUser);
        }

        blackList.push(_evilUser);
        isBlackListed[_evilUser] = true;

        emit AddedBlackList(_evilUser);
    }

    // Remove Address from BlackList
    function RemoveBlackList(address _clearedUser)
        public
        isAdminAddr(_msgSender())
        notNull(_clearedUser)
        returns (bool)
    {
        require(isBlackListed[_clearedUser], "Address not a Listed User");

        for (uint256 i = 0; i < usersList.length - 1; i++)
            if (blackList[i] == _clearedUser) {
                blackList[i] = blackList[blackList.length - 1];
                break;
            }
        blackList.pop();
        isBlackListed[_clearedUser] = false;

        emit RemovedBlackList(_clearedUser);

        return true;
    }

    //check if address is blacklisted
    function isBlackListedAddress(address _addr)
        public
        view
        returns (bool)
    {
        return isBlackListed[_addr];
    }

    //Get all who is blacklisted on the System
    function GetBlackListed()
        public
        view
        returns (address[] memory)
    {
        return blackList;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

}
