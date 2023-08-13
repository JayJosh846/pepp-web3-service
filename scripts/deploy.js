const { ethers, upgrades } = require("hardhat");

async function main() {
   const gas = await ethers.provider.getGasPrice()
   const chats = await ethers.getContractFactory("Chats");
   const operation = await ethers.getContractFactory("Operations");

   console.log("Deploying Operations contract...");
   const upgradeableOPs = await upgrades.deployProxy(operation);
   await upgradeableOPs.deployed();
   console.log("Upgradeable OPs Contract deployed to:", upgradeableOPs.address);

   console.log("Deploying CHATS contract...");
   const upgradeChats = await upgrades.deployProxy(chats, [upgradeableOPs.address]);
   await upgradeChats.deployed();
   console.log("Upgradeable CHATS Contract deployed to:", upgradeChats.address);
}

main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });