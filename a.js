const ethers = require('ethers');
const sss  = async ()=>{
    const provider= ethers.providers.getDefaultProvider("https://polygon-mumbai.g.alchemy.com/v2/SBExceSqNZZFuVK5flyAe1cNOdHeca2h");
    const tx = await provider.getTransactionReceipt("0x3705f608a790db616e58521704e3d9e0f22fe9620225018ac1d55216cc6aa48e")
   console.log(tx.logs[1].topics)
}

sss()
