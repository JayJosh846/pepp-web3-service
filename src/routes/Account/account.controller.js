const trnx = require("../../connectWeb3/index");

const GetName = async (req, res) => {
  try {
    const ContractName = await trnx.getName();

    return res.json({ ContractName });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetSuperAdminAcc = async (req, res) => {
  try {
    const SuperAdminAddr = await trnx.getOwner();

    return res.json({ SuperAdminAddr });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetUsersList = async (req, res) => {
  const address = req.params.address
  try {
    const UsersList = await trnx.getUsersList(address);

    return res.json({ UsersList });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetAdminList = async (req, res) => {
  const address = req.params.address
  try {
    const AdminsList = await trnx.getAdminList(address);

    return res.json({ AdminsList });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetAuthorizersList = async (req, res) => {
  const address = req.params.address
  try {
    const AuthorizersList = await trnx.getAuthorizerList(address);

    return res.json({ AuthorizersList });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetBlackList = async (req, res) => {
  const address = req.params.address
  try {
    const BlackListed = await trnx.getBlackListed(address);

    return res.json({ BlackListed });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetTotalSupply = async (req, res) => {
  try {
    const TokenTotalSupply = await trnx.totalSupply();

    return res.json({ TokenTotalSupply });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetTotalIssued = async (req, res) => {
  const address = req.params.address
  try {
    const TotalIssued = await trnx.totalIssued(address);

    return res.json({ TotalIssued });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetTotalRedeemed = async (req, res) => {
  const address = req.params.address
  try {
    const TotalRedeemed = await trnx.totalRedeemed(address);

    return res.json({ TotalRedeemed });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetBalance = async (req, res) => {
  const email = req.params.email
  const network = req.params.network
  try {
    const Balance = await trnx.balanceOf(email, network);

    return res.json({ Balance });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const GetAllowance = async (req, res) => {
  const tokenOwner = req.params.tokenOwner
  const spenderAddr = req.params.spenderAddr
  
  try {
    const Allowed = await trnx.allowance(tokenOwner, spenderAddr);
    return res.json({ Allowed });
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const IsOwner = async (req, res) => {
  const address = req.params.address  
  try {
    const AddressIsOwner = await trnx.isOwner(address);
    return res.json({ AddressIsOwner });
  
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const IsPaused = async (req, res) => {
  try {
    const ContractIsPaused = await trnx.isPaused();
    return res.json({ ContractIsPaused });
  
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const IsUserListed = async (req, res) => {
  const address = req.params.address  
  try {
    const AddressIsUser = await trnx.isUserListed(address);
    return res.json({ AddressIsUser });
  
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const IsAdmin = async (req, res) => {
  const address = req.params.address  
  try {
    const AddressIsAdmin = await trnx.isAdmin(address);
    return res.json({ AddressIsAdmin });
  
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const IsAuthorizer = async (req, res) => {
  const address = req.params.address  
  try {
    const AddressIsAuthorizer = await trnx.isAuthorizer(address);
    return res.json({ AddressIsAuthorizer });
  
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};

const IsBlackListed = async (req, res) => {
  const address = req.params.address  
  try {
    const AddrIsBlacklisted = await trnx.isBlackListed(address);
    return res.json({ AddrIsBlacklisted });
  
  } catch (error) {
    res.status(500);
    return res.json({ status: false, message: error });
  }
};



module.exports = {
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
  GetAllowance
};