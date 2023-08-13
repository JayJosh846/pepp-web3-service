const { Config } = require("../utils");
const { ethers, Contract } = require("ethers");
const { NonceManager } = require("@ethersproject/experimental");
const provider = new ethers.providers.getDefaultProvider(Config.BLOCKCHAINSERV);

async function wallet(_pkey) {
  const wallet = new ethers.Wallet(_pkey, provider);
  return wallet;
}

async function sendEther(_amount, addressTo, _gas){
  const walletInit = await wallet(Config.ADMIN_PASS);
  const tx = {
        to: addressTo,
        value: ethers.utils.parseEther(_amount),
        gasPrice: _gas
      };
      const createReceipt = await walletInit.sendTransaction(tx)
      await createReceipt.wait();
    }
  
    module.exports.adminTrx = async (_contract, _method, ..._params) => {
      const nonceManager = new NonceManager(_contract.signer)
      await nonceManager.incrementTransactionCount()
      const gasPrice = await provider.getGasPrice() 
      const overrides = { gasPrice }
      const createReceipt = await _contract[_method](..._params, overrides);
    return createReceipt.hash;
  }

    module.exports.userTrx = async (_contract, _method, ..._params) => {
    const nonceManager = new NonceManager(_contract.signer)
    await nonceManager.incrementTransactionCount()
    const gasPrice = await provider.getGasPrice()
    const overrides = { gasPrice }
    const gas = await _contract.estimateGas[_method](..._params)
    const getAmount = gas * gasPrice
    const amount = ethers.utils.formatUnits(getAmount.toString())
       await sendEther(amount, _contract.signer.address, gasPrice).catch((error) => {
           throw Error(`Error funding matic to user wallet: ${error.message}`);  
      })
    overrides.gasLimit = gas.mul(105).div(100);
    const createReceipt = await _contract[_method](..._params, overrides);
    const addressBalance = await provider.getBalance(_contract.signer.address)
    sendEther(ethers.utils.formatUnits(addressBalance.toString()), Config.ADMIN, gasPrice).catch((error) => {
      throw Error(`Error refunding matic to admin: ${error.message}`);  
      })
  return createReceipt.hash;
}

    module.exports.increaseGasPrice = async(_contract, _method, ..._params) => {
    const nonceManager = new NonceManager(_contract.signer)
    await nonceManager.incrementTransactionCount()
    const getGasPrice = await provider.getGasPrice()
    const gasPrice = getGasPrice.mul(110).div(100)
    const overrides = { gasPrice }
    const gas = await _contract.estimateGas[_method](..._params)
    const getAmount = gas * gasPrice
    if(_contract.signer.address !== Config.ADMIN){
      await sendEther(ethers.utils.formatUnits(getAmount.toString()), _contract.signer.address, gasPrice).catch((error) => {
        throw Error(`Error funding matic to user wallet: ${error.message}`);  
        })
      }
    overrides.gasLimit = gas.mul(110).div(100)
    const createReceipt = await _contract[_method](..._params, overrides);
    const addressBalance = await provider.getBalance(_contract.signer.address)
    sendEther(ethers.utils.formatUnits(addressBalance.toString()), Config.ADMIN, gasPrice).catch((error) => {
      throw Error(`Error refunding matic to admin: ${error.message}`);  
      })
    
  return createReceipt.hash;
}