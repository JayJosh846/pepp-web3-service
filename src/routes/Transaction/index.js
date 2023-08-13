
const router = require('express').Router();
const VerifyChecksum = require('../../middleware/verifyChecksum');
const { 
    TransferAdmin, 
    Transfers, 
    Minting, 
    Redeeming, 
    Approve, 
    Disapprove, 
    TransferFrom, 
    DestroyBlackFunds,
    mintNFT,
    burnNFT,
    NFTtransferFrom,
    setNFTlimit,
    deployCollection,
    NFTapprove,
    NFTsetApprovalForAll,
    SetParams,
    increaseGasPrice } = require('./txn.controller');

router.post('/transferadmin/:receiver/:amount', TransferAdmin);
router.post('/transfer/:network', Transfers);
router.post('/mint/:network', Minting);
router.post('/burn/:network',  Redeeming);
router.post('/distroyblackfund/:useraddr', DestroyBlackFunds);
router.post('/approve/:tokenownerpswd/:spenderaddr/:amount', Approve);
router.post('/disapprove/:tokenownerpswd/:spenderaddr/:amount', Disapprove);
router.post('/transferfrom/:tokenowneraddr/:receiveraddr/:spenderpwsd/:amount', TransferFrom);
router.post('/setparams/:pointbase/:maxfee', SetParams);

router.post('/increase-gas-price/', increaseGasPrice)

module.exports = router;
