require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/SBExceSqNZZFuVK5flyAe1cNOdHeca2h",
      accounts: ["e30d58fb729e378fe232ef4c76684cb60508c68e1b7e0b76df9559859950b0b4"]
    },
  //   polygon: {
  //     url: process.env.BLOCKCHAINSERV,
  //     accounts: [process.env.PRIVATE_KEY]
  // },
  },
  etherscan: {
    apiKey: "YVP7FYSQH34G7VSX7K6AKJYR1NIEM3F8VF",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};