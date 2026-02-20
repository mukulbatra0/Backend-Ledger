const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../service/email.service");
const mongoose = require("mongoose")

async function createTransactionController(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  //check if fromAccount and toAccount are same
  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromAccount || !toAccount) {
    return res.status(400).json({
      message: "Invlid fromAccount or toAccount ",
    });
  }

  //validate idempotencyKey

  const isTransactionExist = await transactionModel.findOne({ idempotencyKey });

  if (isTransactionExist) {
    if (isTransactionExist.status === "completed") {
      return res.status(200).json({
        success: false,
        message: "Transaction already completed",
      });
    }
    if (isTransactionExist.status === "pending") {
      return res.status(200).json({
        message: "Transaction is pending",
      });
    }
    if (isTransactionExist.status === "failed") {
      return res.status(500).json({
        message: "Transaction failed",
      });
    }

    if (isTransactionExist.status === "reversed") {
      res.status(500).json({
        message: "Transaction reversed",
      });
    }
  }

  // check account status
  if (
    fromUserAccount.status !== "active" ||
    toUserAccount.status !== "active"
  ) {
    return res.status(400).json({
      success: false,
      message: "Account is not active",
    });
  }
  // drive sender balance form ledger
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      messange: "Insuficient balance in fromAccount",
    });
  }
  // create transaction pending

  const session = await mongoose.startSession();
  session.startTransaction();
  const transaction = await transactionModel.create([{
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status: "pending"
  }], {session})

  const debitLedgerEntery = await ledgerModel.create([{
    account:fromAccount,
    amount:amount,
    type:"debit",
    transaction:transaction[0]._id
  }], {session})

  const creditLedgerEntery = await ledgerModel.create([{
    account: toAccount,
    amount: amount,
    type:"credit",
    transaction:transaction[0]._id
  }], {session})

  transaction.status = "completed"
  await transaction.save({session}) 

  await session.commitTransaction()
  session.endSession()


  await emailService.sendEmail(
    fromUserAccount.email,
    "Transaction completed",
    `Your transaction of ${amount} has been completed successfully`)
  await emailService.sendEmail(
    toUserAccount.email,
    "Transaction received",
    `Your transaction of ${amount} has been received successfully`
  );

  return res.status(201).json({
    success: true,
    message: "Transaction completed successfully",
    transaction,
  });

}

async function createInitialFundTreansction(req,res){
  const {toAccount,amount,idempotencyKey} = req.body
  if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  }
  
  const toUserAccount = await accountModel.findOne({_id:toAccount})

  if(!toUserAccount){
    return res.status(400).json({
      success:false,
      message:"Invalid toAccount"
    }) 
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id
  })
  
  if(!fromUserAccount){
    return res.status(400).json({
      success:false,
      message:"System account not found"
    })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  const transaction = await transactionModel.create([{
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"pending"
  }], {session})

  const debitLedgerEntery = await ledgerModel.create([{
    account:fromUserAccount._id,
    amount:amount,
    type:"debit",
    transaction:transaction[0]._id
  }], {session})

  const creditLedgerEntery = await ledgerModel.create([{
    account:toAccount,
    amount:amount,
    type:"credit",
    transaction:transaction[0]._id
  }], {session})

  transaction[0].status = "completed"
  await transaction[0].save({session})

  await session.commitTransaction()
  session.endSession()

  return res.status(201).json({
    message:"Transaction completed successfully",
    transaction
  })
}

module.exports = {
  createTransactionController,
  createInitialFundTreansction
};
