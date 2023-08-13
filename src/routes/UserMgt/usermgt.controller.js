const trnx = require("../../connectWeb3/index");

const CreateAccount = async (req, res) => {
    const {email} = req.body
    const {network} = req.params
    try {
        const AccountCreated = await trnx.createAccount(email, network);
        if (network == "bantu") {
            return res.status(200).json({
              status: "success", message: "Account created successfully",
              data: {
                bantuAddress: AccountCreated.publicKey(),
                bantuSecret: AccountCreated.secret()
              }
            });
          }  
          if (network == "matic") {    
            console.log("Account created successfully", AccountCreated);
          return res.json({ 
            status: "success", message: "Account created successfully",
            data: {
              publicKey: AccountCreated.address,
              privateKey: AccountCreated.privateKey
            }
           });
        }  
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const AddAdmin = async (req, res) => {
    const address = req.params.address
    try {
        const AddedAdmin = await trnx.addAdmin(address);
        return res.json({ AddedAdmin }); 
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const RemoveAdmin = async (req, res) => {
    const address = req.params.address
    try {
        const RemovedAdmin = await trnx.removeAdmin(address);
        return res.json({ RemovedAdmin });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const AddAuthorizer = async (req, res) => {
    const address = req.params.address
    try {
        const AddedAuthorizer = await trnx.addAuthorizer(address);
        return res.json({ AddedAuthorizer }); 
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const RemoveAuthorizer = async (req, res) => {
    const address = req.params.address
    try {
        const RemovedAdmin = await trnx.removeAuthorizer(address);
        return res.json({ RemovedAdmin });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const AddBlackList = async (req, res) => {
    const address = req.params.address
    const adminaddr = req.params.adminaddr
    const adminpwsd = req.params.adminpwsd
    try {
        const AddedBlackList = await trnx.addBlackList(address, adminaddr, adminpwsd);
        return res.json({ AddedBlackList }); 
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const RemoveBlackList = async (req, res) => {
    const address = req.params.address
    const adminaddr = req.params.adminaddr
    const adminpwsd = req.params.adminpwsd
    try {
        const RemovedBlacklist = await trnx.removeBlackList(address, adminaddr, adminpwsd);
        return res.json({ RemovedBlacklist });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

function replaceErrors(key, value) {
    if (value instanceof Error) {
        var error = {};
  
        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });
  
        return error;
    }
  
    return value;
  }
  
  function getPureError(error) {
    return JSON.parse(JSON.stringify(error, replaceErrors));
  }

const AddUserList = async (req, res) => {
    const address = req.params.address
    try {
        const AddedUser = await trnx.addUserList(address);
        return res.json({ AddedUser }); 
    } catch(error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error) });
    }
};

const RemoveUserList = async (req, res) => {
    const address = req.params.address
    try {
        const RemovedUser = await trnx.removeUserList(address);
        return res.json({ RemovedUser });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const Pause = async (req, res) => {
    try {
        const PauseContract = await trnx.pause();
        return res.json({ PauseContract }); 
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

const Unpause = async (req, res) => {
    try {
        const UnpauseContract = await trnx.unpause();
        return res.json({ UnpauseContract });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: getPureError(error)});
    }
};

module.exports = {
    CreateAccount,
    AddAdmin,
    AddAuthorizer,
    AddBlackList,
    AddUserList,
    RemoveAdmin,
    RemoveAuthorizer,
    RemoveBlackList,
    RemoveUserList,
    Pause,
    Unpause
};