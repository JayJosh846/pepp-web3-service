const router = require('express').Router();
const {
  GetName,
  GetSuperAdminAcc,
  GetUsersList,
  GetAdminList,
  GetAuthorizersList,
  GetBlackList,
  GetTotalSupply,
  GetTotalIssued,
  GetTotalRedeemed,
  GetBalance,
  GetAllowance,
} = require('./account.controller')

router.get('/ping/', GetName);
router.get('/superadmin', GetSuperAdminAcc);
router.get('/userlist/:address', GetUsersList);
router.get('/adminlist/:address', GetAdminList);
router.get('/authlist/:address', GetAuthorizersList);
router.get('/blacklist/:address', GetBlackList);
router.get('/totalsupply', GetTotalSupply);
router.get('/issuedamt/:address', GetTotalIssued);
router.get('/redeemamt/:address', GetTotalRedeemed);
router.get('/balance/:email/:network', GetBalance);
router.get('/allowance/:tokenOwner/:spenderAddr', GetAllowance);


module.exports = router;