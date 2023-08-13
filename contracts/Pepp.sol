// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./Operations.sol";

/// @custom:security-contact charles@withconvexity.com
contract Pepp is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20SnapshotUpgradeable, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
   using SafeMath for uint256;
    Operations public operations;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    event Issue(uint256 amount, address indexed mintedTo);
    event Redeem(uint256 amount, address indexed redeemedFrom);
    event Params(uint256 feeBasisPoints, uint256 maxFee);

    uint256 public basisPointsRate;
    uint256 public maximumFee;
    uint256 public totalIssued;
    uint256 public totalRedeemed; 

    /**
     * @dev Fix for the ERC20 short address attack.
     */
    modifier onlyPayloadSize(uint256 size) {
        require(!(msg.data.length < size + 4));
        _;
    }
    

    function initialize(address _operations) initializer public {
        __ERC20_init("PEPP", "PEP");
        __ERC20Burnable_init();
        __ERC20Snapshot_init();
        __Ownable_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        operations = Operations(_operations);
        uint256 basisPointsRate = 0;
        uint256 maximumFee = 0;
    }

    function snapshot() public onlyOwner {
        _snapshot();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * Issue a new amount of tokens these tokens are deposited into the owner address
     * This is for issuing of token to the user or the beneficiary of the NGO
     * @param _amount Number of tokens to be issued
     */
    function mint(uint256 _amount, address _mintedTo)
    public
    nonReentrant
    onlyOwner
    {
        // require(operations.CheckUserList(_mintedTo), "User is not allowed to receive tokens");
        require(!operations.isBlackListedAddress(_mintedTo), "Account is BlackListed");
        _mint(_mintedTo, _amount);
        totalIssued = totalIssued.add(_amount);
        emit Issue(_amount, _mintedTo);
    }

    /**
     * Redeem tokens.
     * These tokens are withdrawn from the owner address. the balance must be enough to cover the redeem
     * or the call will fail.
     *
     * @param _amount Number of tokens to be issued
     */
    function redeem(uint256 _amount) 
    public 
    {
        // require(operations.CheckUserList(_msgSender()), "User is not allowed to receive tokens");
        require(!operations.isBlackListedAddress(_msgSender()), "Account is BlackListed");
        require(totalSupply() >= _amount, "Total supply is less than amount");
        require(balanceOf(_msgSender()) >= _amount, "Balance is less than amount");
        _burn(_msgSender(), _amount);
        totalRedeemed = totalRedeemed.add(_amount);
        emit Redeem(_amount, _msgSender());
    }

    function setParams(uint256 newBasisPoints, uint256 newMaxFee)
        public
        onlyOwner
    {
        require(newBasisPoints < 200, "Fee basis points should be less than 200");
        require(newMaxFee < 5, "Max fee should be less than 50");

        basisPointsRate = newBasisPoints;
        maximumFee = newMaxFee.mul(10**decimals());

        emit Params(basisPointsRate, maximumFee);
    }

    /**
     * @dev transfer token for a specified address
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
    function transfer(address _to, uint256 _value)
        public
        override
        returns (bool)
    {
        // require(operations.CheckUserList(_to), "User is not allowed to receive tokens");
        require(!operations.isBlackListedAddress(_to), "Account is BlackListed");

        uint256 fee = (_value.mul(basisPointsRate)).div(10000);
        if (fee > maximumFee) {
            fee = maximumFee;
        }
        if(fee > 0) {
            _transfer(_msgSender(), owner(), fee);
        }
        _transfer(_msgSender(), _to, _value.sub(fee));
        return true;
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint the amount of tokens to be transferred
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public
        override
        returns (bool) {
        // require(operations.CheckUserList(_to), "User is not allowed to receive tokens");
        require(!operations.isBlackListedAddress(_to), "Account is BlackListed");

        uint256 fee = (_value.mul(basisPointsRate)).div(10000);
        if (fee > maximumFee) {
            fee = maximumFee;
        }
        if (fee > 0) {
            _transfer(_from, owner(), fee);
        }

        address spender = _msgSender();
        _spendAllowance(_from, spender, _value);
        _transfer(_from, _to, _value.sub(fee));
        return true;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override(ERC20Upgradeable, ERC20SnapshotUpgradeable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
