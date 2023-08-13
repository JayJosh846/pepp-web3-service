const ethers = require("ethers");
const crypto = require("crypto")
const sha256 = require('simple-sha256')
const Wallet = ethers.Wallet;
const { Keypair } = require("stellar-sdk");
const { providerTron } = require("../resources/web3config")


// Create a new ERC20 Account
const createNewERCAccount = async ({ mnemonicString, userSalt }) => {
  let hash = sha256.sync(mnemonicString);
  let salt = userSalt;
  let buffer = crypto.scryptSync(hash, salt, 32, {
    N: Math.pow(2, 14),
    r: 8,
    p: 1,
  });
  
  const generatedKeyPair = new Wallet(buffer);
  return generatedKeyPair;
};

  // Create a new Bantu Account
  const createNewBantuAccount = async ({ mnemonicString, userSalt }) => {
    let hash = sha256.sync(mnemonicString);
    let salt = userSalt;
    let buffer = crypto.scryptSync(hash, salt, 32, {
      N: Math.pow(2, 14),
      r: 8,
      p: 1,
    });
    // bip39.mnemonicToSeedSync(mnemonicString, salt);
    const generatedKeyPair = Keypair.fromRawEd25519Seed(buffer);
    // generatedKeyPair
    //   ? console.log("Kaypair success", generatedKeyPair)
    //   : console.log("Keypair error");
    return generatedKeyPair;
  }

  module.exports = {
    createNewERCAccount,
    createNewBantuAccount,

}