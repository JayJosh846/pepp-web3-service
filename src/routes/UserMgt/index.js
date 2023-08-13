const router = require('express').Router();
const {
    CreateAccount,
    AddAdmin,
    AddAuthorizer,
    AddBlackList,
    AddUserList,
    RemoveAdmin,
    RemoveAuthorizer,
    RemoveBlackList,
    RemoveUserList,
    // Pause,
    // Unpause
} = require('./usermgt.controller')

router.post('/register/:network', CreateAccount);

router.post('/addadmin/:address', AddAdmin);
router.post('/removeadmin/:address', RemoveAdmin);

router.post('/addauth/:address', AddAuthorizer);
router.post('/removeauth/:address', RemoveAuthorizer);

router.post('/adduser/:address', AddUserList);
router.post('/removeuser/:address', RemoveUserList);

router.post('/addblacklist/:address/:adminaddr/:adminpwsd', AddBlackList);
router.post('/removeblackList/:address/:adminaddr/:adminpwsd', RemoveBlackList);

// router.post('/pause', Pause);
// router.post('/unpause', Unpause);

module.exports = router;