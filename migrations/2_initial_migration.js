const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const pepp = artifacts.require('Pepp');
const operations = artifacts.require('Operations');

/** Deploy contract using openzeppelin deployProxy, which will create a proxy address for you */
module.exports = async (deployer) => {
  const deployed = await deployProxy(operations, { deployer });
  const peppAddress = await deployProxy(pepp, 
    [deployed.address],  
  { deployer });
  console.log('PEPP Token Contract is deployed', peppAddress.address);

}; 
