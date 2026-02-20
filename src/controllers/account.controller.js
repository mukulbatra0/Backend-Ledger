const accountModel = require("../models/account.model")

async function createAccountController(req, res){
  const user = req.user
  const account = await accountModel.create({
    user : user._id
  })
  res.status(201).json({
    message:"account created successfully",
    account
  })
}

async function getAccountController(req, res){
  const account = await accountModel.find({user:req.user._id})
  res.status(200).json({
    account
  })
}

async function getBalanceController(req, res){
  const {accountId} = req.params

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id
  })

  if(!account){
    return res.status(400).json({
      message:"Account not found"
    })
  }

  const balance = await account.getBalance()
  res.status(200).json({
    accountId:account._id,
    balance
  })

}

module.exports = {
  createAccountController,
  getAccountController,
  getBalanceController
}