const { Config } = require("../utils");
const {
  Asset,
  BASE_FEE,
  Keypair,
  Operation,
  Server,
  TransactionBuilder,
} = require("stellar-sdk");
const sha256 = require("simple-sha256");
const crypto = require("crypto");
const { setBantuKeypair } = require("../utils/awsKeypair.js");

const BANTU_NETWORK = Config.BANTU_NETWORK;
const BANTU_NETWORK_PASSPHRASE = Config.BANTU_NETWORK_PASSPHRASE;
const ASSET_CODE = Config.ASSET_CODE;
const DISTRIBUTION_SECRET_KEY = Config.DISTRIBUTION_SECRET_KEY;
const ISSUER_ADDRESS = Config.ISSUER_ADDRESS;
const DISTRIBUTION_PUBLIC_KEY = Config.DISTRIBUTION_PUBLIC_KEY;

exports.getAccountBalance = async (bantuPublicKey) => {
  try {
    const server = new Server(BANTU_NETWORK);
    const account = await server.loadAccount(bantuPublicKey);

    let balances = await Promise.all(
      account.balances.map((val, i) => {
        return {
          asset_type: val["asset_type"],
          asset_code:
            val["asset_code"] === "PEPP" ? "PEPP (XBN)" : val["asset_code"],
          balance: val["balance"],
        };
      })
    );

    return balances;
  } catch (error) {
    let err = {
      name: "Bantu-GetAccountBalance",
      error: error.message,
    };
    console.log(error);

    throw err;
  }
};

exports.createBantuAccount = async (email) => {
  try {
    let account = await setBantuKeypair(email);
    return account;
  } catch (error) {
    let err = {
      name: "Bantu-CreateAccount",
      error: error.message,
    };
    console.log(error);

    throw err;
  }
};

// Fund the newly created bantu account on the testnet
exports.fundNewBantuAccount = async (publicKey, amount) => {
  const baseUrl = BANTU_NETWORK;
  const networkPassphrase = BANTU_NETWORK_PASSPHRASE;

  const server = new Server(baseUrl);
  const keypair = Keypair.fromSecret(DISTRIBUTION_SECRET_KEY);
  var asset = new Asset.native();
  let credit_amount = amount.toString();
  return await server
    .loadAccount(publicKey)
    .then(async (_newAccount) => {
      return await server
        .loadAccount(keypair.publicKey())
        .then(function (account) {
          var transaction = new TransactionBuilder(account, {
            fee: BASE_FEE || 100,
            networkPassphrase: networkPassphrase,
          })
            .addOperation(
              Operation.payment({
                destination: publicKey,
                asset,
                amount: credit_amount,
              })
            )
            .setTimeout(100)
            .build();
          transaction.sign(keypair);
          return server.submitTransaction(transaction);
        })
        .then(function (result) {
          console.log("Account funded successfully. \n", result);
          return true;
        })
        .catch(async function (error) {
          console.log(
            "Error in funding new account",
            error,
            error.message,
            error.response.data.extras.result_codes
          );
          return false;
        });
    })
    .catch(async (err) => {
      if (err?.name == "NotFoundError") {
        console.log(err.toString(), "Error on loading account");
        return await server
          .loadAccount(keypair.publicKey())
          .then(function (account) {
            var transaction = new TransactionBuilder(account, {
              fee: BASE_FEE || 100,
              networkPassphrase: networkPassphrase,
            })
              .addOperation(
                Operation.createAccount({
                  destination: publicKey,
                  startingBalance: credit_amount,
                })
              )
              .setTimeout(100)
              .build();
            transaction.sign(keypair);
            return server.submitTransaction(transaction);
          })
          .then(function (result) {
            console.log("New Account funded successfully. \n", result);
            return true;
          })
          .catch((err) => {
            console.log("Retry new account creation and fund error", err);
            return false;
          });
      } else {
        console.log("Some other error");
        return false;
      }
    });
};

// Create a trust line to the asset before user can interact with assets, bantu block chain essential
exports.createBantuAssetTrustLine = async (
  bantuSecretKey,
  code = ASSET_CODE,
  issuerId = ISSUER_ADDRESS
) => {
  // First, the receiving account must trust the asset
  const baseUrl = BANTU_NETWORK;
  const networkPassphrase = BANTU_NETWORK_PASSPHRASE;

  const server = new Server(baseUrl);

  const keypair = Keypair.fromSecret(bantuSecretKey);

  var customAsset = new Asset(code, issuerId);

  return await server
    .loadAccount(keypair.publicKey())
    .then(function (account) {
      var transaction = new TransactionBuilder(account, {
        fee: 100,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset: customAsset,
            limit: "10000000",
          })
        )
        .setTimeout(100)
        .build();
      transaction.sign(keypair);
      return server.submitTransaction(transaction);
    })
    .then(function (result) {
      console.log("Trustline established successfully. \n", result);
      return true;
    })
    .catch(function (error) {
      console.log("Error establishing trustline!", error, error.message);
      return false;
    });
};

// List claimable assets on the current configured network
exports.listClaimableAssets = async (assetCode) => {
  const server = new Server(BANTU_NETWORK);
  if (assetCode) {
    return await server
      .assets()
      .forCode(assetCode)
      .call()
      .then(function (resp) {
        console.log("TOken list", resp);
        return resp;
      })
      .catch(function (err) {
        console.log("Token list error", err);
        return false;
      });
  } else {
    return await server
      .assets()
      .call()
      .then(function (resp) {
        console.log("TOken list", resp);
        return resp;
      })
      .catch(function (err) {
        console.log("Token list error", err);
        return false;
      });
  }
};

exports.creditAssetToUser = async (
  amount,
  asset_code,
  // asset_issuer,
  destination_address
) => {
  const baseUrl = BANTU_NETWORK;
  const networkPassphrase = BANTU_NETWORK_PASSPHRASE;

  const server = new Server(baseUrl);

  const keypair = Keypair.fromSecret(DISTRIBUTION_SECRET_KEY);

  var asset = new Asset(asset_code, ISSUER_ADDRESS);
  let credit_amount = amount.toString();

  return await server
    .loadAccount(keypair.publicKey())
    .then(function (account) {
      var transaction = new TransactionBuilder(account, {
        fee: BASE_FEE || 100,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: destination_address,
            asset,
            amount: credit_amount,
          })
        )
        .setTimeout(100)
        .build();
      transaction.sign(keypair);
      return server.submitTransaction(transaction);
    })
    .then(function (result) {
      console.log("Asset paid successfully. \n", result);
      return true;
    })
    .catch(function (error) {
      console.log(
        "Error in making payment transaction",
        error.response.data,
        error.response.data.extras,
        error.response.data.extras.result_codes,
        error.message
      );
      return false;
    });
};

exports.deductUserAssetBalance = async (amount, userSecretKey) => {
  const baseUrl = BANTU_NETWORK;
  const networkPassphrase = BANTU_NETWORK_PASSPHRASE;

  const server = new Server(baseUrl);

  const keypair = Keypair.fromSecret(userSecretKey);

  var asset = new Asset(ASSET_CODE, ISSUER_ADDRESS);
  let credit_amount = amount.toString();

  return await server
    .loadAccount(keypair.publicKey())
    .then(function (account) {
      var transaction = new TransactionBuilder(account, {
        fee: BASE_FEE || 100,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: DISTRIBUTION_PUBLIC_KEY,
            asset,
            amount: credit_amount,
          })
        )
        .setTimeout(100)
        .build();
      transaction.sign(keypair);
      return server.submitTransaction(transaction);
    })
    .then(function (result) {
      console.log(
        "Asset paid to distribution account successfully. \n",
        result
      );
      return true;
    })
    .catch(function (error) {
      console.log("Error in making payment transaction", error, error.message);
      return false;
    });
};

exports.transferAsset = async (amount, userSecretKey, recieverPublicKey) => {
  const baseUrl = BANTU_NETWORK;
  const networkPassphrase = BANTU_NETWORK_PASSPHRASE;

  const server = new Server(baseUrl);

  const keypair = Keypair.fromSecret(userSecretKey);

  var asset = new Asset(ASSET_CODE, ISSUER_ADDRESS);


  return await server
    .loadAccount(keypair.publicKey())
    .then(function (account) {
      var transaction = new TransactionBuilder(account, {
        fee: BASE_FEE || 100,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: recieverPublicKey,
            asset,
            amount,
          })
        )
        .setTimeout(100)
        .build();
      transaction.sign(keypair);
      return server.submitTransaction(transaction);
    })
    .then(function (result) {
      console.log(
        `Asset paid to account ${recieverPublicKey} successfully. \n`,
        result
      );
      return true;
    })
    .catch(function (error) {
      console.log("Error in making payment transaction", error, error.message);
      return false;
    });
};
