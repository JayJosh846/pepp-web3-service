const trnx = require("../../connectWeb3/index");
const { ethers } = require("ethers");

const TransferAdmin = async (req, res) => {
        const receiver = req.params.receiver
        const amount = req.params.amount
    try {
        const TransferByAdmin = await trnx.transferAdmin(receiver, amount);
        return res.json({ TransferByAdmin });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const Transfers = async (req, res) => {
    const {
        email, 
        amount, 
        receiver} = req.body;
    const network = req.params.network

    try {
        const Transfered = await trnx.transfers(email, receiver, amount, network);
        
        return res.json({ Transfered });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const Minting = async (req, res) => {
    const {email, amount} = req.body;
    const network = req.params.network
    try {
        const Minted = await trnx.minting(amount, email, network);
        
        return res.json({ Minted });
    } catch (error) {
        console.log(error);
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const Redeeming = async (req, res) => {
    const {email, amount} = req.body;
    const network = req.params.network
    try {
        const Redeemed = await trnx.redeeming(email, amount, network);
        
        return res.json({ Redeemed });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const Approve = async (req, res) => {
    const tokenownerpswd = req.params.tokenownerpswd
    const spenderaddr = req.params.spenderaddr
    const amount = req.params.amount
    try {
        const Approved = await trnx.approve( tokenownerpswd, spenderaddr, amount);
        
        return res.json({ Approved });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const Disapprove = async (req, res) => {
    const tokenownerpswd = req.params.tokenownerpswd
    const spenderaddr = req.params.spenderaddr
    const amount = req.params.amount
    try {
        const Disapproved = await trnx.disApprove( tokenownerpswd, spenderaddr, amount);
        
        return res.json({ Disapproved });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const TransferFrom = async (req, res) => {
    const tokenowneraddr = req.params.tokenowneraddr
    const receiveraddr = req.params.receiveraddr
    const spenderpwsd = req.params.spenderpwsd
    const amount = req.params.amount;
    
    try {
        const TransferedFrom = await trnx.transferFrom(tokenowneraddr, receiveraddr, spenderpwsd, amount);
        
        return res.json({ TransferedFrom });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const DestroyBlackFunds = async (req, res) => {
    const useraddr = req.params.useraddr;
    try {
        const DestroyedFunds = await trnx.destroyBlackFunds(useraddr);
        
        return res.json({ DestroyedFunds });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

const SetParams = async (req, res) => {
    const pointbase = req.params.pointbase;
    const maxfee = req.params.maxfee;
    try {
        const SetParams = await trnx.setParams(pointbase, maxfee);
        
        return res.json({ SetParams });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};



const increaseGasPrice = async (req, res) => {
    try {
        let args = [];
        for (let param in req.body) {
            if(param == "amount")
                args.push(ethers.utils.parseUnits(req.body[param], "mwei"));
            else
                args.push(req.body[param]);
        }
        const retried = await trnx.increaseGasPrice(...args); 
        return res.json({ retried });
    } catch (error) {
        res.status(500);
        return res.json({ status: false, message: error });
    }
};

module.exports = {
    TransferAdmin,
    Transfers,
    Approve,
    Disapprove,
    Minting,
    Redeeming,
    TransferFrom,
    DestroyBlackFunds,
    SetParams,
    increaseGasPrice
};