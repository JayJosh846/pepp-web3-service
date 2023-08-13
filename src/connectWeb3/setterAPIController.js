const {tokenContract, nftContract, operationsContract,factoryContract} = require("../resources/web3config.js");
const Web3 = require('web3');
const web3 = new Web3();
const { userTrx, adminTrx, increaseGasPrice  } = require("./localGNS.js");
const { signERC2612Permit } = require('eth-permit');
const ethers = require("ethers");
const { Config } = require("../utils");
const { createLogger, format, transports } = require('winston');

const { setBantuKeypair,
  setERC20Keypair,
} = require("../utils/awsKeypair.js")
const {
  fundNewBantuAccount,
  creditAssetToUser,
  createBantuAssetTrustLine,
  transferAsset,
  deductUserAssetBalance } = require("./bantuSetter.js")

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console({})],
});

const BANTU_NETWORK = Config.BANTU_NETWORK;
const BANTU_NETWORK_PASSPHRASE = Config.BANTU_NETWORK_PASSPHRASE;
const ASSET_CODE = Config.ASSET_CODE;
const DISTRIBUTION_SECRET_KEY = Config.DISTRIBUTION_SECRET_KEY;
const ISSUER_ADDRESS = Config.ISSUER_ADDRESS;
const DISTRIBUTION_PUBLIC_KEY = Config.DISTRIBUTION_PUBLIC_KEY;
const ADMIN = Config.ADMIN;



//////////      Account Management        ////////////


exports.createAccount = async (email, network) => {
  switch (network) {
    case "bantu":
      try {
        let account = await setBantuKeypair(email)
        const fundRes = await fundNewBantuAccount(account.publicKey(), 1);
        if (!fundRes)
          throw new Error("Something went wrong while creating a BANTU account");
        return account;
      } catch (error) {
        let err = {
          name: "Bantu-CreateAccount",
          error: error.message,
        };
        console.log(error);
        throw err;
      }
      break;
      case "matic":
      try {
        let account = await setERC20Keypair(email);
        return account;
      } catch (error) {
        let err = {
          name: "Web3-CreateAccount",
          error: error.message,
        };
        console.log(error);
        throw err;
      }
      break;
      default:
      break;
  }
}

/**
 * @name AddAdmin
 * @description This adds more Admin to the system and it called only by
 * the SuperAdmin using the BlockchainTrxAdmin function above.
 * @param {string} _adminAddress: Blockchain Account of the Admin to be added
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.addAdmin = async (_adminAddress) => {
  try {
    logger.info("Add Admin");
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'AddAdmin', _adminAddress)
    logger.info("Added Admin",tranxHash)
    return tranxHash
  } catch (error) {
    logger.error("Add Admin",error);
    let err = {
      name: "Web3-AddAdmin",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name RemoveAdmin
 * @description This removes any Admin except the SuperAdmin from the system by the Admin
 * @param {string} _adminAddress: Blockchain Account of the Admin to be removed
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.removeAdmin = async (_adminAddress) => {
  try {
    logger.info("Remove Admin");
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'RemoveAdmin', _adminAddress)
    logger.info("Admin Removed",tranxHash)
    return tranxHash
  } catch (error) {
    let err = {
      name: "Web3-RemoveAdmin",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name AddAuthorizer
 * @description This adds more Authorizer to the system and it called only by
 * the SuperAdmin using the BlockchainTrxAdmin function above.
 * @param {string} _adminAddress: Blockchain Account of the Authorizer to be added
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.addAuthorizer = async (_authAddress) => {
  try {
    logger.info("Add Authorizer", _authAddress);
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'AddAuthorizer', _authAddress)
    logger.info("Authorizer Added",tranxHash)
    return tranxHash
  } catch (error) {
    let err = {
      name: "Web3-AddAuthorizers",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name RemoveAuthorizer
 * @description This removes any Authorizer except the SuperAdmin from the system by the Admin
 * @param {string} _authAddress: Blockchain Account of the Authorizer to be removed
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.removeAuthorizer = async (_authAddress) => {
  try {
    logger.info("Remove Authorizer", _authAddress);
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'RemoveAuthorizer', _authAddress)
    logger.info("Authorizer Removed",tranxHash)
    return tranxHash
  } catch (error) {
    let err = {
      name: "Web3-RemoveAuthorizers",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name AddBlackList
 * @description This adds more addresses to the BlackList and it can be 
 * called by Admin using the BlockchainTrx function above.
 * @param {string} _address: Blockchain Account of the BlackListed
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.addBlackList = async (_address) => {
  try {
    logger.info("Add Blacklist", _address);
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'AddBlackList', _address)
    logger.info("Blacklist Added",tranxHash)
    return tranxHash
  } catch (error) {
    let err = {
      name: "Web3-AddBlackList",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name RemoveBlackList
 * @description This removes any Authorizer except the SuperAdmin from the system by the Admin
 * @param {string} _adminAddress: Blockchain Account of the Admin to be removed
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.removeBlackList = async (_address) => {
  try {
    logger.info("Remove Blacklist", _address);
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'RemoveBlackList', _address)
    logger.info("Blacklist Removed",tranxHash)
    return tranxHash
  } catch (error) {
    let err = {
      name: "Web3-RemoveBlackList",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name SetUserList
 * @description This can WhiteLists all account on the system by the Admin. This is
 * to show active accounts in the system.
 * @param {string} _address: Blockchain account address of the Admin user
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.addUserList = async (_address) => {
  try {
    logger.info("Add User", _address);
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'SetUserList', _address)
    logger.info("User Added",tranxHash)
    return tranxHash
  } catch (error) {
    logger.error("User Added", JSON.stringify(error.message));
    let err = {
      name: "Web3-addUserList",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name RemoveUserList
 * @description This Removes any WhiteList Addresses from the system. Can be call by any Admin
 * @param {string} _address: Blockchain account to be removed
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.removeUserList = async (_address) => {
  try {
    logger.info("Remove User", _address);
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'RemoveUserList', _address)
    
    return tranxHash
  } catch (error) {
    logger.error("User Removed", JSON.stringify(error.message));
    let err = {
      name: "Web3-RemoveUserList",
      error: error.message,
    };
    throw err;
  }
};

//////////      Contract Management        ////////////

/**
 * @name PauseContract
 * @description This is to pause the contract to create an emergency stop
 *  and it can only be called by the SuperAdmin. 
 * 
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.pause = async () => {
  try {
    logger.info("Pause Operation");
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'pause')

    return tranxHash
  } catch (error) {
    logger.error("Operation Paused", JSON.stringify(error.message));
    let err = {
      name: "Web3-PauseContract",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name UnpauseContract
 * @description This is to unpause the contract to create an emergency stop
 *  and it can only be called by the SuperAdmin. 
 * 
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.unpause = async () => {
  try {
    logger.info("UnPause Operation");
    const result = operationsContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'unpause')
    logger.info("Operation UnPaused",tranxHash)
    return tranxHash
  } catch (error) {
    logger.error("Operation UnPaused", JSON.stringify(error.message));
    let err = {
      name: "Web3-UnpauseContract",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name InitiateOwnershipTransfer
 * @description To initiate the transfer of the Ownership of the Contract to 
 * an Admin and Authorised Account and it can only be called by the SuperAdmin (Owner) 
 * 
 * @param {string} _proposedOwner: Address of the New Owner
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.initiateOwnershipTransfer = async (_proposedOwner) => {
  try {
    const result = await contract.methods.initiateOwnershipTransfer(_proposedOwner);
    const sendtx = await BlockchainTrx(result, _sender, _senderPswd);

    return sendtx.status;
  } catch (error) {
    let err = {
      name: "Web3-InitiateOwnershipTransfer",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name CompleteOwnershipTransfer
 * @description This Completes the Contract ownership transfer process
 * and it can be called by the new Owner. 
 * 
 * @param {string} _proposedOwner: Address of the new owner
 * @param {string} _proposedOwnerPswd: The password of the new owner
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.completeOwnershipTransfer = async (_proposedOwner, _proposedOwnerPswd) => {
  try {
    const result = await contract.methods.completeOwnershipTransfer();
    const sendtx = await BlockchainTrx(result, _proposedOwner, _proposedOwnerPswd);

    return sendtx.status;
  } catch (error) {
    let err = {
      name: "Web3-CompleteOwnershipTransfer",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name CancelOwnershipTransfer
 * @description To initiate the transfer of the Ownership of the Contract to 
 * an Admin and Authorised Account and it can only be called by the SuperAdmin (Owner) 
 * 
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.cancelOwnershipTransfer = async () => {
  try {
    const result = await contract.methods.cancelOwnershipTransfer();
    const sendtx = await adminTrx(result, _sender, _senderPswd);

    return sendtx.status;
  } catch (error) {
    let err = {
      name: "Web3-CancelOwnershipTransfer",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name SetParams
 * @description This transfer tokens from a Registered account to another 
 * registered account and it can be called by anyone who is registered on the system 
 * 
 * @param {string} _newBasisPoints: 
 * @param {string} _newMaxFee: 
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.setParams = async (_newBasisPoints, _newMaxFee) => {
  try {
    logger.info("Set Fee Params");
    const result = tokenContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'setParams', _newBasisPoints, _newMaxFee)
    
    return tranxHash
  } catch (error) {
    logger.error("Fee Params Set", JSON.stringify(error.message));
    let err = {
      name: "Web3-Params",
      error: error,
    };
    throw err;
  }
};

//////////      Transaction Management       ////////////

/**
 * @name transfer from the SuperAdmin Account
 * @description This transfer tokens from a Registered account to another 
 * registered account and it can be called by anyone who is registered on the system 
 * 
 * @param {string} _receiver: Address which will receive the tokens
 * @param {string} _value: The amount to be sent
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.transferAdmin = async (_receiver, _value) => {
  try {
    const value = ethers.utils.parseUnits(_value, "mwei")

    logger.info("Admin Transfer");
    const result = tokenContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'transfer', _receiver, value)
    logger.info("Admin Transferred",tranxHash)

    return tranxHash
  } catch (error) {
    logger.error("Admin Transfer", JSON.stringify(error.message))
    let err = {
      name: "Web3-TransferBySuperAdmin",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name transfer
 * @description This transfer tokens from a Registered account to another 
 * registered account and it can be called by anyone who is registered on the system 
 * 
 * @param {string} _senderPswd: The password of the sender
 * @param {string} _receiver: Address which will receive the tokens
 * @param {string} _value: The amount to be sent
 * @returns {Boolean} object with transaction status; true or throws
 */
exports.transfers = async (email, _receiver, _value, network) => {
  let accountBantu = await setBantuKeypair(email)
  let accountERC = await setERC20Keypair(email)

  switch (network) {
  case "matic":
  try {
    const value = ethers.utils.parseUnits(_value, "mwei")
    logger.info("User Transfer");
    const result = tokenContract(accountERC.privateKey)
    const tranxHash = userTrx(result, 'transfer', _receiver, value.toString())

    return tranxHash
  } catch (error) {
    logger.error("User Transfer", JSON.stringify(error.message))
    let err = {
      name: "Web3-Transfer",
      error: error.message,
    };
    throw err;
  }
  break;
  case "bantu":
    try {
      const resultTrustLine = await createBantuAssetTrustLine(
        accountBantu.secret(),
        ASSET_CODE,
        ISSUER_ADDRESS
      );

      if (!resultTrustLine) {
        throw new Error("Could not create Trust Line");
      }

      const sendtx = await transferAsset(
        _value,
        accountBantu.secret(),
        _receiver
      )
      return sendtx;
    } catch (error) {
      let err = {
        name: "Bantu-transfer",
        error: error,
      };
      throw err;
    }
    break;
  default:
    break;

}
};

/**
 * @name Minting
 * @description This Mints tokens to the SuperAdmin Account. It is only called 
 * by the SuperAdmin.
 * 
 * @param {string} _value: The amount to be Minted.
 * @returns {Boolean} object with transaction status; true or throws.
 */
exports.minting = async (_value, email, network) => {
  let accountBantu = await setBantuKeypair(email)
  let accountERC = await setERC20Keypair(email)

  switch (network) {
    case "matic":
  try {
    logger.info("Minting");
    let value = ethers.utils.parseUnits(_value, "mwei")
    const result = tokenContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'mint', value, accountERC.address)

    return tranxHash
  } catch (error) { 
    logger.error("Minting", JSON.stringify(error.message))
    let err = {
      name: "Web3-MintingToken",
      error: error.message,
    };
    throw err;
  }
  break;
  case "bantu":
    try {
      const resultTrustLine = await createBantuAssetTrustLine(
        accountBantu.secret(),
        ASSET_CODE,
        ISSUER_ADDRESS
      );

      if (!resultTrustLine) {
        throw new Error("Could not create Trust Line");
      }

      const sendtx = await creditAssetToUser(
        _value,
        ASSET_CODE,
        accountBantu.publicKey()
      )
      return sendtx;
    } catch (error) {
      let err = {
        name: "Bantu-MintingToken",
        error: error,
      };
      throw err;
    }
    break;
  default:
    break;
  }
};

/**
 * @name Redeeming
 * @description This redeems tokens from the SuperAdmin's Account. It is only called 
 * by the SuperAdmin.
 * @param {string} _senderPswd: The password of the sender
 * @param {string} _amount: The amount to be redeemed.
 * @returns {Boolean} object with transaction status; true or throws.
 */
exports.redeeming = async (email, _amount, network) => {
  let accountBantu = await setBantuKeypair(email)
  let accountERC = await setERC20Keypair(email)

  switch (network) {
    case "matic":
  try {
    let value = ethers.utils.parseUnits(_amount, "mwei");

    logger.info("Token Redeem");
    const result = tokenContract(accountERC.privateKey)
    const tranxHash = userTrx(result, 'redeem', value)

    return tranxHash
  } catch (error) {
    logger.error("Token Redeem", JSON.stringify(error.message))
    let err = {
      name: "Web3-RedeemingToken",
      error: error.message,
    };
    throw err;
  }
  break;
  case "bantu":
    try {
      const resultTrustLine = await createBantuAssetTrustLine(
        accountBantu.secret(),
        ASSET_CODE,
        ISSUER_ADDRESS
      );

      if (!resultTrustLine) {
        throw new Error("Could not create Trust Line");
      }

      const sendtx = await deductUserAssetBalance(
        _amount,
        accountBantu.secret()
      )
      return sendtx;
    } catch (error) {
      let err = {
        name: "Bantu-Burn",
        error: error,
      };
      throw err;
    }
    break;
  default:
    break;

}
};

/**
 * @name Approve
 * @description This redeems tokens from the SuperAdmin's Account. It is only called 
 * by the SuperAdmin.
 * @param {string} _tokenOwnerPswd: The _tokenOwnerPswd to be redeemed.
 * @param {string} _spenderAddr: The _spenderAddr to be redeemed.
 * @param {string} _value: The _value to be redeemed.
 * @returns {Boolean} object with transaction status; true or throws.
 */
exports.approve = async ( _tokenOwnerPswd, _spenderAddr, _value) => {
  try {
        const value = ethers.utils.parseUnits(_value, "mwei");
        // logger.info("Approve");
        // const wallet = tokenContract(_tokenOwnerPswd);
        // const nonce = await wallet.getTransactionCount("latest");
        // // const blockTime = await web3.eth.getBlock('latest');
        // const deadline =  ethers.constants.MaxUint256;
        // console.log("deadline", deadline)
        // const signature = await signERC2612Permit(wallet, tokenAddress, _tokenOwnerAddr, _spenderAddr, value, deadline, nonce);
        // const result = tokenContract.permit(_tokenOwnerAddr, _spenderAddr, value, signature.deadline, signature.v, signature.r, signature.s)
        // const sendtx = await userTrx(result, tokenAddress, _tokenOwnerAddr,_tokenOwnerPswd);

      logger.info("Token Approve");
      const result = tokenContract(_tokenOwnerPswd)
      const tranxHash = userTrx(result, 'increaseAllowance', _spenderAddr, value)
  
      return tranxHash
  } catch (error) {
    logger.error("Token Approve", JSON.stringify(error.message))
    let err = {
      name: "Web3-Approve",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name Approve
 * @description This redeems tokens from the SuperAdmin's Account. It is only called 
 * by the SuperAdmin.
 * @param {string} _tokenOwnerPswd: The _tokenOwnerPswd to be redeemed.
 * @param {string} _spenderAddr: The _spenderAddr to be redeemed.
 * @param {string} _value: The _value to be redeemed.
 * @returns {Boolean} object with transaction status; true or throws.
 */
 exports.disApprove = async (_tokenOwnerPswd, _spenderAddr, _value) => {
  try {
      const value = ethers.utils.parseUnits(_value, "mwei");
      logger.info("Token Disapprove");
      const result = tokenContract(_tokenOwnerPswd)
      const tranxHash = userTrx(result, 'decreaseAllowance', _spenderAddr, value)
  
      return tranxHash
  } catch (error) {
    logger.error("Token Disapprove", JSON.stringify(error.message))
    let err = {
      name: "Web3-Disapprove",
      error: error.message,
    };
    throw err;
  }
};

/**
 * @name TransferFrom
 * @description This enables the transfer of tokens from Beneficiary to vendor.
 * It can be called by any registered user
 * @param {string} _tokenOwerAddr: The _tokenOwerAddr to be transfer from.
 * @param {string} _to: The _newOwerAddr to be transfer to.
 * @param {string} _spenderPwsd: The _spenderPwsd the password of the msg.sender.
 * @param {string} _value: The amount to be redeemed.
 * @returns {Boolean} object with transaction status; true or throws.
 */
exports.transferFrom = async (_tokenOwnerAddr, _receiverAddr, _spenderPwsd, _value) => {
    try {
        let value = ethers.utils.parseUnits(_value, "mwei");

        logger.info("Token TransferFrom");
        const result = tokenContract(_spenderPwsd)
        const tranxHash = userTrx(result, 'transferFrom', _tokenOwnerAddr, _receiverAddr, value)

        return tranxHash
    } catch (error) {
      logger.error("Transferred Token From", JSON.stringify(error.message))
        let err = {
            name: "Web3-TransferFrom",
            error: error.message,
        };
        throw err;
    }
};

/**
 * @name DestroyBlackFunds
 * @description This distroys the tokens of a Bad act which has been BlackListed.
 * It is only called by the SuperAdmin.
 * 
 * @param {string} _evilUser: The address whose funds are to be distroyed.
 * @returns {Boolean} object with transaction status; true or throws.
 */
exports.destroyBlackFunds = async (_evilUser) => {
  try {
    logger.info("User Fund Destroy");
    const result = tokenContract(Config.ADMIN_PASS)
    const tranxHash = adminTrx(result, 'DestroyBlackFunds', _evilUser)

    return tranxHash
  } catch (error) {
    logger.error("Destroyed User Fund", JSON.stringify(error.message))
    let err = {
      name: "Web3-DestroyBlackFunds",
      error: error.message,
    };
    throw err;
  }
};

exports.increaseGasPrice = async (...args)=>{
  try {
    logger.info("increase gas and price");
    const contract = args[0] === "token" ? tokenContract : nftContract;
    const password = (args[2] === undefined || args[2] === null || args[2] === "") ? Config.ADMIN_PASS : args[2];
    const result = contract(password)
    const params = [];
    for (let index = 3; index < args.length; index++) {
          params.push(args[index]);
    }
    const tranxHash = increaseGasPrice(result, args[1], ...params);
    return tranxHash
  } catch (error) {
    logger.error("increase gas and price", JSON.stringify(error.message))
    let err = {
      name: "increase gas price",
      error: error.message,
    };
    throw err;
  }
}



