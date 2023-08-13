require('dotenv').config();


exports.Config = {

    // BANTU
    BANTU_NETWORK:
    process.env.NODE_ENV == "production"
      ? "https://expansion.bantu.network"
      : "https://expansion-testnet.bantu.network",

  BANTU_NETWORK_PASSPHRASE:
    process.env.NODE_ENV == "production"
      ? process.env.BANTU_NETWORK_PASSPHRASE
      : process.env.BANTU_NETWORK_PASSPHRASE_TEST,

  DISTRIBUTION_SECRET_KEY:
    process.env.NODE_ENV == "production"
      ? process.env.DISTRIBUTION_SECRET_KEY
      : process.env.DISTRIBUTION_SECRET_KEY_TEST,


  ASSET_CODE: process.env.ASSET_CODE || "PEPP",

  ISSUER_ADDRESS:
    process.env.NODE_ENV == "production"
      ? process.env.ISSUER_ACCOUNT
      : process.env.ISSUER_ACCOUNT_TEST,

  DISTRIBUTION_PUBLIC_KEY:
    process.env.NODE_ENV == "production"
      ? process.env.DISTRIBUTION_PUBLIC_KEY
      : process.env.DISTRIBUTION_PUBLIC_KEY_TEST,
  
  ADMIN:
    process.env.NODE_ENV == 'production'
      ? process.env.ADMIN
      : process.env.ADMIN_TEST,
  
  ADMIN_PASS:
    process.env.NODE_ENV == 'production'
      ? process.env.ADMIN_PASS
      : process.env.ADMIN_PASS_TEST,
  
  CONTRACTADDR:
    process.env.NODE_ENV == 'production'
      ? process.env.CONTRACTADDR
      : process.env.CONTRACTADDR_TEST,

  OPERATIONSADDR:
    process.env.NODE_ENV == 'production'
      ? process.env.OPERATIONSADDR
      : process.env.OPERATIONSADDR_TEST,
  
  BLOCKCHAINSERV:
    process.env.NODE_ENV == 'production'
      ? process.env.BLOCKCHAINSERV
      : process.env.BLOCKCHAINSERV_TEST,
  
  DEPLOYEDCONTRACT:
    process.env.APPENV == 'production'
      ? process.env.CONTRACTADDR :
      process.env.TEST_CONTRACTADDR,

  DEPLOYEDNFTCONTRACT:
    process.env.NODE_ENV == 'production'
      ? process.env.NFTCONTRACTADDR 
      : process.env.NFTCONTRACTADDR_TEST,

  RELAY_GASLESS_API:
    process.env.NODE_ENV == 'production'
      ? process.env.RELAY_GASLESS_API_KEY
      : process.env.RELAY_GASLESS_API_KEY_TEST,
  
  RELAY_GASLESS_SECRET:
    process.env.NODE_ENV == 'production'
      ? process.env.RELAY_GASLESS_API_SECRET
      : process.env.RELAY_GASLESS_API_SECRET_TEST,

  WHITELISTDOMAINS: [
        "172.31.22.207",
        "https://172.31.22.207",
        "3.138.231.35",
        "https://3.138.231.35",
      ],

}
